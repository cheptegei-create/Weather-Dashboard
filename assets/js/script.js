var searchBtn = document.querySelector(".btn");
var mainBody = document.querySelector(".main-body");
var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");

window.onload = function () {
  var storedData = JSON.parse(localStorage.getItem("city"));

  if (storedData) {
    for (var x = 0; x < storedData.length; x++) {
      var list = document.createElement("li");
      list.classList.add("bg-grey", "custom-click");
      var listItem = document.querySelector(".list-items");

      listItem.append(list);
      list.innerHTML = storedData[x];
    }
  } else {
    return;
  }
};

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = searchInputEl.value.trim();

  if (cityName) {
    getCoordinateInfo(cityName);

    var list = document.createElement("li");
    list.classList.add("bg-grey", "custom-click");
    var listItem = document.querySelector(".list-items");

    listItem.append(list);

    var newList = JSON.parse(localStorage.getItem("city")) || [];
    newList.push(cityName);
    localStorage.setItem("city", JSON.stringify(newList));

    for (var x = 0; x < JSON.parse(localStorage.getItem("city")).length; x++) {
      list.innerHTML = JSON.parse(localStorage.getItem("city"))[x];
    }

    document.getElementById("result-text").textContent = cityName;
  } else {
    alert("Please enter a city name");
  }

  //   window.onbeforeunload = function () {
  //     localStorage.setItem("city", JSON.stringify(newList));
  //   };
};

var buttonClickHandler = function (event) {
  // `event.target` is a reference to the DOM element of what programming language button was clicked on the page
  var savedCity = event.target.getAttribute("custom-click");

  // If there is no language read from the button, don't attempt to fetch repos
  if (savedCity) {
    getCoordinateInfo(savedCity);

    document.getElementById("result-text").textContent = savedCity;
  }
};

function getCoordinateInfo(cityName) {
  var cityName = searchInputEl.value.trim();

  //get search parameters from the url and convert it into an array
  //activity 9
  //activity 15 setting parameters for the url
  //activity 17 fetch options
  //use activity 21 for guidance
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    ",001&limit=1&appid=0bb861b3cb5a33b26c28d652df743c2c";

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data[0].lat);
      console.log(data[0].lon);
      var longitude = data[0].lon;
      var lattitude = data[0].lat;
      getWeatherInfo(lattitude, longitude);
    });
}

function getWeatherInfo(x, y) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    x +
    "&lon=" +
    y +
    "&appid=0bb861b3cb5a33b26c28d652df743c2c";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data.list);

      document.getElementById('result-content').setAttribute('class', 'col-11 m-3 d-flex border border-primary');

      document.getElementById('current-date').textContent = data.list[0].dt_txt;
      document.getElementById('current-pic').textContent = data.list[0].main.icon;
      document.getElementById('temperature').textContent = data.list[0].main.temp;
      document.getElementById('humidity').textContent = data.list[0].main.humidity;
      document.getElementById('wind-speed').textContent = data.list[0].main.wind_speed;
      
    });
}
window.onload();
searchFormEl.addEventListener("submit", formSubmitHandler);

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
