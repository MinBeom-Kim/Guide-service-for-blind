const weather = document.querySelector(".js-weather");
var container = document.getElementById('map');

const API_KEY = "f5946ac701cd8a67bc89c1667083d24d"
const API_KEY_KAKAO = "44d58646975a25fb4044f2b3ffacdd65"
const COORDS = 'coords';

function getMap(lat, lon) {
    fetch(`http://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY_KAKAO}`
    ).then(function (params) {
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(let, lon), //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };

        var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    })
}

function getWeather(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then(function (response) {
        return response.json()
    }).then(function (json) {
        const temperature = json.main.temp;
        const place = json.name;
        weather.innerText = `${temperature} °C  // ${place}`;
    })
}

function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSucces(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function handleGeoError(position) {
    console.log('위치 정보를 얻을 수 없습니다.');
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
    
}

function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if (loadedCoords === null) {
        askForCoords();
    } else {
        const parseCoords = JSON.parse(loadedCoords);
        getWeather(parseCoords.latitude, parseCoords.longitude);
        getMap(parseCoords.latitude, parseCoords.longitude)
    }
}

function init() {
    loadCoords(); 
}

init();