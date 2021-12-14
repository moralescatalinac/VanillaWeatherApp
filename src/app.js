function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row">`;
  let days = ["Sun", "Mon", "Tues"];

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-day">${formatDay(
                  forecastDay.dt
                )}</div>
                 <img src="http://openweathermap.org/img/wn/${
                   forecastDay.weather[0].icon
                 }@2x.png" width="60px">
                 <div class="weather-forecast-temp"><span class="maxTemp"> ${Math.round(
                   forecastDay.temp.max
                 )}°</span> <span class="minTemp"> ${Math.round(
          forecastDay.temp.min
        )}°</span></div>
              </div>
              `;
    }
  });
  forecastHTML = forecastHTML + "</div>";
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "3a24228f47a1c5328cc8990852342e05";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#cityTemp");
  let cityElement = document.querySelector("#showCitySearched");
  let descriptionElement = document.querySelector("#weatherDescription");
  let humidityElement = document.querySelector("#humidityText");
  let windElement = document.querySelector("#windText");
  let dateElement = document.querySelector("#dateText");
  let weatherIcon = document.querySelector("#weatherIconID");

  celsiusTemp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "3a24228f47a1c5328cc8990852342e05";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#searchCityInput");
  search(cityInputElement.value);
}
function showFarenheightTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  farenheightLink.classList.add("active");
  let farenheightTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#cityTemp");
  temperatureElement.innerHTML = Math.round(farenheightTemp);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  farenheightLink.classList.remove("active");
  let temperatureElement = document.querySelector("#cityTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let form = document.querySelector("#myForm");
form.addEventListener("submit", handleSubmit);

let farenheightLink = document.querySelector("#farenheight-Link");
farenheightLink.addEventListener("click", showFarenheightTemp);

let celsiusLink = document.querySelector("#celsius-Link");
celsiusLink.addEventListener("click", showCelsiusTemp);

search("New York");
displayForecast();
