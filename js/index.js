const cityInput = document.querySelector(".city-input");

const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");

const notFoundSection = document.querySelector(".not-found");
const searchCitySectio = document.querySelector(".search-city");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummeryImg = document.querySelector(".weather-summery-img");
const currentDateTxt = document.querySelector(".current-date-txt");

const forcastItemsCont = document.querySelector(".forcast-items-cont");
const apiKay = "846f7a1461b72ca07a1afbcbe8d37341";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKay}&units=metric`;

  const response = await fetch(apiUrl);

  return response.json();
}

function getWeaatherIcon(id) {
  if (id <= 232) return "thunderstorm.png";
  if (id <= 321) return "drizzle.png";
  if (id <= 531) return "rain.png";
  if (id <= 622) return "snow.png";
  if (id <= 781) return "mist.png";
  if (id <= 800) return "clear.png";
  else return "cloud.png";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;

  tempTxt.textContent = Math.round(temp) + " °C";

  conditionTxt.textContent = main;

  humidityValueTxt.textContent = humidity + "%";

  windValueTxt.textContent = speed + " M/s";
  currentDateTxt.textContent = getCurrentDate();

  weatherSummeryImg.src = `imges/${getWeaatherIcon(id)} `;

  await updateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forcastItemsCont.innerHTML = "";
  forecastsData.list.forEach((forecastsWeather) => {
    if (
      forecastsWeather.dt_txt.includes(timeTaken) &&
      !forecastsWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastsWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };

  const daResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
    <div class="forcast-item">
    <h5 class="forcast-item-date  reguler-txt">

        ${daResult}

    </h5>

    <img src="imges/${getWeaatherIcon(
      id
    )}" alt="rain" class=" w-50 forcast-item-img">
    <h5 class="forcast-item-temp">
        ${Math.round(temp)}°C
    </h5>
</div>
    `;

  forcastItemsCont.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySectio, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );

  section.style.display = "flex";
}
