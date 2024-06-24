/*
5 day 3 hr forecast API call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&cnt=5&appid=89c2d10cea5bf468636c45b15924d79d&units=imperial


coords by location name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d


reverse geocoding: http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d

*/

let locationURL = ``;
let weatherCurrentURL = ``;
let weatherFiveURL = ``;

let lastSearch = ``;

const searchBodyEl = $('#search-body');
const searchFormEl = $('#search-form');
const searchInputEl = $('#search');
const resultsEl = $('#results');
const currentCityEl = $('#current-city-card');
const fiveDayEl = $('#five-day-card');
const searchHistoryEl = $('#search-history');

// making a function to store an array of search history into local storage
function setSearchHistory(someArray) {
    localStorage.setItem('results', JSON.stringify(someArray));
}

// making a function to return local storage, or make an empty array.
function getSearchHistory() {
    let results = [];

    if (localStorage.getItem('results') != null) {
        results = JSON.parse(localStorage.getItem('results'));
        return results;
    } else {

        return results;

    }
}

// making a function to grab search results
function handleSearch(event) {

    event.preventDefault();
    const target = event.target;
    const targetSearch = target.dataset.type;

    const apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
    const apiKey = '&limit=1&appid=89c2d10cea5bf468636c45b15924d79d';

    if (targetSearch === 'search-button') {

        let userSearchVal = searchInputEl.val();

        locationURL = `${apiURL}${userSearchVal}${apiKey}`;

        console.log(`locationURL: ${locationURL}`);

        getLocationAPI();

    } else if (targetSearch === 'history') {

        let userSearchVal = target.dataset.name;

        locationURL = `${apiURL}${userSearchVal}${apiKey}`;
        
        getLocationAPI();

    }
}

searchBodyEl.on('click', handleSearch);
printSearchHistory();

// function to populate the search history section
function printSearchHistory() {
    const cityList = getSearchHistory();

    //clear the search history field
    searchHistoryEl.empty();

    for (place of cityList) {

        const historyButton = $('<button>')
            .addClass('btn btn-dark my-1')
            .attr('data-type', 'history')
            .attr('data-name', place.name)
            .text(place.name);

        searchHistoryEl.append(historyButton);
    }
}

// create a function to make a card for each result
function createResultsCard(city, time, temp, wind, humid, weather) {

    const cityCard = $('<div>')
        .addClass('card bg-primary bg-gradient border border-primary border-3')
        .attr('data-city', city.name);

    const cityName = $('<h2>')
        .addClass(`card-title h2 city-title ${weather}`)
        .text(city.name);

    const cityTime = $('<p>')
        .addClass('card-text')
        .text(time);

    const cityBody = $('<div>')
        .addClass('card-body');

    const cityTemp = $('<h4>')
        .addClass('card-text')
        .text(`Temp: ${temp}`);

    const cityWind = $('<h4>')
        .addClass('card-text')
        .text(`Wind: ${wind}`);

    const cityHumid = $('<h4>')
        .addClass('card-text')
        .text(`Humidity: ${humid}`);

    cityBody.append([cityTemp, cityWind, cityHumid]);
    cityCard.append([cityName, cityTime, cityBody]);

    return cityCard;
}

// function to check if a location is already in the array
function cityArrayCleanup(name) {

    const results = getSearchHistory();

    for (let i = 0; i < results.length; ++i) {
        if (name === results[i].name) {
            results.splice(i, 1);
        }
    }

    setSearchHistory(results);

}


// fetch function for current weather conditions of searched location
function getWeatherAPI() {

    const lastSearchedObject = JSON.parse(localStorage.getItem('last'));

    const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=`;

    const currentAPIKey = `&cnt=1&appid=89c2d10cea5bf468636c45b15924d79d&units=imperial`;
    const fiveAPIKey = `&appid=89c2d10cea5bf468636c45b15924d79d&units=imperial`;

    weatherCurrentURL = `${weatherAPI}${lastSearchedObject.lat}&lon=${lastSearchedObject.lon}${currentAPIKey}`;
    weatherFiveURL = `${weatherAPI}${lastSearchedObject.lat}&lon=${lastSearchedObject.lon}${fiveAPIKey}`;

    fetch(weatherCurrentURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {


        for (prop of data.list) {


            let citys = getSearchHistory();

            let city = citys[citys.length-1];
            city.temp = data.list[0].main.temp;
            city.wind = data.list[0].wind.speed;
            city.humid = data.list[0].main.humidity;
            city.time = dayjs(data.list[0].dt_txt).format('MM/DD/YYYY');
            city.weather = data.list[0].weather[0].main;

            //clear current city element
            currentCityEl.empty();
            currentCityEl.append(createResultsCard(city, city.time, city.temp, city.wind, city.humid, city.weather));
        }
    })

    fetch(weatherFiveURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        for (prop of data.list) {
            let citys = getSearchHistory();

            let city = citys[citys.length-1];
            
            city.temp1 = data.list[7].main.temp;
            city.temp2 = data.list[15].main.temp;
            city.temp3 = data.list[23].main.temp;
            city.temp4 = data.list[31].main.temp;
            city.temp5 = data.list[39].main.temp;

            city.wind1 = data.list[7].wind.speed;
            city.wind2 = data.list[15].wind.speed;
            city.wind3 = data.list[23].wind.speed;
            city.wind4 = data.list[31].wind.speed;
            city.wind5 = data.list[39].wind.speed;

            city.humid1 = data.list[7].main.humidity;
            city.humid2 = data.list[15].main.humidity;
            city.humid3 = data.list[23].main.humidity;
            city.humid4 = data.list[31].main.humidity;
            city.humid5 = data.list[39].main.humidity;

            city.time1 = dayjs(data.list[7].dt_txt).format('MM/DD/YYYY');
            city.time2 = dayjs(data.list[15].dt_txt).format('MM/DD/YYYY');
            city.time3 = dayjs(data.list[23].dt_txt).format('MM/DD/YYYY');
            city.time4 = dayjs(data.list[31].dt_txt).format('MM/DD/YYYY');
            city.time5 = dayjs(data.list[39].dt_txt).format('MM/DD/YYYY');

            city.weather1 = data.list[7].weather[0].main;
            city.weather2 = data.list[15].weather[0].main;
            city.weather3 = data.list[23].weather[0].main;
            city.weather4 = data.list[31].weather[0].main;
            city.weather5 = data.list[39].weather[0].main;

            //clear five-day city element
            fiveDayEl.empty();
            fiveDayEl.append(createResultsCard(city, city.time1, city.temp1, city.wind1, city.humid1, city.weather1));
            fiveDayEl.append(createResultsCard(city, city.time2, city.temp2, city.wind2, city.humid2, city.weather2));
            fiveDayEl.append(createResultsCard(city, city.time3, city.temp3, city.wind3, city.humid3, city.weather3));
            fiveDayEl.append(createResultsCard(city, city.time4, city.temp4, city.wind4, city.humid4, city.weather4));
            fiveDayEl.append(createResultsCard(city, city.time5, city.temp5, city.wind5, city.humid5, city.weather5));
        }
    })
}

// fetch function to grab the location, store it locally, and call the weather APIs.
function getLocationAPI() {
    fetch(locationURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        for (let location of data) {

            cityArrayCleanup(location.name);

            // declaring the location object
            let searchResult = {
                name: location.name,
                lat: location.lat,
                lon: location.lon,
                temp: ''
            }

            // get the locations array
            let results = getSearchHistory();

            lastSearch = {
                lat: location.lat,
                lon: location.lon,
                name: location.name
            }

            localStorage.setItem('last', JSON.stringify(lastSearch));


            results.push(searchResult);

            setSearchHistory(results);

            searchInputEl.val('');

            printSearchHistory();

            getWeatherAPI();

        }

    })
}