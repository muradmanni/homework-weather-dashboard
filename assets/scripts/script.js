var formSubmit = document.querySelector("#search-form");
var searchInput = document.querySelector('#search-input');
var searchHistory = document.querySelector("#search-history");
var divContainerCity = document.querySelector("#container-city");
var divCityForecast = document.querySelector("#city-forecast");
var variableCityName;
var localStorageWeatherCity= new Array();
var weatherIconLink ="https://openweathermap.org/img/wn/";
var lat;
var lon;

function getWeatherFromHistory(event){
    var clickedHistoryCity= $(event.target);
    variableCityName=clickedHistoryCity[0].innerHTML;
    getWeather(clickedHistoryCity[0].dataset.lat, clickedHistoryCity[0].dataset.lon);
}

function getCityWeather(event){
    event.preventDefault();
    if (searchInput.value)
    {
        variableCityName=searchInput.value;
        getLocationCoordinates();
        searchInput.value="";
    }
}

function getSearchHistory(){
    var weatherHistory = JSON.parse(localStorage.getItem('weatherCity'));
    if (weatherHistory!=null) 
    {
        localStorageWeatherCity=weatherHistory;
    }
    
    for (var i=0; i <localStorageWeatherCity.length;i++)
    {
        lat=localStorageWeatherCity[i].lat;
        lon=localStorageWeatherCity[i].lon;
        addDisplayCityHistory(localStorageWeatherCity[i].city);
    }
}
function addCityToLocalStorage(val){
    localStorageWeatherCity.push({city:val, lat:lat, lon:lon});
    localStorage.setItem('weatherCity',JSON.stringify(localStorageWeatherCity));
    addDisplayCityHistory(val);
}

function addDisplayCityHistory(val){
    var cityHistoryButton = document.createElement('button');
    cityHistoryButton.textContent= val;
    cityHistoryButton.className = "search-history-style";
    cityHistoryButton.setAttribute("data-lon",lon);
    cityHistoryButton.setAttribute("data-lat",lat);
    searchHistory.appendChild(cityHistoryButton);
}

function getLocationCoordinates(){
    var queryString="https://api.openweathermap.org/geo/1.0/direct?q=" + searchInput.value + "&appid=3ee1d7a9f54e63abfc09f48b34de5548";
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
            addCityToLocalStorage(variableCityName);
        }
    });   
}

function getWeather(lat, lon){
    var weatherQueryString="http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minute,hourly&appid=3ee1d7a9f54e63abfc09f48b34de5548&units=metric";
    fetch(weatherQueryString)
    .then(function (response) {
      if (!response.ok) {
            throw response.json();
      }
      return response.json();
    })
    .then(function (locRes){
        if (!locRes.ok){
            generateContainerCityDiv(locRes);
            generateCityForecastDiv(locRes);
        }
    });   
}

function generateContainerCityDiv(locRes){
    var date = (moment().format("MMMM Do, YYYY"));
    var cityName=variableCityName;
    var temp= Math.round(locRes.current.temp);
    var wind=locRes.current.wind_speed;
    var humidity=locRes.current.humidity;
    var uvIndex=locRes.current.uvi;
    var weatherIcon = locRes.current.weather[0].icon;
    
    divContainerCity.innerHTML="";

    var divCityHeading = document.createElement('div');
    divCityHeading.className = "col-md-12 city-heading";
    
    var cityNameElement = document.createElement('h3');
    cityNameElement.textContent = cityName.toUpperCase() +  "  (" + date + ")" ;
    
    var weatherIconImage = document.createElement('img');
    weatherIconImage.setAttribute('src', weatherIconLink+weatherIcon+".png");

    var tempElement = document.createElement('h5');
    tempElement.innerHTML = "Temp: " + temp + " <sup>o</sup>C";
    
    var windElement = document.createElement('h5');
    windElement.textContent = "Wind: " + wind + " MPH";

    var humidityElement = document.createElement('h5');
    humidityElement.textContent = "Humidity: " + humidity + " %";
                    
    var uvIndexElement = document.createElement('h5');
    uvIndexElement.textContent = "UV Index: ";
    
    var uvIndexValueElement = document.createElement('span');
    uvIndexValueElement.textContent =  uvIndex;
    uvIndexValueElement.setAttribute('class',getAttribute(uvIndex) + " uv-index");
    
    divContainerCity.className="container-city";
    cityNameElement.appendChild(weatherIconImage);
    divCityHeading.appendChild(cityNameElement);
    
    divCityHeading.appendChild(tempElement);
    divCityHeading.appendChild(windElement);
    divCityHeading.appendChild(humidityElement);

    uvIndexElement.appendChild(uvIndexValueElement);
    divCityHeading.appendChild(uvIndexElement);
    divContainerCity.appendChild(divCityHeading);
}


function getAttribute(uvIndex){
    if (uvIndex<=2){
            return "uv-index-low";
    }
    else if(uvIndex>2 && uvIndex<=5)
        {return "uv-index-moderate";}
    else
    {
        return "uv-index-high";
    }
}

function generateCityForecastDiv(locRes){
    divCityForecast.innerHTML="";

    var divCityForecastHeading = document.createElement('h5');
    divCityForecastHeading.textContent="5-Day Forecast:"

    divCityForecast.appendChild(divCityForecastHeading);
    
    var divCityForecastRow = document.createElement('div');
    divCityForecastRow.className = "row w-100";

    for (var i=1; i<=5; i++)
    {
        var temp=Math.round(locRes.daily[i].temp['day']);
        var wind=locRes.daily[i].wind_speed;
        var humidity=locRes.daily[i].humidity;

        var weatherIcon = locRes.daily[i].weather[0].icon;
        var dailyDivForecast = document.createElement('div');
        dailyDivForecast.className= "col-xl-2 col-lg-3 col-md-5 col-sm-5 daily";

        var dailyForecastDate=document.createElement('h4');
        dailyForecastDate.textContent=moment.unix(locRes.daily[i].dt).format("DD/MM/YYYY");
        
        var dailyWeatherIconImage = document.createElement('img');
        dailyWeatherIconImage.setAttribute('src', weatherIconLink+weatherIcon+".png");
    
        var dailyTempElement = document.createElement('p');
        dailyTempElement.innerHTML = "Temp: " + temp + " <sup>o</sup>C";
        
        var dailyWindElement = document.createElement('p');
        dailyWindElement.textContent = "Wind: " + wind + " MPH";
    
        var dailyHumidityElement = document.createElement('p');
        dailyHumidityElement.textContent = "Humidity: " + humidity + " %";
    
        dailyDivForecast.appendChild(dailyForecastDate);
        dailyDivForecast.appendChild(dailyWeatherIconImage);
        dailyDivForecast.appendChild(dailyTempElement);
        dailyDivForecast.appendChild(dailyWindElement);
        dailyDivForecast.appendChild(dailyHumidityElement);
        divCityForecastRow.appendChild(dailyDivForecast);
    }
    
     divCityForecast.appendChild(divCityForecastRow);
    
}

function init()
{
    getSearchHistory();
}

formSubmit.addEventListener('submit', getCityWeather);
$("#search-history").on('click','.search-history-style', getWeatherFromHistory);
init(); 