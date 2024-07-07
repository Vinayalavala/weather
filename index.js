function updateSignalIcon() {
    const signalStatus = document.getElementById('signal-status');
    const isConnected = navigator.onLine;
    const connectionType = navigator.connection ? navigator.connection.type : null;

    if (isConnected) {
        if (connectionType === 'wifi') {
            signalStatus.innerHTML = '<img src="wifi-icon.png" alt="WiFi" class="signal-icon">';
        } else {
            signalStatus.innerHTML = '<img src="mobile-data-icon.png" alt="Mobile Data" class="signal-icon">';
        }
    } else {
        signalStatus.innerHTML = '<img src="disconnected-icon.png" alt="Disconnected" class="signal-icon">';
    }
}

updateSignalIcon();

window.addEventListener('online', updateSignalIcon);
window.addEventListener('offline', updateSignalIcon);

setTimeout(function () {
    document.querySelector(".loader-wrapper").style.display = "none";
}, 2000);

function showNotification(message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
}

function checkConnection() {
    const isConnected = navigator.onLine;
    const disconnectedContainer = document.getElementById('disconnected-container');

    if (!isConnected) {
        disconnectedContainer.style.display = 'flex';
    } else {
        disconnectedContainer.style.display = 'none';
        showNotification('Your internet connection is live!');
    }
}

checkConnection();

window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);

const apikey = "ba707aac3c6c866490c9f22ada735ba3";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchbox = document.querySelector(".search input");
const searchbutton = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(`${apiurl}${city}&appid=${apikey}`);
    var data = await response.json();
    console.log(data);

    document.querySelector(".temp_max").innerHTML = data.main.temp_max + "°c";
    document.querySelector(".temp_min").innerHTML = data.main.temp_min + "°c";
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "KM/H";
    document.querySelector(".pressure").innerHTML = data.main.pressure + "pa";
    document.querySelector(".gust").innerHTML = data.wind.gust + "";
    document.querySelector(".feels_like").innerHTML = data.main.feels_like + "°c";
    document.querySelector(".ground_level").innerHTML = data.main.grnd_level + "";
    document.querySelector(".sea_level").innerHTML = data.main.sea_level + "";

    switch (data.weather[0].main) {
        case "Clouds":
            weatherIcon.src = "clouds.png";
            break;
        case "Clear":
            weatherIcon.src = "sun.png";
            break;
        case "Rain":
            weatherIcon.src = "rain.png";
            break;
        case "Drizzle":
            weatherIcon.src = "drizzle.png";
            break;
        case "Smoke":
            weatherIcon.src = "smoke.png";
            break;
        case "Mist":
            weatherIcon.src = "mist.png";
            break;
        case "Snow":
            weatherIcon.src = "snow.png";
            break;
        case "Storm":
            weatherIcon.src = "storm.png";
            break;
        case "Haze":
            weatherIcon.src = "haze.png";
            break;
    }

    document.querySelector(".weather").style.display = "block";
}

searchbutton.addEventListener("click", () => {
    const city = searchbox.value;
    checkWeather(city);
    updateLastLocation(city);
});

function updateLastLocation(city) {
    localStorage.setItem("lastLocation", city);
}

const lastLocation = localStorage.getItem("lastLocation");

if (lastLocation) {
    searchbox.value = lastLocation;
    checkWeather(lastLocation);
}

const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', function() {
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

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.style.backgroundColor = 'rgb(48, 47, 47)';
    checkbox.checked = true;
} else {
    document.body.style.backgroundColor = 'rgb(172, 163, 163)';
    checkbox.checked = false;
}

checkbox.addEventListener('change', function() {
    if (this.checked) {
        document.body.style.backgroundColor = 'rgb(48, 47, 47)';
        updateTheme('dark');
    } else {
        document.body.style.backgroundColor = 'rgb(172, 163, 163)';
        updateTheme('light');
    }
});

function updateTheme(theme) {
    localStorage.setItem('theme', theme);
}

function calculateDataSpeed() {
    const dataSize = 1024; // 1 KB in bytes
    let totalData = 0;
    let startTime = performance.now();

    setInterval(() => {
        const currentTime = performance.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds

        const dataSpeed = totalData / elapsedTime;
        updateDataSpeed(dataSpeed);

        // Reset for the next interval
        totalData = 0;
        startTime = currentTime;
    }, 1000); // Update every 1 second

    // Simulate data transfer (for demonstration purposes)
    setInterval(() => {
        const randomDataSize = Math.floor(Math.random() * 1024); // Random data size (up to 1 KB)
        totalData += randomDataSize;
    }, 100); // Add random data every 0.1 second
}

// Function to update the displayed data speed
function updateDataSpeed(speed) {
    const speedElement = document.getElementById('data-speed');
    speedElement.textContent = formatDataSize(speed) + '/s';
}

// Function to format data size for display
function formatDataSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;

    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
    }

    return size.toFixed(2) + ' ' + units[i];
}

// Start the data speed calculation
calculateDataSpeed();
