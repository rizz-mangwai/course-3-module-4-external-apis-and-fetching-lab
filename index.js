// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// index.js
// index.js

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
        const response = await fetch(weatherApi + state);

        if (!response.ok) {
            throw new Error('Network failure');
        }

        const data = await response.json();
        
        displayAlerts(data, state);
        
        // Clear input after successful fetch (required by test)
        stateInput.value = '';

    } catch (error) {
        showError(error.message || 'Network failure');
    }
}

function displayAlerts(data, state) {
    const features = data.features || [];

    // Match test expectation: "Weather Alerts: X"
    alertsDisplay.innerHTML = `<h2>Weather Alerts: ${features.length}</h2>`;

    if (features.length === 0) {
        alertsDisplay.innerHTML += `
            <div class="no-alerts">
                No active weather alerts for ${state} at this time.
            </div>`;
        return;
    }

    features.forEach((alert) => {
        const props = alert.properties || {};
        const headline = props.headline || 'Weather Alert';
        alertsDisplay.innerHTML += `
            <div class="alert">
                <strong>${headline}</strong>
            </div>`;
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}