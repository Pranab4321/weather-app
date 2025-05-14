 
    const x = document.getElementById("weather-info");
    const y = document.getElementById("coords");
    const apiKey = "443ab80610e13ff973f3a07e97125163";

    // Get location button
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }

    function success(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      y.innerHTML = "Longitude : "+ lon + "<br>Latitude : "+lat;
      fetchWeatherByCoords(lat, lon);
    }

    function error() {
      alert("Sorry, no position available.");
    }

    // Fetch weather by city name
    document.getElementById("search-btn").addEventListener("click", function () {
      y.innerHTML = ""
      const city = document.getElementById("city-input").value.trim();
      if (!city) {
        alert("Please enter a city name");
        return;
      }
      fetchWeatherByCity(city);
    });

    async function fetchWeatherByCity(city) {
      const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        updateCurrentWeather(data);
        fetchForecast(lat, lon);
      } catch (err) {
        alert("City not found. Please check the city name and try again.");
        hideIcons();
      }
    }

    async function fetchWeatherByCoords(lat, lon) {
      const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      try {
        const response = await fetch(apiURL);
        const data = await response.json();
        updateCurrentWeather(data);
        fetchForecast(lat, lon);
      } catch (err) {
        alert("Error fetching weather from coordinates.");
        hideIcons();
      }
    }

    async function fetchForecast(lat, lon) {
      const apiurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      try {
        const newresponse = await fetch(apiurl);
        const fetchData = await newresponse.json();
        updateForecast(fetchData);
      } catch (err) {
        alert("Error fetching forecast data.");
        hideIcons();
      }
    }

    function updateCurrentWeather(data) {
      const unit = document.getElementById("unit").value;
      const currentTemp = convertTemp(data.main.temp, unit);
      document.getElementById("city-name").innerText = "City: " + data.name;
      document.getElementById("temperature").innerText = `Temperature: ${currentTemp}°${unit === "metric" ? "C" : "F"}`;
      document.getElementById("weather-description").innerText = "Weather Description: " + data.weather[0].description;
    }

    function updateForecast(fetchData) {
      const forecastIndices = [8, 16, 24];
      const dayCards = document.querySelectorAll(".day-card");

      forecastIndices.forEach((index, i) => {
        const forecast = fetchData.list[index];
        const dayCard = dayCards[i];
        dayCard.querySelector(".day-date").innerText = formatDate(forecast.dt);
        const iconCode = forecast.weather[0].icon;
        const iconPath = `image/${getWeatherIcon(iconCode)}`;
        const imgElement = dayCard.querySelector(".day-weather-icon img");
        imgElement.src = iconPath;
        imgElement.style.display = "block";
        imgElement.onerror = () => imgElement.style.display = "none";
        const temp = convertTemp(forecast.main.temp, document.getElementById("unit").value);
        dayCard.querySelector(".day-temperature").innerText = `${temp}°${document.getElementById("unit").value === "metric" ? "C" : "F"}`;
        dayCard.querySelector(".day-description").innerText = forecast.weather[0].description;
      });
    }

    function formatDate(dt) {
      const date = new Date(dt * 1000);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }

    function convertTemp(kelvin, unit) {
      return unit === "metric"
        ? Math.round(kelvin - 273.15)
        : Math.round((kelvin - 273.15) * 9 / 5 + 32);
    }

    function getWeatherIcon(weatherCode) {
      const iconMap = {
        "01": "sunny.png",
        "02": "partly-cloudy.png",
        "03": "cloudy.png",
        "04": "cloudy.png",
        "09": "rainy.png",
        10: "rainy.png",
        11: "stormy.png",
        13: "snowy.png",
        50: "misty.png",
      };
      const code = weatherCode.substring(0, 2);
      return iconMap[code] || "sunny.png";
    }

    function hideIcons() {
      document.querySelectorAll(".day-weather-icon img").forEach((img) => {
        img.style.display = "none";
      });
    }
