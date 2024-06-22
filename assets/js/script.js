/*
5 day 3 hr forecast API call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=89c2d10cea5bf468636c45b15924d79d&units=imperial


coords by location name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d


reverse geocoding: http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d

*/

let locationURL = ``;
let weatherURL = ``;

let lastSearch = ``;

const searchFormEl = $('#search-form');
const searchInputEl = $('#search');
const resultsEl = $('#results');
const searchHistoryEl = $('#search-history');

// making a function to store an array into local storage
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

searchFormEl.on('click', handleSearch);
printSearchHistory();

// function to populate the search history section
function printSearchHistory() {
    const cityList = getSearchHistory();

    for (place of cityList) {
        const historyButton = $('<button>')
            .attr('data-type', 'history')
            .attr('data-name', place.name)
            .text(place.name);

        searchHistoryEl.append(historyButton);
    }
}

// create a function to make a card for each result
function createResultsCard(city) {

    const cityCard = $('<div>')
        .addClass('card my-3')
        .attr('data-city', city.name);

    const cityName = $('<h2>')
        .addClass('card-title h2')
        .text(city.name);

    const cityBody = $('<div>')
        .addClass('card-body');

    const cityTemp = $('<h3>')
        .addClass('card-text')
        .text(city.weather.temp);

    const cityWind = $('<h4>')
        .addClass('card-text')
        .text(city.weather.wind);

    const cityHumid = $('<h4>')
        .addClass('card-text')
        .text(city.weather.humid);

}

function getWeatherAPI() {
    fetch()
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}

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
                    name: '',
                    lat: '',
                    lon: ''
                }

                // get the locations array
                let results = getSearchHistory();

                searchResult.name = location.name;
                searchResult.lat = location.lat;
                searchResult.lon = location.lon;

                lastSearch = {
                    lat: location.lat,
                    lon: location.lon
                }

                localStorage.setItem('last', JSON.stringify(lastSearch));

                results.push(searchResult);

                setSearchHistory(results);

                searchHistoryEl.empty();
                searchInputEl.val('');
                printSearchHistory();

                //getWeatherAPI();

            }

        })
}