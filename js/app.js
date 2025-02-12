document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value;
  console.log("City entered:", city);

  const apiKey = "443ab80610e13ff973f3a07e97125163";
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}`;

  async function fetchWeather() {
    const response = await fetch(apiURL + `&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
  }

  fetchWeather();
})