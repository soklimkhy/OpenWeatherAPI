api_key = "9650512e6591e17c0a6f8302555b9dbb";
// API KEY FROM OPENWEATHERMAP.ORG

let cityInput = document.getElementById("city-input");
let searchBtn = document.getElementById("search-btn");

//////////////////////////////////////
// Navbar Animation Swtiching between Today and 5-Day Forecast
const fiveDayForecastContainerNav = document.getElementById("five-day-forecast-container-nav");
const todayContainerNav = document.getElementById("today-container-nav");
const currentWeatherContainer = document.getElementById("current-weather-container");
const nearbyPlacesContainer = document.getElementById("nearby-places-container");
const fiveDayBroadcastContainer = document.getElementById("five-day-broadcast-container");
/////////////////////////////////

// Get the city-not-found-page-container element
const cityNotFoundPage = document.getElementById("city-not-found-page-container");


let currentWeatherTitleDate = document.getElementById("current-weather-title-date");
let currentWeatherCelciousTitle = document.getElementById("current-weather-celcious-title");
let currentWeatherRealFeelTitle = document.getElementById("current-weather-real-feel-title");
let currentWeatherIcon = document.getElementById("current-weather-icon");
let currentWeatherInfoTitle = document.getElementById("current-weather-info-title");

//three-weather-time//
let weatherSunrise = document.getElementById("weather-sunrise");
let weatherSunset = document.getElementById("weather-sunset");
let weatherDuration = document.getElementById("weather-duration");

//////////////////////////////////////
let hourlyContainer = document.getElementById("hourly-container");
let hourlyContainerTable = document.getElementById("hourly-container-table");
/////////////////////////////////////
///Nearby place 
let nearbyPlacesLists = document.getElementById("nearby-places-lists");





function getCityWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
 
  
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  fetch(WEATHER_API_URL).then((res) => res.json()).then((data) => {
      console.log(data);
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-based
      const year = currentDate.getFullYear();
      currentWeatherTitleDate.textContent = `${day
        .toString()
        .padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;

      // Update current temperature in Celsius
      const tempCelsius = data.main.temp;
      currentWeatherCelciousTitle.textContent = `${(
        tempCelsius - 273.15
      ).toFixed(1)}°C`;

      // Update "Real Feel" temperature
      const feelsLikeCelsius = data.main.feels_like;
      currentWeatherRealFeelTitle.textContent = `Real Feel ${(
        feelsLikeCelsius - 273.15
      ).toFixed(1)}°C`;

      // Update weather icon
      const weatherIconCode = data.weather[0].icon;
      currentWeatherIcon.src = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

      // Update weather description
      currentWeatherInfoTitle.textContent = data.weather[0].description;

      // Calculate sunrise and sunset times
      const sunriseTimestamp = data.sys.sunrise;
      const sunsetTimestamp = data.sys.sunset;

      const sunriseDate = new Date(sunriseTimestamp * 1000); // Convert to milliseconds
      const sunsetDate = new Date(sunsetTimestamp * 1000);

      const sunriseHours = sunriseDate.getHours();
      const sunriseMinutes = sunriseDate.getMinutes();

      const sunsetHours = sunsetDate.getHours();
      const sunsetMinutes = sunsetDate.getMinutes();

      weatherSunrise.textContent = `Sunrise: ${convertTo12HourFormat(sunriseHours, sunriseMinutes)}`;
      weatherSunset.textContent = `Sunset: ${convertTo12HourFormat(sunsetHours, sunsetMinutes)}`;
      
      
      // Calculate duration
      const durationHours = sunsetHours - sunriseHours;
      const durationMinutes = sunsetMinutes - sunriseMinutes;
      let totalDuration = durationHours + durationMinutes / 60;
      const hours = Math.floor(totalDuration);
      const minutes = Math.floor((totalDuration - hours) * 60);
      weatherDuration.textContent = `Duration: ${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")} hr`;
    })

    .catch(() => {
      currentWeatherTitleDate.textContent = ""; // Clear date on error
      currentWeatherCelciousTitle.textContent = "";
      currentWeatherRealFeelTitle.textContent = "";
      currentWeatherIcon.src = ""; // Clear icon on error
      currentWeatherInfoTitle.textContent = ""; // Clear description on error

      weatherSunrise.textContent = "Sunrise: N/A";
      weatherSunset.textContent = "Sunset: N/A";
      weatherDuration.textContent = "Duration: N/A";

      alert(`City not found ${name}`);
    });



    /// 5 days forcast
    fetch(FORECAST_API_URL).then((res) => res.json()).then((data) => {
      console.log(data);

      // Extract unique forecast days and their corresponding data
      let uniqueForecastDays = {};
      data.list.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt);
        const forecastDateKey = forecastDate.getDate(); 
        if (!uniqueForecastDays[forecastDateKey]) {
          uniqueForecastDays[forecastDateKey] = forecast;
        }
      });

      // Update UI with 5-day forecast data
      const forecastContainers = [
        document.querySelector(".tonight-today-forecast"),
        document.querySelector(".today-forecast"),
        document.querySelector(".tomorrow-forecast"),
        document.querySelector(".two-days-from-today-forecast"),
        document.querySelector(".three-days-from-today-forecast"),
      ];

      let i = 0; 
      for (const date in uniqueForecastDays) {
        const forecast = uniqueForecastDays[date];
        const forecastDate = new Date(forecast.dt_txt);
        const dayOfWeek = days[forecastDate.getDay()];
        //const dateStr = forecastDate.getDate().toString().padStart(2, "0");
        const forecastDateStr = forecastDate.getDate().toString().padStart(2, "0"); 
        const forecastMonth = months[forecastDate.getMonth()];

        const forecastContainer = forecastContainers[i];
        
        forecastContainer.querySelector("h3").textContent = dayOfWeek.substring(0, 3).toUpperCase();
         

        //forecastContainer.querySelector("h4").textContent = `${dateStr}`;
        forecastContainer.querySelector("h4").textContent = `${forecastMonth} ${forecastDateStr}`; 


        const tempCelsius = forecast.main.temp - 273.15;
        forecastContainer.querySelector("h1").textContent = `${tempCelsius.toFixed(1)}°C`;

        const weatherIconCode = forecast.weather[0].icon;
        forecastContainer.querySelector("img").src = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

        //forecastContainer.querySelector("h3").textContent += `, ${forecast.weather[0].description}`;
        forecastContainer.querySelector("h3").textContent = forecastContainer.querySelector("h3").textContent.split(",")[0]; 


        i++;
        if (i >= 5) {
          break; // Limit to 5 forecasts
        }
      }





      //Hourly Container Table
      let hourlyHTML = "<tr><th>Today</th>";
      let forecastHTML = "<tr><td>Forecast</td>";
      let tempHTML = "<tr><td>Temp °C</td>";
      let realFeelHTML = "<tr><td>RealFeel</td>";
      let windHTML = "<tr><td>Wind (km/h)</td>";

      // Get current hour
      const currentHour = new Date().getHours();


      data.list.slice(0, 6).forEach((forecast, index) => {
        const forecastDate = new Date(forecast.dt_txt);
        const forecastTime = convertTo12HourFormat(currentHour + index, 0);

        // Add hour headers
        hourlyHTML += `<th>${forecastTime}</th>`;

        // Add weather icons
        const weatherIconCode = forecast.weather[0].icon;
        forecastHTML += `<td><img src="http://openweathermap.org/img/wn/${weatherIconCode}.png" alt="${forecastTime}"></td>`;

        // Add temperatures
        const tempCelsius = forecast.main.temp - 273.15;
        tempHTML += `<td>${tempCelsius.toFixed(1)}°</td>`;

        // Add real feels
        const feelsLikeCelsius = forecast.main.feels_like - 273.15;
        realFeelHTML += `<td>${feelsLikeCelsius.toFixed(1)}°</td>`;

        // Add wind speeds
        const windSpeed = forecast.wind.speed;
        const windDirection = forecast.wind.deg;
        windHTML += `<td>${windSpeed} ${getWindDirection(windDirection)}</td>`;
      });
      // Close table rows
      hourlyHTML += "</tr>";
      forecastHTML += "</tr>";
      tempHTML += "</tr>";
      realFeelHTML += "</tr>";
      windHTML += "</tr>"

      // Append all rows to the table
      hourlyContainerTable.innerHTML = hourlyHTML + forecastHTML + tempHTML + realFeelHTML + windHTML;


      //call nearby place function
      getNearbyPlaces(lat, lon); 
      
    })
    .catch(() => {
      alert("City not found");
    });
} 


//////////////////////////////////////////////////////



// Store the city not found state in a variable
let isCityNotFound = false;

searchBtn.addEventListener("click", getCityWeather);


function getCityWeather() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        // City not found
        isCityNotFound = true; 

        cityNotFoundPage.style.display = "flex";
        currentWeatherContainer.style.display = "none";
        hourlyContainer.style.display = "none";
        nearbyPlacesContainer.style.display = "none";
        fiveDayBroadcastContainer.style.display = "none";
      } else {
        // City found, proceed with weather details
        isCityNotFound = false; 

        let { name, lat, lon, country, state } = data[0];
        getCityWeatherDetails(name, lat, lon, country, state);
        //console.log(data);
      }
    })
    .catch(() => {
      // Handle network errors or other issues
      isCityNotFound = true; 
      cityNotFoundPage.style.display = "flex";
      currentWeatherContainer.style.display = "none";
      hourlyContainer.style.display = "none";
      nearbyPlacesContainer.style.display = "none";
      fiveDayBroadcastContainer.style.display = "none";
      alert(f`City not found ${cityName}`);
    });
  
}

fiveDayForecastContainerNav.addEventListener("click", () => {
  fiveDayForecastContainerNav.style.border = "solid 1px #6b6b6b";
  fiveDayForecastContainerNav.style.borderTop = "transparent";
  fiveDayForecastContainerNav.style.borderBottom = "solid 2px #038d8d";
  todayContainerNav.style.border = "transparent";

  if(isCityNotFound) {
    cityNotFoundPage.style.display = "flex"; 
    fiveDayBroadcastContainer.style.display = "none";
    hourlyContainer.style.display = "none";
    currentWeatherContainer.style.display = "none";
    nearbyPlacesContainer.style.display = "none";
  } else {
    cityNotFoundPage.style.display = "none";
    fiveDayBroadcastContainer.style.display = "flex";
    currentWeatherContainer.style.display = "none";
    hourlyContainer.style.display = "flex";
    nearbyPlacesContainer.style.display = "none";
  }
});

todayContainerNav.addEventListener("click", () => {
  todayContainerNav.style.border = "solid 1px #6b6b6b";
  todayContainerNav.style.borderTop = "transparent";
  todayContainerNav.style.borderBottom = "solid 2px #038d8d";
  fiveDayForecastContainerNav.style.border = "transparent";

  if(isCityNotFound) {
    cityNotFoundPage.style.display = "flex"; 
    currentWeatherContainer.style.display = "none";
    hourlyContainer.style.display = "none";
    nearbyPlacesContainer.style.display = "none";
  } else {
    cityNotFoundPage.style.display = "none";
    currentWeatherContainer.style.display = "flex";
    hourlyContainer.style.display = "flex";
    nearbyPlacesContainer.style.display = "flex";
    fiveDayBroadcastContainer.style.display = "none";

  }
});

//////////////////////
// Utility function to convert time to 12-hour format
function convertTo12HourFormat(hours, minutes) {
  const period = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  minutes = minutes.toString().padStart(2, '0');
  return `${hours}:${minutes} ${period}`;
}

// Utility function to convert wind direction in degrees to compass direction
function getWindDirection(deg) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

function getNearbyPlaces(lat, lon) {
  let limit = 4; // Fetch 4 nearby places
  let NEARBY_PLACES_API_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${api_key}`;

  fetch(NEARBY_PLACES_API_URL)
      .then(res => res.json())
      .then(data => {
          console.log("Nearby Places Data:", data); // Log the data for debugging

          // Clear existing nearby places
          nearbyPlacesLists.innerHTML = ""; // Clear all child elements

          if (data.length === 0) {
              // Handle case where no nearby places are found.
              const noPlacesMessage = document.createElement("p");
              noPlacesMessage.textContent = "No nearby places found.";
              nearbyPlacesLists.appendChild(noPlacesMessage);
              return; // Exit the function early
          }

          // Create groups dynamically based on the number of places found.
          let currentGroup = null;
          let placesInGroup = 0;
          let groupNumber = 1;

          data.forEach((place, index) => {
              if (placesInGroup === 0) { // Start a new group
                  currentGroup = document.createElement("div");
                  currentGroup.classList.add("nearby-places-groups-" + groupNumber);
              }

              const placeDiv = document.createElement("div");
              placeDiv.classList.add("nearby-places-group-" + (index + 1)); //Dynamic class name
              placeDiv.id = "nearby-places-group-" + (index + 1);

              const placeName = document.createElement("h4");
              placeName.textContent = place.name;
              placeDiv.appendChild(placeName);

              const weatherImage = document.createElement("img");
              weatherImage.src = "Logo/sunny-logo.png"; // Or fetch actual weather icon
              weatherImage.alt = "sunny";
              placeDiv.appendChild(weatherImage);

              const temp = document.createElement("h4");
              temp.textContent = "N/A"; // Or fetch actual temperature
              placeDiv.appendChild(temp);

              currentGroup.appendChild(placeDiv);
              placesInGroup++;

              if (placesInGroup === 2 || index === data.length - 1) { // End of a group or last element
                  nearbyPlacesLists.appendChild(currentGroup);
                  placesInGroup = 0;
                  groupNumber++;
              }
          });


      })
      .catch(error => {
          console.error("Error fetching nearby places:", error);
          const errorMessage = document.createElement("p");
          errorMessage.textContent = "Error fetching nearby places.";
          nearbyPlacesLists.appendChild(errorMessage);
      });
}
      


// Navbar Animation Swtiching between Today and 5-Day Forecast
