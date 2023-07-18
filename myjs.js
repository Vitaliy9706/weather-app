const key = 'YOUR_API_KEY';

// function to get data by city name
async function search() {
    const phrase = document.querySelector('input[type="text"]').value;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
    const data = await response.json();
    const ul = document.querySelector('form ul');
    ul.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const {name,lat,lon,country} = data[i];
        ul.innerHTML += `<li data-lat="${lat}" data-lon="${lon}" data-name="${name}">${name} <span>${country}</span></li>`;
    }
}

const debouncedSearch = _.debounce(() => {
    search();
}, 600);

//function to get weather data
async function showWeather(lat,lon,name) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await response.json();
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const wind = data.wind.speed;
    const humidity = data.main.humidity;
    const icon = data.weather[0].icon;
    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = Math.floor(temp) + '&#8451;';
    document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('feelsLikeValue').innerHTML = Math.floor(feelsLike) + '<span>&#8451;</span>';
    document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block';
}

document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

document.body.addEventListener('click', ev => {
    const li = ev.target;
    const {lat,lon,name} = li.dataset;
    if (!lat) {
        return;
    }
    showWeather(lat,lon,name);
});
