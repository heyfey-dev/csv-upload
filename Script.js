document.addEventListener('DOMContentLoaded', function() {
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
        
        if (fileInput) fileInput.value = '';  // Clear the file from the input
        if (fileDetails) fileDetails.textContent = ''; // Clear displayed file details
    }

    // Handle import button click
    function handleImport() {
        const fileInput = document.getElementById('file-upload');
        if (fileInput && fileInput.files.length) {
            window.location.href = 'importCSV.html';
        } else {
            alert("Please upload a CSV file before importing.");
        }
    }

    // Attach event listener for file upload if element exists
    const fileUploadElement = document.getElementById('file-upload');
    if (fileUploadElement) {
        fileUploadElement.addEventListener('change', handleFileUpload);
    }

    // Parse session storage data and handle missing data
    const csvData = JSON.parse(sessionStorage.getItem('csvData')) || [];
    const headers = csvData.length ? Object.keys(csvData[0]) : [];

    // Function to populate select options based on CSV headers
    function populateSelectOptions(selectId) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement || headers.length === 0) return; // Add checks for element and headers

        headers.forEach(header => {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            selectElement.appendChild(option);
        });
    }

    // Populate options if elements exist
    populateSelectOptions('phone-select');
    populateSelectOptions('firstname-select');

    // Function to uncheck field
    function removeField(field) {
        const checkbox = document.getElementById(`${field}-checkbox`);
        if (checkbox) checkbox.checked = false;
    }

    // Function to add data to the table
    async function addToTable() {
        const selectedPhone = document.getElementById('phone-select')?.value;
        const selectedFirstName = document.getElementById('firstname-select')?.value;

        // Prepare the data to upload
        const dataToUpload = csvData.map(row => ({
            phone: row[selectedPhone],
            first_name: row[selectedFirstName]
        }));

        try {
            for (let record of dataToUpload) {
                console.log('Sending record:', record);

                const response = await fetch('https://csvupload-backend.onrender.com/api/addRecord', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fields: record })
                });

                if (!response.ok) { 
                    const errorData = await response.json(); 
                    console.error('Error response data:', errorData); 
                    throw new Error(`Failed to add record: ${response.statusText}`);
                }

                const responseData = await response.json();
                console.log('Response data:', responseData);
            }
            alert('Data added to MongoDB successfully!');
        } catch (error) {
            console.error('Error adding data to MongoDB:', error);
        }
    }
});
