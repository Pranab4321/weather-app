document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value.trim();

  // Check if city input is empty
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  console.log("City entered:", city);

  // Adding a button to show my location


  // Simulate weather data instead of API call
  async function simulateWeather() {
    try {
      // Simulate current weather data
      const simulatedCurrentData = {
        name: city,
        main: {
          temp: Math.random() * (303.15 - 283.15) + 283.15, // Random temp between 10°C and 30°C in Kelvin
        },
        weather: [{
          description: ["sunny", "partly cloudy", "scattered clouds", "light rain"][Math.floor(Math.random() * 4)],
          icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)]
        }]
      };

      // Simulate forecast data
      const simulatedForecastData = {
        list: Array(24).fill(null).map((_, index) => ({
          dt: Math.floor(Date.now() / 1000) + (index * 86400), // Add days in seconds
          main: {
            temp: Math.random() * (303.15 - 283.15) + 283.15,
          },
          weather: [{
            description: ["sunny", "partly cloudy", "scattered clouds", "light rain"][Math.floor(Math.random() * 4)],
            icon: ["01d", "02d", "03d", "10d"][Math.floor(Math.random() * 4)]
          }]
        }))
      };

      // Use the same processing logic as the original code
      function formatDate(dt) {
        const date = new Date(dt * 1000);
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          
          day: "numeric",
        });
      }

      function convertTemp(kelvin, unit) {
        if (unit === "metric") {
          return Math.round(kelvin - 273.15);
        } else {
          return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
        }
      }

      function getWeatherIcon(weatherCode) {
        const iconMap = {
          "01": "sunny.png",
          "02": "partly-cloudy.png",
          "03": "cloudy.png",
          "04": "cloudy.png",
          "09": "rainy.png",
          "10": "rainy.png",
          "11": "stormy.png",
          "13": "snowy.png",
          "50": "misty.png",
        };
        const code = weatherCode.substring(0, 2);
        return iconMap[code] || "sunny.png";
      }

      // Update current weather
      document.getElementById("city-name").innerText = "City: " + simulatedCurrentData.name;
      const currentTemp = convertTemp(
        simulatedCurrentData.main.temp,
        document.getElementById("unit").value
      );
      document.getElementById("temperature").innerText =
        "Temperature: " +
        currentTemp +
        "°" +
        (document.getElementById("unit").value === "metric" ? "C" : "F");
      document.getElementById("weather-description").innerText =
        "Weather Description: " + simulatedCurrentData.weather[0].description;

      // Update 3-day forecast
      const forecastIndices = [0, 1, 2]; // Next three days
      const dayCards = document.querySelectorAll(".day-card");

      forecastIndices.forEach((index, i) => {
        const forecast = simulatedForecastData.list[index];
        const dayCard = dayCards[i];

        dayCard.querySelector(".day-date").innerText = formatDate(forecast.dt);

        const iconCode = forecast.weather[0].icon;
        const iconPath = `image/${getWeatherIcon(iconCode)}`;
        const imgElement = dayCard.querySelector(".day-weather-icon img");
        imgElement.src = iconPath;
        imgElement.style.display = "block";
        imgElement.onerror = function () {
          this.style.display = "none";
        };

        const temp = convertTemp(
          forecast.main.temp,
          document.getElementById("unit").value
        );
        dayCard.querySelector(".day-temperature").innerText = `${temp}°${
          document.getElementById("unit").value === "metric" ? "C" : "F"
        }`;

        dayCard.querySelector(".day-description").innerText =
          forecast.weather[0].description;
      });

    } catch (error) {
      console.log(error);
      alert("Error in simulation. Please try again.");
      document.querySelectorAll(".day-weather-icon img").forEach((img) => {
        img.style.display = "none";
      });
    }
  }

  simulateWeather();
});