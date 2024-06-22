/*
5 day 3 hr forecast API call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=89c2d10cea5bf468636c45b15924d79d&units=imperial


coords by location name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d


reverse geocoding: http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d

*/

let locationURL = ``;
let weatherURL = ``;

let lastSearch = ``;

const searchBodyEl = $('#search-body');
const searchFormEl = $('#search-form');
const searchInputEl = $('#search');
const resultsEl = $('#results');
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

    const lastSearchedObject = JSON.parse(localStorage.getItem('last'));

    console.log(`Last searched object lat and lon was: ${lastSearchedObject.lat} & ${lastSearchedObject.lon}`);

    const weatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=`;
    const APIKey = `&appid=89c2d10cea5bf468636c45b15924d79d&units=imperial`;
    weatherURL = `${weatherAPI}${lastSearchedObject.lat}&lon=${lastSearchedObject.lon}${APIKey}`;

    console.log(weatherURL);

    fetch(weatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data.list[0].dt_txt);

            for (prop of data.list) {
                let citys = getSearchHistory();

                for (city of citys) {
                    if (city.name === data.city.name) {
                        
                        city.temp = data.list[0].main.temp;
                        city.wind = data.list[0].wind.speed;
                        city.humid = data.list[0].main.humidity;

                    }
                    
                }

                /** 
                for (city of citys) {
                    if (city.name === )
                    city.temp = prop.main.temp;
                    console.log(city.temp);

                }
                */
                setSearchHistory(citys);
            }

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
                    lon: '', 
                    temp: ''
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

                getWeatherAPI();

            }

        })
}