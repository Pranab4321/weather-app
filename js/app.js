document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value;
  console.log("City entered:", city);

  const apiKey = "443ab80610e13ff973f3a07e97125163";
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}`;
  
  //async function to fetch weather data
  async function fetchWeather() {
    const response = await fetch(apiURL + `&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);

    document.getElementById('city-name').innerText= "City: "+data.name;

    //function to convert temperature
    function convertTemp(){
              
        const kelvin = Math.round(data.main.temp);
        let selected = document.getElementById("unit").value
        if (selected =="metric"){
            let C =  Math.round((kelvin - 273.15))
            console.log("In celcius : ",C)
            // here i have to display the temp in the dom
            document.getElementById("temperature").innerText="Temperature: "+ C + "°C"

        }else if(selected =="imperial"){

            let F =  Math.round((kelvin - 273.15)*9/5+32)
            console.log("In Fahrenheit : ",F)
            //here i have to display the temp to the dom
            document.getElementById("temperature").innerText="Temperature: " + F + "°F"

        }
      }
    convertTemp()

    // function to show the description 
    document.getElementById("weather-description").innerText = "Weather Description: "+data.weather[0].description
  }

  fetchWeather();
})