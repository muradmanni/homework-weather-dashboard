var formSubmit = document.querySelector("#search-form");
var searchInput = document.querySelector('#search-input');
var searchHistory = document.querySelector("#search-history");
var divContainerCity = document.querySelector("#container-city");

var lat;
var lon;

formSubmit.addEventListener('submit', getCityWeather);

function getCityWeather(event){
    event.preventDefault();
    if (searchInput.value)
    {
    var nx = document.createElement('p');
    nx.textContent=searchInput.value;
    nx.className = "search-history-style";
    searchHistory.appendChild(nx);
    getLocationCoordinates();
    searchInput.value="";
    }
}

function getLocationCoordinates(){
    var queryString="https://api.openweathermap.org/geo/1.0/direct?q=" + searchInput.value + "&appid=3ee1d7a9f54e63abfc09f48b34de5548";
    console.log(queryString);
    fetch(queryString)
    .then(function (response) {
      if (!response.ok) {
            throw response.json();
      }
      return response.json();
    })
    .then(function (locRes){
        if (!locRes.ok){
            lat = locRes[0].lat;
            lon = locRes[0].lon;
            getWeather(lat,lon);
            // var weatherQueryString="https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=3ee1d7a9f54e63abfc09f48b34de5548";
            // console.log(weatherQueryString);
        }
    });   
}

function getWeather(lat, lon){
    var weatherQueryString="https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=3ee1d7a9f54e63abfc09f48b34de5548&units=metric";
    console.log(weatherQueryString);
    fetch(weatherQueryString)
    .then(function (response) {
      if (!response.ok) {
            throw response.json();
      }
      return response.json();
    })
    .then(function (locRes){
        if (!locRes.ok){
            console.log(locRes);
            generateContainerCityDiv(locRes);
        }
    });   
}

function generateContainerCityDiv(locRes){
    
    var cityName=locRes.name;
    var temp=locRes.main.temp;
    var wind=locRes.wind.speed;
    var humidity=locRes.main.humidity;
    var uvIndex;
    var weatherIcon = locRes.weather.icon;

    var divCityHeading = document.createElement('div');
    divCityHeading.className = "col-md-12 city-heading";
    
    var cityNameElement = document.createElement('h3');
    cityNameElement.textContent = cityName;
    
    var tempElement = document.createElement('h5');
    tempElement.textContent = "Temp: " + temp;
    
    var windElement = document.createElement('h5');
    windElement.textContent = "Wind: " + wind;

    var humidityElement = document.createElement('h5');
    humidityElement.textContent = "Humidity: " + humidity;
                    
    var uvIndexElement = document.createElement('h5');
    uvIndexElement.textContent = "UV Index: " + uvIndex;
                    // <h5>UV Index:</h5>
    
    divContainerCity.className="container-city";
    divCityHeading.appendChild(cityNameElement);
    divCityHeading.appendChild(tempElement);
    divCityHeading.appendChild(windElement);
    divCityHeading.appendChild(humidityElement);
    divCityHeading.appendChild(uvIndexElement);
    divContainerCity.appendChild(divCityHeading);
}