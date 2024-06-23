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
const fiveDayEl = $('#5-day-card');
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
            .addClass('btn btn-light my-1')
            .attr('data-type', 'history')
            .attr('data-name', place.name)
            .text(place.name);

        searchHistoryEl.append(historyButton);
    }
}

// create a function to make a card for each result
function createResultsCard(city) {

    const cityCard = $('<div>')
        .addClass('card')
        .attr('data-city', city.name);

    const cityName = $('<h2>')
        .addClass('card-title h2 city-title')
        .text(city.name);

    const cityTime = $('<p>')
        .addClass('card-text')
        .text(city.time);

    const cityBody = $('<div>')
        .addClass('card-body');

    const cityTemp = $('<h3>')
        .addClass('card-text')
        .text(`Temp: ${city.temp}`);

    const cityWind = $('<h4>')
        .addClass('card-text')
        .text(`Wind: ${city.wind}`);

    const cityHumid = $('<h4>')
        .addClass('card-text')
        .text(`Humidity: ${city.humid}`);

    cityBody.append([cityTemp, cityWind, cityHumid]);
    cityCard.append([cityName, cityTime, cityBody]);

    return cityCard;
}

// function to check if a location is already in the array -------------------cityInArray(city);
function cityInArray(name) {

    const results = getSearchHistory();
}

// fetch function for five day forecast


// fetch function for current weather conditions of searched location
function getRecentWeatherAPI() {

    const lastSearchedObject = JSON.parse(localStorage.getItem('last'));

    console.log(`Last searched object lat and lon was: ${lastSearchedObject.lat} & ${lastSearchedObject.lon}`);

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

                for (city of citys) {

                    if (city.name === data.city.name) {


                        city.temp = data.list[0].main.temp;
                        city.wind = data.list[0].wind.speed;
                        city.humid = data.list[0].main.humidity;
                        city.time = dayjs(data.list[0].dt_txt).toString();

                        //clear current city element
                        currentCityEl.empty();
                        currentCityEl.append(createResultsCard(city));
                    }

                }
                setSearchHistory(citys);
            }

        })

        fetch(weatherFiveURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('this is the 5 day vvv');
            console.log(data);

            for (prop of data.list) {
                let citys = getSearchHistory();

                for (city of citys) {

                    if (city.name === data.city.name) {


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

                        city.time1 = dayjs(data.list[7].dt_txt).toString();
                        city.time2 = dayjs(data.list[15].dt_txt).toString();
                        city.time3 = dayjs(data.list[23].dt_txt).toString();
                        city.time4 = dayjs(data.list[31].dt_txt).toString();
                        city.time5 = dayjs(data.list[39].dt_txt).toString();

                        //clear current city element
                        //fiveDayEl.empty();
                        //fiveDayEl.append(createResultsCard(city));
                    }

                }
                setSearchHistory(citys);
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

            console.log(data);

            for (let location of data) {

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

                //cityInArray(searchResult);

                results.push(searchResult);

                setSearchHistory(results);

                searchInputEl.val('');

                printSearchHistory();

                getRecentWeatherAPI();

            }

        })
}