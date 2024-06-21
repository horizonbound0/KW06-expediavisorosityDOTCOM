/*
5 day 3 hr forecast API call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=89c2d10cea5bf468636c45b15924d79d


coords by location name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d


reverse geocoding: http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=89c2d10cea5bf468636c45b15924d79d

*/

let locationURL = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=89c2d10cea5bf468636c45b15924d79d";

function getLocalStorageLocNames () {
    if(localStorage.getItem('Location Names') != null) {
        localStorage.getItem('Location Names');
    }
}

function getAPI() {
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data);

            const locationResults = [];

            for (let location of data) {
                
                const locationName = location.name;
                console.log(`Location name: ${locationName}`);
                locationResults.push(locationName);

            }
            
            console.log(`Location names: ${locationResults}`);

        })
}

getAPI();