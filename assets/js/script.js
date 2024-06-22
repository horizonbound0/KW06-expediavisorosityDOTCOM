/*
5 day 3 hr forecast API call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=89c2d10cea5bf468636c45b15924d79d


coords by location name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d


reverse geocoding: http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d

*/

let locationURL = ``;

const searchFormEl = $('#search-form');
const searchInputEl = $('#search');
const modalBodyEl = $('.modal-body');

let userSearchVal = '';

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
    const targetSearch = target.dataset.search;

    if (targetSearch === 'search-button') {
        let userSearchVal = '';
        const apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
        const apiKey = '&limit=5&appid=89c2d10cea5bf468636c45b15924d79d';

        userSearchVal = searchInputEl.val();
        locationURL = `${apiURL}${userSearchVal}${apiKey}`;
        getLocationAPI();
    }
}

searchFormEl.on('click', handleSearch);

// create a function to make a card for each result
function createResultsCard(result) {

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
                    state: '',
                    country: '',
                    lat: '',
                    lon: ''
                }

                // get the locations array
                let results = getSearchHistory();

                searchResult.name = location.name;
                searchResult.state = location.state;
                searchResult.country = location.country;
                searchResult.lat = location.lat;
                searchResult.lon = location.lon;

                results.push(searchResult);

                setSearchHistory(results);

            }

        })
}

//console.log(`Locations: ${getSearchHistory}`);
            
//console.log(typeof getSearchHistory);

//getAPI();