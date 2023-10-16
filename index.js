const apikey="ba707aac3c6c866490c9f22ada735ba3";
const apiurl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchbox=document.querySelector(".search input")
const searchbutton=document.querySelector(".search button")
const weatherIcon=document.querySelector(".weather-icon")

async function checkweather(city){
    const response=await fetch(apiurl + city+`&appid=${apikey}`);
    var data=await response.json()
    console.log(data)
    document.querySelector(".city").innerHTML=data.name
    document.querySelector(".temp").innerHTML=Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML=data.main.humidity  + "%";
    document.querySelector(".wind").innerHTML=data.wind.speed + "KM/H";

    if(data.weather[0].main=="Clouds"){
        weatherIcon.src="clouds.png"
    }
    if(data.weather[0].main=="Clear"){
        weatherIcon.src="clear.png"
    }
    if(data.weather[0].main=="Rain"){
        weatherIcon.src="rain.png"
    }
    if(data.weather[0].main=="Drizzle"){
        weatherIcon.src="drizzle.png"
    }
    if(data.weather[0].main=="Mist"){
        weatherIcon.src="mist.png"
    }
    if(data.weather[0].main=="snow"){
        weatherIcon.src="snow.png"
    }
    if(data.weather[0].main=="storm"){
        weatherIcon.src="storm.png"
    }
    if(data.weather[0].main=="Haze"){
        weatherIcon.src="haze.png"
    }
    document.querySelector(".weather").style.display="block"
}

searchbutton.addEventListener("click",()=>{
    checkweather(searchbox.value)
})

checkweather()
