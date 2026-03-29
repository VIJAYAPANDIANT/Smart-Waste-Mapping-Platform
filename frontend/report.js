/**
 * Report Page — wrapped for SPA usage
 */

function initReport() {
    const detectBtn = document.getElementById('detectLocation');
    const photoInput = document.getElementById('photo');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const reportForm = document.getElementById('reportForm');

    if (!reportForm) return;

    detectBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lng;
                document.getElementById('lat-long-display').textContent = `Detected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                showToast('Location detected!');
            }, (error) => {
                showToast('Error detecting location. Please enter manually.', 'error');
            });
        } else {
            showToast('Geolocation is not supported by this browser.', 'error');
        }
    });

    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.querySelector('#photoPreview img');
                const span = document.querySelector('#photoPreview span');
                preview.src = event.target.result;
                preview.style.display = 'block';
                span.style.display = 'none';
                document.getElementById('analyzeBtn').disabled = false;
            }
            reader.readAsDataURL(file);
        }
    });

    analyzeBtn.addEventListener('click', async () => {
        const photoFile = document.getElementById('photo').files[0];
        if (!photoFile) return;

        const btn = document.getElementById('analyzeBtn');
        const statusText = document.getElementById('ai-status');
        const categorySelect = document.getElementById('wasteCategory');

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        statusText.textContent = 'AI is analyzing your image...';
        statusText.className = 'status-text loading';

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const response = await fetch('/analyzeWaste', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-robot"></i> Analyze Image';
            }
        };
        reader.readAsDataURL(photoFile);
    });

    reportForm.addEventListener('submit', async (e) => {
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

        const reader = new FileReader();
        reader.onloadend = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const reportData = {
                location,
                description,
                category,
                latitude: lat || 0,
                longitude: lng || 0,
                photo_url: reader.result,
                timestamp: new Date().toISOString(),
                status: 'pending',
                user_id: user ? user.id : null
            };

            try {
                const response = await fetch('/reportWaste', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportData)
                });

                if (response.ok) {
                    showToast('Report submitted successfully!');
                    // Use SPA navigation instead of full reload
                    navigateTo('app.html');
                } else {
                    showToast('Error submitting report.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Failed to connect to backend.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Report';
            }
        };

        if (photoFile) {
            reader.readAsDataURL(photoFile);
        } else {
            showToast('Please upload a photo.', 'info');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    });
}

function cleanupReport() {
    // No persistent resources to clean up for report page
}
