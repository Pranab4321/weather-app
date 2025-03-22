document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value.trim();

  // Check if city input is empty
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  console.log("City entered:", city);

  const apiKey = "443ab80610e13ff973f3a07e97125163";
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}`;

  //async function to fetch weather data
  async function fetchWeather() {
    try {
      const response = await fetch(apiURL + `&appid=${apiKey}`);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      console.log(data);
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      const apiurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      try {
        const newresponse = await fetch(apiurl);
        const fetchData = await newresponse.json();
        console.log(fetchData);

        // Function to format date
        function formatDate(dt) {
          const date = new Date(dt * 1000);
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });
        }

        // Function to convert temperature
        function convertTemp(kelvin, unit) {
          if (unit === "metric") {
            return Math.round(kelvin - 273.15);
          } else {
            return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
          }
        }

        // Function to get weather icon
        function getWeatherIcon(weatherCode) {
          const iconMap = {
            "01": "sunny.png", // Clear sky
            "02": "partly-cloudy.png", // Few clouds
            "03": "cloudy.png", // Scattered clouds
            "04": "cloudy.png", // Broken clouds
            "09": "rainy.png", // Shower rain
            10: "rainy.png", // Rain
            11: "stormy.png", // Thunderstorm
            13: "snowy.png", // Snow
            50: "misty.png", // Mist
          };
          const code = weatherCode.substring(0, 2);
          return iconMap[code] || "sunny.png";
        }

        // Update current weather
        document.getElementById("city-name").innerText = "City: " + data.name;
        const currentTemp = convertTemp(
          data.main.temp,
          document.getElementById("unit").value
        );
        document.getElementById("temperature").innerText =
          "Temperature: " +
          currentTemp +
          "°" +
          (document.getElementById("unit").value === "metric" ? "C" : "F");
        document.getElementById("weather-description").innerText =
          "Weather Description: " + data.weather[0].description;

        // Update 3-day forecast
        const forecastIndices = [8, 16, 24]; // Indices for tomorrow, day after tomorrow, and third day
        const dayCards = document.querySelectorAll(".day-card");

        forecastIndices.forEach((index, i) => {
          const forecast = fetchData.list[index];
          const dayCard = dayCards[i];

          // Update date
          dayCard.querySelector(".day-date").innerText = formatDate(
            forecast.dt
          );

          // Update weather icon based on weather condition
          const iconCode = forecast.weather[0].icon;
          const iconPath = `image/${getWeatherIcon(iconCode)}`;
          const imgElement = dayCard.querySelector(".day-weather-icon img");
          imgElement.src = iconPath;
          imgElement.style.display = "block"; // Show the image
          imgElement.onerror = function () {
            this.style.display = "none"; // Hide the image if it fails to load
          };

          // Update temperature
          const temp = convertTemp(
            forecast.main.temp,
            document.getElementById("unit").value
          );
          dayCard.querySelector(".day-temperature").innerText = `${temp}°${
            document.getElementById("unit").value === "metric" ? "C" : "F"
          }`;

          // Update description
          dayCard.querySelector(".day-description").innerText =
            forecast.weather[0].description;
        });
      } catch (error) {
        console.log(error);
        alert("Error fetching forecast data. Please try again.");
        // Hide all weather icons on error
        document.querySelectorAll(".day-weather-icon img").forEach((img) => {
          img.style.display = "none";
        });
      }
    } catch (error) {
      console.log(error);
      alert("City not found. Please check the city name and try again.");
      // Hide all weather icons on error
      document.querySelectorAll(".day-weather-icon img").forEach((img) => {
        img.style.display = "none";
      });
    }
  }

  fetchWeather();
});
