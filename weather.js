const form = document.querySelector("form");
const input = document.querySelector("form input");
const msgSpan = form.querySelector(".msg");
const list = document.querySelector(".container .cities");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherDataFromApi();
  form.reset();
  // input.value = "";
  // e.currentTarget.reset();
});

const getWeatherDataFromApi = async () => {
  const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  console.log(apiKey);
  const cityName = input.value;
  const units = "metric";
  const lang = "tr";

  //http request url(endpoint)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

  try {
    const response = await fetch(url).then((response) => response.json());
    // console.log(response);

    const { main, name, sys, weather } = response;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

    console.log(response);

    const cityNameSpan = list.querySelectorAll("span");
    if (cityNameSpan.length > 0) {
      const filteredArray = [...cityNameSpan].filter(
        (span) => span.innerHTML == name
      );
      if (filteredArray.length > 0) {
        msgSpan.innerText = `You already know the weather for ${name}, Please search for another city 👌`;
        setTimeout(() => {
          msgSpan.innerText = "";
        }, 5000);
        return;
      }
    }
    const createdlLi = document.createElement("li");
    createdlLi.classList.add("city");
    createdlLi.innerHTML = `<h2 class="city-name" data-name="${name},${
      sys.country
    }">

    <span>${name}</span>
    <sup>${sys.country}</sup>
    </h2>
      <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
      <figure>
      <img class="city-icon" src="${iconUrlAWS}">
      <figcaption>${weather[0].description}</figcaption>
      </figure>`;
    list.prepend(createdlLi);
  } catch (error) {
    msgSpan.innerText = "City not found!";
    setTimeout(() => {
      msgSpan.innerText = "";
    }, 5000);
  }
};
