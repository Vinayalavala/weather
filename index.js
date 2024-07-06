let isCalculating = false;
let intervalId = null;
let totalData = 0;
let startTime = null;

document.getElementById('toggle-button').addEventListener('click', function() {
    if (isCalculating) {
        clearInterval(intervalId);
        this.textContent = 'Start';
    } else {
        startDataSpeedCalculation();
        this.textContent = 'Stop';
    }
    isCalculating = !isCalculating;
});

function startDataSpeedCalculation() {
    startTime = performance.now();
    totalData = 0;

    intervalId = setInterval(() => {
        const currentTime = performance.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds

        const dataSpeed = (totalData * 8) / (elapsedTime * 1_000_000); // Convert bytes to Megabits
        updateDataSpeed(dataSpeed);

        // Reset for the next interval
        totalData = 0;
        startTime = currentTime;
    }, 1000); // Update every 1 second

    // Simulate data transfer (for demonstration purposes)
    setInterval(() => {
        if (isCalculating) {
            const randomDataSize = Math.floor(Math.random() * 1024); // Random data size (up to 1 KB)
            totalData += randomDataSize;
        }
    }, 100); // Add random data every 0.1 second
}

// Function to update the displayed data speed
function updateDataSpeed(speed) {
    const speedElement = document.getElementById('data-speed');
    speedElement.textContent = speed.toFixed(2) + ' Mbps';
}

// Check if data speed calculation should be started initially
if (isCalculating) {
    startDataSpeedCalculation();
}

// Other existing code
// ...

document.getElementById('checkbox').addEventListener('change', function() {
    const body = document.body; 
    if (this.checked) {
        body.style.backgroundColor = 'black'; 
    } else {
        body.style.backgroundColor = 'white'; 
    }
});

const menuBars = document.querySelector('.menu-bars');
const dropMenu = document.querySelector('.drop-menu');

menuBars.addEventListener('click', function() {
    dropMenu.classList.toggle('active');
});

const lastLocation = localStorage.getItem("lastLocation");

if (lastLocation) {
    document.querySelector(".search input").value = lastLocation;
}

function updateLastLocation(city) {
    localStorage.setItem("lastLocation", city);
}

document.querySelector(".search button").addEventListener("click", () => {
    const city = document.querySelector(".search input").value;
    updateLastLocation(city); 
    checkweather(city);
});

if (lastLocation) {
    checkweather(lastLocation);
}

const body = document.body;

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    body.style.backgroundColor = 'rgb(48, 47, 47)';
    document.getElementById('checkbox').checked = true;
} else {
    body.style.backgroundColor = 'rgb(172, 163, 163)';
    document.getElementById('checkbox').checked = false;
}

function updateTheme(theme) {
    localStorage.setItem('theme', theme);
}

document.getElementById('checkbox').addEventListener('change', function () {
    if (this.checked) {
        body.style.backgroundColor = 'rgb(48, 47, 47)';
        updateTheme('dark'); 
    } else {
        body.style.backgroundColor = 'rgb(172, 163, 163)';
        updateTheme('light'); 
    }
});
