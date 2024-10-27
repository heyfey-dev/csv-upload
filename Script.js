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
