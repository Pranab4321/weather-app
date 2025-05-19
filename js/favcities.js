
 const favoriteList = document.getElementById("favorite-cities");
  const saveBtn = document.getElementById("save-favorite-btn");

  // Load favorite cities from localStorage
  function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoriteList.innerHTML = "";

    favorites.forEach(city => {
      const span = document.createElement("span");
      span.innerText = city;
      span.addEventListener("click", () => fetchWeatherByCity(city));
      favoriteList.appendChild(span);
    });
  }

  // Save current input city to favorites
  saveBtn.addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    if (!city) {
      alert("Enter a city name to save");
      return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(city)) {
      favorites.push(city);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      loadFavorites();
    } else {
      alert("City already in favorites");
    }
  });

  // Load favorites on page load
  window.onload = loadFavorites;

// *****************

   function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoriteList.innerHTML = "";

  favorites.forEach(city => {
    const li = document.createElement("span");
    li.innerHTML = `
      <span class="city-name">${city}</span>
      <span class="delete-btn" data-city="${city}">❌</span>
    `;
    li.querySelector(".city-name").addEventListener("click", () => fetchWeatherByCity(city));
    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering fetchWeatherByCity
      deleteFavorite(city);
    });
    favoriteList.appendChild(li);
  });
}

function deleteFavorite(city) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(c => c !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}
