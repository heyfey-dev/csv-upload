// Function to handle file upload and parse CSV
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Display error message if the file is not a CSV
    if (file.type !== 'text/csv') {
        document.querySelector('.file-details').textContent = "Please upload a valid CSV file.";
        return;
    }

    // Parse CSV and save data to session storage
    Papa.parse(file, {
        header: true,  // Parse with headers if the file includes them
        complete: function(results) {
            const rowCount = results.data.length;
            document.querySelector('.file-details').innerHTML = `${file.name} <br> (${rowCount} rows detected)`;

            // Store entire parsed CSV data in session storage
            sessionStorage.setItem('csvData', JSON.stringify(results.data));
        },
        error: function() {
            document.querySelector('.file-details').textContent = "Error reading the CSV file.";
        }
    });
}

// Function to clear the uploaded file and reset display
function cancelUpload() {
    const fileInput = document.getElementById('file-upload');
    const fileDetails = document.querySelector('.file-details');
    
    fileInput.value = '';  // Clear the file from the input
    fileDetails.textContent = ''; // Clear displayed file details
}

// Handle import button click
function handleImport() {
    const fileInput = document.getElementById('file-upload');
    if (fileInput.files.length) {
        window.location.href = 'importCSV.html';
    } else {
        alert("Please upload a CSV file before importing.");
    }
}

// Attach event listener for file upload
document.getElementById('file-upload').addEventListener('change', handleFileUpload);




const csvData = JSON.parse(sessionStorage.getItem('csvData'));
        const headers = csvData && csvData.length ? Object.keys(csvData[0]) : [];

        function populateSelectOptions(selectId) {
          const selectElement = document.getElementById(selectId);
          headers.forEach(header => {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            selectElement.appendChild(option);
          });
        }

        populateSelectOptions('phone-select');
        populateSelectOptions('firstname-select');

        function removeField(field) {
          document.getElementById(`${field}-checkbox`).checked = false;
        }

        async function addToTable() {
          const selectedPhone = document.getElementById('phone-select').value;
          const selectedFirstName = document.getElementById('firstname-select').value;

          // Prepare the data to upload
          const dataToUpload = csvData.map(row => ({
            phone: row[selectedPhone],
            first_name: row[selectedFirstName]
          }));

          try {
            for (let record of dataToUpload) {
              console.log('Sending record:', record); // Log each record being sent

              const response = await fetch('https://csvupload-backend.onrender.com/api/addRecord', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields: record }) // Payload format
              });

              const responseData = await response.json();
              console.log('Response data:', responseData);

              if (!response.ok) {
                throw new Error(`Failed to add record: ${response.statusText}`);
              }
            }
            alert('Data added to MongoDB successfully!');
          } catch (error) {
            console.error('Error adding data to MongoDB:', error);
          }
        }