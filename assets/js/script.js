var searchBtn = document.querySelector(".btn");
var mainBody = document.querySelector(".main-body");
var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");
var clearEl = document.querySelector("clear-history");

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
//This function fetches the coordinate information of a specific city
function getCoordinateInfo(cityName) {
  var cityName = searchInputEl.value.trim();

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
// Fetching weather information from the openweathermap api
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data.list);
// Current day weather information to be displayed on the location screen
      document
        .getElementById("result-content")
        .setAttribute("class", "col-11 m-3 d-flex border border-primary");
      document
        .getElementById("current-pic")
        .setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
            data.list[0].weather[0].icon +
            "@2x.png"
        );
      document
        .getElementById("current-pic")
        .setAttribute("alt", data.list[0].weather[0].description);

      var currentDate = dayjs(data.list[0].dt * 1000).format("MMMM D, YYYY");

      document.getElementById("current-date").textContent = currentDate;
      document.getElementById("current-pic").textContent =
        data.list[0].weather[0].icon;
      document.getElementById("temperature").textContent = 'Temp: ' +
        Math.round(((data.list[0].main.temp - 273.15) * 9) / 5 + 32) + " F";
      document.getElementById("humidity").textContent = 'Humidity: ' +
        data.list[0].main.humidity + " %";
      document.getElementById("wind-speed").textContent = 'Wind-Speed: ' +
        Math.round(data.list[0].wind.speed * 2.237) + " MPH";

        //five day weather forecast

      document.getElementById("five-day").classList.remove("d-none");

      fiveDayForecast = document.querySelectorAll(".forecast");
      for (var x = 0; x < fiveDayForecast.length; x++) {
        fiveDayForecast[x].innerHTML = "";
        var foreCastIndex = x * 8 + 4;
        var selectedDate = dayjs(data.list[foreCastIndex].dt * 1000).format(
          "MMMM D, YYYY"
        );
        var forecastDate = document.createElement("p");
        forecastDate.classList.add("mt-3", "forecast-date");
        forecastDate.innerHTML = selectedDate;
        fiveDayForecast[x].append(forecastDate);

        //five day weather image

        var forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
            data.list[foreCastIndex].weather[0].icon +
            "@2x.png"
        );
        forecastWeatherEl.setAttribute(
          "alt",
          data.list[foreCastIndex].weather[0].description
        );
        fiveDayForecast[x].append(forecastWeatherEl);

        //five day weather temp
        var forecastTemp = document.createElement('p');
        forecastTemp.innerHTML = 'Temp: ' + Math.round(((data.list[foreCastIndex].main.temp - 273.15) * 9) / 5 + 32) + " F";
        fiveDayForecast[x].append(forecastTemp);

        //five day humidity
        var forecastHumid = document.createElement('p');
        forecastHumid.innerHTML = 'Humidity: ' + data.list[foreCastIndex].main.humidity + " %";
        fiveDayForecast[x].append(forecastHumid);

        //five day wind-speed
        var forecastWind = document.createElement('p');
        forecastHumid.innerHTML = 'Wind-Speed: ' +  Math.round(data.list[0].wind.speed * 2.237) + " MPH";
        fiveDayForecast[x].append(forecastWind);
      }
    });
}

//clear history button
clearEl.addEventListener('click', function() {})
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
