// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!


// DOM Elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Event Listeners
fetchButton.addEventListener('click', fetchWeatherAlerts);

stateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherAlerts();
    }
});

async function fetchWeatherAlerts() {
    const state = stateInput.value.trim().toUpperCase();

    // Clear previous results
    alertsDisplay.innerHTML = '';
    errorMessage.classList.add('hidden');

    // Input Validation
    if (!state || state.length !== 2 || !/^[A-Z]{2}$/.test(state)) {
        showError("Please enter a valid 2-letter U.S. state code (e.g., NY, CA, TX)");
        return;
    }

    try {
        const response = await fetch(weatherApi + state, {
            headers: {
                'User-Agent': 'WeatherAlertsApp/1.0 (your.email@example.com)',
                'Accept': 'application/geo+json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        displayAlerts(data, state);
        
        // IMPORTANT: Clear input after successful fetch (required by test)
        stateInput.value = '';

    } catch (error) {
        console.error(error);
        showError("Failed to fetch weather alerts. Please check your connection and try again.");
    }
}

function displayAlerts(data, state) {
    const features = data.features || [];

    if (features.length === 0) {
        alertsDisplay.innerHTML = `
            <div class="no-alerts">
                No active weather alerts for <strong>${state}</strong> at this time.
            </div>`;
        return;
    }

    let html = `<h2>Active Alerts for ${state} (${features.length})</h2>`;

    features.forEach((alert) => {
        const props = alert.properties || {};
        html += `
            <div class="alert">
                <strong>${props.headline || 'Weather Alert'}</strong><br>
                <small>${props.description ? props.description.substring(0, 250) + '...' : 'No description available'}</small>
            </div>`;
    });

    alertsDisplay.innerHTML = html;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}