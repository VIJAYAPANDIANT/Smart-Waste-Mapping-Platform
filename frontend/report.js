document.getElementById('detectLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
            document.getElementById('lat-long-display').textContent = `Detected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }, (error) => {
            alert('Error detecting location. Please enter manually.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

document.getElementById('photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.querySelector('#photoPreview img');
            const span = document.querySelector('#photoPreview span');
            preview.src = event.target.result;
            preview.style.display = 'block';
            span.style.display = 'none';
            // Enable analyze button once photo is selected
            document.getElementById('analyzeBtn').disabled = false;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const photoFile = document.getElementById('photo').files[0];
    if (!photoFile) return;

    const analyzeBtn = document.getElementById('analyzeBtn');
    const statusText = document.getElementById('ai-status');
    const categorySelect = document.getElementById('wasteCategory');

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    statusText.textContent = 'AI is analyzing your image...';
    statusText.className = 'status-text loading';

    const reader = new FileReader();
    reader.onloadend = async () => {
        try {
            const response = await fetch('http://localhost:3000/analyzeWaste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageBase64: reader.result })
            });

            const data = await response.json();

            if (response.ok) {
                categorySelect.value = data.category;
                statusText.textContent = `Detected: ${data.category} ${data.mock ? '(Mock)' : ''}`;
                statusText.className = 'status-text success';
            } else {
                statusText.textContent = 'AI analysis failed. Please select manually.';
                statusText.className = 'status-text error';
            }
        } catch (error) {
            console.error('Error analyzing image:', error);
            statusText.textContent = 'Connection error. Please select manually.';
            statusText.className = 'status-text error';
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Analyze Image';
        }
    };
    reader.readAsDataURL(photoFile);
});

document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('wasteCategory').value;
    const lat = document.getElementById('latitude').value;
    const lng = document.getElementById('longitude').value;
    const photoFile = document.getElementById('photo').files[0];

    // In a real app, we would upload the photo to Firebase Storage first
    // For this prototype, we'll convert to Base64 (not recommended for large files but good for demo)
    const reader = new FileReader();
    reader.onloadend = async () => {
        const reportData = {
            location,
            description,
            category,
            latitude: lat || 0,
            longitude: lng || 0,
            photo_url: reader.result, // Base64 for now
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const response = await fetch('http://localhost:3000/reportWaste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (response.ok) {
                alert('Report submitted successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Error submitting report.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to backend.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    };
    
    if (photoFile) {
        reader.readAsDataURL(photoFile);
    } else {
        alert('Please upload a photo.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Report';
    }
});
