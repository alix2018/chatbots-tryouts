// v3.1.0
//Docs at http://simpleweatherjs.com
var json

var weatherIcons = {
	"01d": "32",
	"02d": "30",
	"03d": "26",
	"04d": "25",
	"09d": "11",
	"10d": "39",
	"11d": "0",
	"13d": "13",
	"50d": "20"
}


axios.get('/datajson')
  .then(function(response) {
    console.log(response.data);
    console.log(response.status);
    console.log('city:',response.data.name);
    console.log('weather1:',response.data.weather[0].description);
    console.log('degres:', parseFloat(response.data.main.temp-273.15).toFixed(0));
    json = response.data
  });

console.log('dataJson3:', json);

$(document).ready(function() {
  $.simpleWeather({
    location: 'Amsterdam',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      console.log('weather2:',weather);
      console.log('nb:', weatherIcons[json.weather[0].icon]);
      html = '<h2><i class="icon-'+weatherIcons[json.weather[0].icon]+'"></i> '+ parseFloat(json.main.temp-273.15).toFixed(0)+'&deg;'+weather.units.temp+'</h2>';
      html += '<ul><li>'+json.name+', '+json.sys.country+'</li>';
      html += '<li class="currently">'+json.weather[0].description+'</li>';
      html += '<li>'+json.wind.speed+' '+ 'M/S' +'</li></ul>';

      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
});
