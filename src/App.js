import "./App.css";
import Container from '@mui/material/Container';
import CloudIcon from '@mui/icons-material/Cloud';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


//// React hooks
import { useState, useEffect } from "react";

///// external libraries
import axios from 'axios'
import moment from 'moment';
import "../node_modules/moment/locale/ar-ly";
import { useTranslation } from 'react-i18next';


const CancelToken = axios.CancelToken;



export default function App() {
  //// states
  const [weatherInfo, setWeatherInfo] = useState({
    temp: "",
    description: "",
    min: "",
    max: "",
    icon: ""
  })
  const [date, setDate] = useState("");
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("ar-ly");
  const dir = lang === "ar-ly" ? "rtl" : "ltr"

  let cancelAxios = null;

  function toggleLang() {
    if (lang === "ar-ly") {
      setLang("en");
      moment.locale("en");
    } else {
      setLang("ar-ly");
      moment.locale("ar-ly");
    }
    setDate(moment().format('Do MMMM  YYYY, h:mm:ss a'));

  }


  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);


  ///// API requests
  useEffect(() => {
    setDate(moment().format('Do MMMM  YYYY, h:mm:ss a'));
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=31.0409&lon=31.4913&appid=1ec056259bceffc8a5b9f54d2e0d92bb', {
      cancelToken: new CancelToken(function executor(c) {
        cancelAxios = c;
      })
    })
      .then(function (response) {
        // handle success
        let res = response.data.main
        let temp = Math.round(res.temp - 272.15);
        let maxTemp = Math.round(res.temp_max - 272.15);
        let minTemp = Math.round(res.temp_min - 272.15);
        let description = response.data.weather[0].description;
        let icon = response.data.weather[0].icon;
        setWeatherInfo({ ...weatherInfo, temp: `${temp}°C`, max: `${maxTemp}°C`, min: `${minTemp}°C`, description: description, icon: icon })
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    //////cancel the request
    return () => {
      // cancel the request
      cancelAxios();
    }

  }, [])




  return (
    <div className="App" style={{ backgroundColor: "#0052d0", with: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container maxWidth="md" fixed>
        {/* WeatherCard */}
        <div className="weather-card" dir={dir} style={{ width: "100%", color: "white", padding: "15px", backgroundColor: "#0947a8", borderRadius: "10px", boxShadow: "2px 5px 10px #0947a8" }}>
          {/* CITY & DATE */}
          <div className="city-date" style={{ padding: "5px 10px", display: "flex", alignItems: "end", gap: "10px" }}>
            <Typography className="city-name" variant="h1" style={{ fontWeight: "800" }}>
              {t('Mansoura')}
            </Typography>
            <Typography className="date" variant="h6" gutterBottom>
              {date}
            </Typography>
          </div>
          {/* == CITY & DATE == */}

          <hr />

          {/* WEATHER INFO & ICON */}
          <div style={{ display: "flex", textAlign: "start", justifyContent: "space-between", padding: "25px" }}>
            {/* DEGREES & STATUS */}
            <div>

              <div dir={dir} style={{ display: "flex", alignItems: "center" }}>

                <Typography variant="h2" dir={dir} style={{ fontWeight: "500", }}>
                  {weatherInfo.temp}
                </Typography>
                <img className="weather-icon" src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`} alt="weather condition" />
              </div>
              <Typography variant="h6" dir={dir} style={{ fontWeight: "500", marginBottom: "10px" }}>
                {t(weatherInfo.description)}
              </Typography>

              {/* MAX & MIN DEGREE */}
              <div style={{ display: "inline-block" }}><span>{t("max")} : {weatherInfo.max}</span> </div>
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>|</span>
              <div style={{ display: "inline-block" }}><span> {t("min")} : {weatherInfo.min}</span> </div>

              {/* == MAX & MIN DEGREE == */}

            </div>
            {/* == DEGREES & STATUS == */}

            {/* CLOUD ICON */}
            <CloudIcon style={{ color: "white", fontSize: "200px" }} />
            {/* == CLOUD ICON == */}
          </div>
          {/* == WEATHER INFO & ICON == */}



        </div>
        {/* == WeatherCard == */}

        {/* CHANGE LANGUAGE BTN */}
        {/* == CHANGE LANGUAGE BTN == */}
        <div style={{ width: "100%", textAlign: "start", display: 'flex', marginTop: '15px' }}>
          <Button variant="text" onClick={toggleLang} style={{ color: "white", border: "1px solid rgb(255 255 255 /0.15)" }}>{lang === "ar" ? "الانجليزية" : "ARABIC"}</Button>

        </div>
      </Container >
    </div >
  );
}

