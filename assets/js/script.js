//Declaring essential variables in the global scope
var searchFormEl = document.getElementById("search-form");
var searchInputEl = document.getElementById("search-input");
var clearEl = document.querySelector(".clear-history");
var newList = JSON.parse(localStorage.getItem("city")) || [];
function init() {
  //This function adds functionality to the search city form
  var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = searchInputEl.value;

    if (cityName) {
      getCoordinateInfo(cityName);
      getOneDay(cityName);

      var listItem = document.querySelector(".list-items");
      var innerCity = document.createElement("input");
      innerCity.classList.add("bg-grey", "form-control");
      innerCity.setAttribute("type", "text");
      innerCity.setAttribute("readonly", "true");

      for (var x = 0; x < newList.length; x++) {
        innerCity.setAttribute("value", newList[x]);
        listItem.append(innerCity);
        innerCity.addEventListener("click", function (event) {
          var city = event.target.value;
          getWeatherHistory(city);
        });
      }
    } else {
      alert("Please enter a city name");
    }
  };

  //This function gets the current weather conditions and the 5-day forecast for the history list
  function getWeatherHistory(cityName) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=0bb861b3cb5a33b26c28d652df743c2c";

    fetch(queryURL, {
      credentials: "same-origin",
    })
      .then(function (response) {
        if (response.status !== 200) {
          var message = document.getElementById("message-body");
          var messageCan = document.getElementById("message-can");
          messageCan.classList.remove("d-none");
          message.textContent = "City entered does not exist!";
        }
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
              data.weather[0].icon +
              "@2x.png"
          );
        document
          .getElementById("current-pic")
          .setAttribute("alt", data.weather[0].description);

        var currentDate = dayjs(data.dt * 1000).format("MMMM D, YYYY");

        document.getElementById("current-date").textContent = currentDate;
        document.getElementById("current-pic").textContent =
          data.weather[0].icon;
        document.getElementById("temperature").textContent =
          "Temp: " +
          Math.round(((data.main.temp - 273.15) * 9) / 5 + 32) +
          " F";
        document.getElementById("humidity").textContent =
          "Humidity: " + data.main.humidity + " %";
        document.getElementById("wind-speed").textContent =
          "Wind: " + Math.round(data.wind.speed * 2.237) + " MPH";
        document.getElementById("result-text").textContent = data.name;
        newList.push(data.name);
        localStorage.setItem("city", JSON.stringify(newList));
      });

    //five day weather forecast

    let forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=0bb861b3cb5a33b26c28d652df743c2c";
    fetch(forecastQueryURL, {
      credentials: "same-origin",
    })
      .then(function (response) {
        if (response.status !== 200) {
          var message = document.getElementById("message-body");
          var messageCan = document.getElementById("message-can");
          messageCan.classList.remove("d-none");
          message.textContent = "City entered does not exist!";
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        console.log(data.list);

        document.getElementById("five-day").classList.remove("d-none");

        fiveDayForecast = document.querySelectorAll(".forecast");
        for (var x = 0; x < fiveDayForecast.length; x++) {
          fiveDayForecast[x].innerHTML = "";
          var foreCastIndex = x * 8;
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
          var forecastTemp = document.createElement("p");
          forecastTemp.innerHTML =
            "Temp: " +
            Math.round(
              ((data.list[foreCastIndex].main.temp - 273.15) * 9) / 5 + 32
            ) +
            " F";
          fiveDayForecast[x].append(forecastTemp);

          //five day humidity
          var forecastHumid = document.createElement("p");
          forecastHumid.innerHTML =
            "Humid: " + data.list[foreCastIndex].main.humidity + " %";
          fiveDayForecast[x].append(forecastHumid);

          //five day wind-speed
          var forecastWind = document.createElement("p");
          forecastWind.innerHTML =
            "Wind: " +
            Math.round(data.list[foreCastIndex].wind.speed * 2.237) +
            " MPH";
          fiveDayForecast[x].append(forecastWind);
        }
      });
  }

  //This function fetches the coordinate information of a specific city
  function getCoordinateInfo(cityName) {
    var cityName = searchInputEl.value.trim();

    var apiUrl =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      ",001&limit=1&appid=0bb861b3cb5a33b26c28d652df743c2c";

    fetch(apiUrl, {
      credentials: "same-origin",
    })
      .then(function (response) {
        if (response.status !== 200) {
          var message = document.getElementById("message-body");
          var messageCan = document.getElementById("message-can");
          messageCan.classList.remove("d-none");
          message.textContent = "City entered does not exist!";
        }
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
//This function gets the current weather conditions
  function getOneDay(cityName) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=0bb861b3cb5a33b26c28d652df743c2c";

    fetch(queryURL, {
      credentials: "same-origin",
    })
      .then(function (response) {
        if (response.status !== 200) {
          var message = document.getElementById("message-body");
          var messageCan = document.getElementById("message-can");
          messageCan.classList.remove("d-none");
          message.textContent = "City entered does not exist!";
        }
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
              data.weather[0].icon +
              "@2x.png"
          );
        document
          .getElementById("current-pic")
          .setAttribute("alt", data.weather[0].description);

        var currentDate = dayjs(data.dt * 1000).format("MMMM D, YYYY");

        document.getElementById("current-date").textContent = currentDate;
        document.getElementById("current-pic").textContent =
          data.weather[0].icon;
        document.getElementById("temperature").textContent =
          "Temp: " +
          Math.round(((data.main.temp - 273.15) * 9) / 5 + 32) +
          " F";
        document.getElementById("humidity").textContent =
          "Humidity: " + data.main.humidity + " %";
        document.getElementById("wind-speed").textContent =
          "Wind: " + Math.round(data.wind.speed * 2.237) + " MPH";

        document.getElementById("result-text").textContent = data.name;
        newList.push(data.name);
        localStorage.setItem("city", JSON.stringify(newList));
      });
  }
//This function gets the five-day forecast for the searched city
  function getWeatherInfo(x, y) {
    var requestUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      x +
      "&lon=" +
      y +
      "&appid=0bb861b3cb5a33b26c28d652df743c2c";
    // Fetching weather information from the openweathermap api
    fetch(requestUrl, {
      credentials: "same-origin",
    })
      .then(function (response) {
        if (response.status !== 200) {
          var message = document.getElementById("message-body");
          var messageCan = document.getElementById("message-can");
          messageCan.classList.remove("d-none");
          message.textContent = "City entered does not exist!";
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        console.log(data.list);

        //five day weather forecast

        document.getElementById("five-day").classList.remove("d-none");

        fiveDayForecast = document.querySelectorAll(".forecast");
        for (var x = 0; x < fiveDayForecast.length; x++) {
          fiveDayForecast[x].innerHTML = "";
          var foreCastIndex = x * 8;
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
          var forecastTemp = document.createElement("p");
          forecastTemp.innerHTML =
            "Temp: " +
            Math.round(
              ((data.list[foreCastIndex].main.temp - 273.15) * 9) / 5 + 32
            ) +
            " F";
          fiveDayForecast[x].append(forecastTemp);

          //five day humidity
          var forecastHumid = document.createElement("p");
          forecastHumid.innerHTML =
            "Humid: " + data.list[foreCastIndex].main.humidity + " %";
          fiveDayForecast[x].append(forecastHumid);

          //five day wind-speed
          var forecastWind = document.createElement("p");
          forecastWind.innerHTML =
            "Wind: " +
            Math.round(data.list[foreCastIndex].wind.speed * 2.237) +
            " MPH";
          fiveDayForecast[x].append(forecastWind);
        }
      });
  }

  searchFormEl.addEventListener("submit", formSubmitHandler);

  //clear history button

  clearEl.addEventListener("click", function () {
    localStorage.clear();
    newList = [];
    location.reload();
  });
//This function enables printing of city history list upon refreshing the page
  window.onload = function () {
    var listItem = document.querySelector(".list-items");
    listItem.children.value = '';

    for (var x = 0; x < newList.length; x++) {
      var innerCity = document.createElement("input");
      innerCity.classList.add("bg-grey", "form-control");
      innerCity.setAttribute("type", "text");
      innerCity.setAttribute("readonly", "true");

      innerCity.setAttribute("value", newList[x]);
      innerCity.addEventListener("click", function (event) {
        var city = event.target.value;
        getWeatherHistory(city);
      });
      listItem.append(innerCity);
    }
  };
}

init();

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
