// Dynamic Background
        const dynamicBg = document.getElementById('dynamic-bg');
        function updateBackground(weatherMain) {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            if (theme === 'light') {
                switch (weatherMain) {
                    case "Clouds":
                        dynamicBg.style.backgroundImage = "url('https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg')";
                        break;
                    case "Clear":
                        dynamicBg.style.backgroundImage = "url('https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg')";
                        break;
                    case "Rain":
                        dynamicBg.style.backgroundImage = "url('https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg')";
                        break;
                    case "Drizzle":
                        dynamicBg.style.backgroundImage = "url('https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg')";
                        break;
                    case "Snow":
                        dynamicBg.style.backgroundImage = "url('https://images.pexels.com/photos/531836/pexels-photo-531836.jpeg')";
                        break;
                    default:
                        dynamicBg.style.backgroundImage = "url('https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg')";
                }
            } else {
                dynamicBg.style.backgroundImage = "none";
            }
        }

        // Signal Status Update
        function updateSignalIcon() {
            const signalStatus = document.getElementById('signal-status');
            const isConnected = navigator.onLine;
            const connectionType = navigator.connection ? navigator.connection.type : null;

            if (isConnected) {
                if (connectionType === 'wifi') {
                    signalStatus.innerHTML = '<img src="images/wifi-icon.png" alt="WiFi" class="signal-icon">';
                } else {
                    signalStatus.innerHTML = '<img src="images/mobile-data-icon.png" alt="Mobile Data" class="signal-icon">';
                }
            } else {
                signalStatus.innerHTML = '<img src="images/disconnected-icon.png" alt="Disconnected" class="signal-icon">';
            }
        }

        updateSignalIcon();
        window.addEventListener('online', updateSignalIcon);
        window.addEventListener('offline', updateSignalIcon);

        // Loader
        setTimeout(function () {
            document.querySelector(".loader-wrapper").style.display = "none";
        }, 2000);

        // Offline Detection
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

        function showNotification(message) {
            if ('Notification' in window) {
                Notification.requestPermission().then(function (permission) {
                    if (permission === 'granted') {
                        new Notification(message);
                    }
                });
            }
        }

        checkConnection();
        window.addEventListener('online', checkConnection);
        window.addEventListener('offline', checkConnection);

        // Weather API Integration, Food Recommendation, and Weather Alerts
        const apikey = "ba707aac3c6c866490c9f22ada735ba3";
        const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
        const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const weather = document.getElementById('weather');
        const weatherAlert = document.getElementById('weatherAlert');
        const alertDescription = document.getElementById('alertDescription');
        const weatherIcon = document.getElementById('weatherIcon');
        const temp = document.getElementById('temp');
        const city = document.getElementById('city');
        const description = document.getElementById('description');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        const forecastContainer = document.getElementById('forecast');
        const detailsContainer = document.getElementById('details');
        const foodRecommendation = document.getElementById('foodRecommendation');
        const foodItems = document.getElementById('foodItems');

        // Food suggestion pools
        const foodPools = {
            cold: [
                "Hot Chocolate", "Chicken Soup", "Grilled Cheese", "Spiced Chai", "Beef Stew", 
                "Hot Toddy", "Pumpkin Soup", "Warm Apple Pie", "Mashed Potatoes", "Cocoa"
            ],
            mildRain: [
                "Warm Tea", "Pasta", "Hot Pie", "Ramen", "Tomato Soup", 
                "Bread Pudding", "Hot Coffee", "Mac and Cheese", "Risotto", "Scones"
            ],
            mildClear: [
                "Sandwich", "Fruit Salad", "Lemonade", "Wraps", "Iced Tea", 
                "Pasta Salad", "Smoothie Bowl", "Cold Brew", "Caprese Salad", "Tacos"
            ],
            warm: [
                "Ice Cream", "Cold Coffee", "Fresh Juice", "Sorbet", "Milkshake", 
                "Iced Latte", "Frozen Yogurt", "Chilled Fruit", "Popsicle", "Cold Pasta"
            ],
            hot: [
                "Gelato", "Iced Tea", "Smoothie", "Slushie", "Chilled Watermelon", 
                "Mojito", "Frozen Lemonade", "Ice Cream Float", "Cold Brew", "Soda"
            ]
        };

        function getFoodRecommendation(temp, weatherMain, timezoneOffset) {
            const localTime = new Date(Date.now() + timezoneOffset * 1000);
            const hour = localTime.getUTCHours();
            let mealType = hour < 12 ? "Breakfast" : hour < 17 ? "Lunch" : "Dinner";
            let pool;

            if (temp < 10) {
                pool = foodPools.cold;
            } else if (temp >= 10 && temp < 20) {
                pool = weatherMain === 'Rain' || weatherMain === 'Drizzle' ? foodPools.mildRain : foodPools.mildClear;
            } else if (temp >= 20 && temp < 30) {
                pool = foodPools.warm;
            } else {
                pool = foodPools.hot;
            }

            const shuffled = pool.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);

            return { mealType, items: selected };
        }

        async function checkWeather(cityName) {
            try {
                const response = await fetch(`${apiurl}${cityName}&appid=${apikey}`);
                if (!response.ok) throw new Error('City not found');
                const data = await response.json();

                const forecastResponse = await fetch(`${forecastUrl}${cityName}&appid=${apikey}`);
                const forecastData = await forecastResponse.json();

                temp.innerHTML = Math.round(data.main.temp) + "°C";
                city.innerHTML = data.name;
                description.innerHTML = data.weather[0].description;
                weatherIcon.src = `images/${data.weather[0].main.toLowerCase()}.png` || "https://cdn-icons-png.flaticon.com/128/4274/4274438.png";

                const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
                sunrise.innerHTML = sunriseTime;
                sunset.innerHTML = sunsetTime;

                // Weather Alerts
                if (data.alerts && data.alerts.length > 0) {
                    const alert = data.alerts[0];
                    alertDescription.innerHTML = `${alert.description} (${alert.event})`;
                    weatherAlert.style.display = 'block';
                } else {
                    weatherAlert.style.display = 'none';
                }

                detailsContainer.innerHTML = `
                    <div class="col">
                        <img src="images/heating.png" alt="Max Temperature Icon">
                        <div>
                            <p>Max Temp</p>
                            <p class="temp_max">${data.main.temp_max}°C</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/low-temperature.png" alt="Min Temperature Icon">
                        <div>
                            <p>Min Temp</p>
                            <p class="temp_min">${data.main.temp_min}°C</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/hot.png" alt="Feels Like Icon">
                        <div>
                            <p>Feels Like</p>
                            <p class="feels_like">${data.main.feels_like}°C</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/humidity.png" alt="Humidity Icon">
                        <div>
                            <p>Humidity</p>
                            <p class="humidity">${data.main.humidity}%</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/wind.png" alt="Wind Speed Icon">
                        <div>
                            <p>Wind Speed</p>
                            <p class="wind">${data.wind.speed} KMPH</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/gust.png" alt="Gust Icon">
                        <div>
                            <p>Gust</p>
                            <p class="gust">${data.wind.gust || "--"}</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/air.png" alt="Pressure Icon">
                        <div>
                            <p>Pressure</p>
                            <p class="pressure">${data.main.pressure} hPa</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/level.png" alt="Ground Level Icon">
                        <div>
                            <p>Ground Level</p>
                            <p class="ground_level">${data.main.grnd_level || "--"}</p>
                        </div>
                    </div>
                    <div class="col">
                        <img src="images/tide.png" alt="Sea Level Icon">
                        <div>
                            <p>Sea Level</p>
                            <p class="sea_level">${data.main.sea_level || "--"}</p>
                        </div>
                    </div>
                `;

                forecastContainer.innerHTML = '';
                const hourlyForecast = forecastData.list.slice(0, 6);
                hourlyForecast.forEach(item => {
                    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const forecastItem = document.createElement('div');
                    forecastItem.className = 'forecast-item';
                    forecastItem.innerHTML = `
                        <p>${time}</p>
                        <p class="temp">${Math.round(item.main.temp)}°C</p>
                        <img src="images/${item.weather[0].main.toLowerCase()}.png" alt="Forecast Icon" width="30">
                    `;
                    forecastContainer.appendChild(forecastItem);
                });

                // Food Recommendation
                const { mealType, items } = getFoodRecommendation(data.main.temp, data.weather[0].main, data.timezone);
                foodRecommendation.querySelector('p').innerHTML = `Perfect for ${mealType} in ${data.name} right now:`;
                foodItems.innerHTML = items.map(item => `<span class="food-item">${item}</span>`).join('');
                foodRecommendation.style.display = 'block';

                weather.style.display = 'block';
                updateBackground(data.weather[0].main);
            } catch (error) {
                console.error(error);
                weather.style.display = 'none';
                alert('City not found. Please try again.');
            }
        }

        searchButton.addEventListener("click", () => {
            const city = searchInput.value.trim();
            if (city) {
                checkWeather(city);
                updateLastLocation(city);
            }
        });

        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const city = searchInput.value.trim();
                if (city) {
                    checkWeather(city);
                    updateLastLocation(city);
                }
            }
        });

        function updateLastLocation(city) {
            localStorage.setItem("lastLocation", city);
        }

        const lastLocation = localStorage.getItem("lastLocation");
        if (lastLocation) {
            searchInput.value = lastLocation;
            checkWeather(lastLocation);
        }

        // Theme Toggle
        const checkbox = document.getElementById('checkbox');
        const savedTheme = localStorage.getItem('theme') || 'light';

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (theme === 'dark') {
                checkbox.checked = true;
                dynamicBg.style.backgroundImage = "none";
            } else {
                checkbox.checked = false;
                updateBackground('default');
            }
        }

        applyTheme(savedTheme);

        checkbox.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        // Navbar Toggle
        const menuBars = document.querySelector('.menu-bars');
        const dropMenu = document.getElementById('dropMenu');
        const closeMenu = document.getElementById('closeMenu');

        menuBars.addEventListener('click', function() {
            dropMenu.classList.toggle('active');
        });

        closeMenu.addEventListener('click', function() {
            dropMenu.classList.remove('active');
        });

        document.addEventListener('click', function(event) {
            const isClickInsideMenu = dropMenu.contains(event.target);
            const isClickOnMenuBars = menuBars.contains(event.target);
            if (!isClickInsideMenu && !isClickOnMenuBars) {
                dropMenu.classList.remove('active');
            }
        });

        // Contact Form Submission
        function sendMail(event) {
            event.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const feedback = document.getElementById('formFeedback');

            if (fullname && email && message) {
                feedback.innerHTML = `<p style="color: var(--accent-primary);">Message sent successfully! (Placeholder)</p>`;
                feedback.style.display = 'block';
                setTimeout(() => feedback.style.display = 'none', 3000);
                document.getElementById('contactForm').reset();
            } else {
                feedback.innerHTML = `<p style="color: var(--accent-primary);">Please fill all fields.</p>`;
                feedback.style.display = 'block';
            }
        }
