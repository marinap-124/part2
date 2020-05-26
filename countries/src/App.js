import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({searchName, handleSearch}) => {
    return (  
        <div>
            find country <input value={searchName} onChange={handleSearch} /> <br/>          
        </div> 
    )
}

const Message = ({countries, searchName}) =>  {
  const count = (searchName.length > 0)? countries.length :0
  if (count > 10) { 
    return "Too many matches, specify another filter";
  }
  return "";
}

const Country = ({ country, showCountryDetails, setToCapital }) => (      
    <li>{country.name} 
      <button onClick={() => {showCountryDetails(country.name); setToCapital(country.capital)}}>
            Show
      </button> 
    </li>
)

const Lang = ({ country }) => ( 
  <div>
    <h3>languages</h3>
    <ul>{             
          country.languages.map((lang) =>
            <li key={lang.name}>{lang.name}</li>          
            )            
          }
    </ul> 
  </div>    

)

const CountryInfo = ({ country }) => ( 
  <div>
      <h2>{country.name} </h2>
      capital {country.capital} <br/>
      population {country.population} <br/>
  </div>    

)

const Flag = ({ country }) => ( 
  <div>
    <img src={country.flag} alt={country.name} height="100" width="100"></img>
  </div>    

)

const Weather = ({ country, weather }) => ( 
  <div>
      <h3>weather</h3>
      temperature:{weather.temperature} Celcius<br/> 
      humidity:  {weather.humidity} %<br/>
      <img src={weather.img} alt={country.name} height="100" width="100"></img> 
  </div>    
)

const CountryDetails = ({ country,  weather }) => {
  return(
    <div>
      <CountryInfo  country={country} />
      <Lang  country={country} />
      <Flag  country={country} />
      <Weather  country={country} weather={weather}/>

    </div>
 )        
}

const Countries = ({countries, searchName, showCountryDetails, setToCapital, weather}) => {
  
  let countriesToShow = (searchName.length > 0)? countries : new Array(0).fill("")
 
  if(countriesToShow.length > 10) {
    countriesToShow = new Array(0).fill("")
  }
  
  useEffect(() => {
    if(countriesToShow.length === 1){
      setToCapital(countriesToShow[0].capital)
    }
  }, [countries])

 
  if(countriesToShow.length === 1){
    return(
      <div>
          <CountryDetails  country={countriesToShow[0]}  weather={weather}  />
      </div>
    )
  }

  
  return (
        <div>    
            <ul>{             
              countriesToShow.map((country) => 
                  <Country key={country.name} country={country} 
                                  showCountryDetails={showCountryDetails}
                                  setToCapital={setToCapital}
                                   />   
                )            
            }
            </ul> 
        </div> 
  )
          
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ searchName, setSearchName ] = useState('')
  const [ weather, setWeather] = useState({
    temperature: '',
    humidity: '',
    img: ''
  })
  const [ capital, setCapital] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  
  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY
   
    if(capital.length > 0){
      axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
        .then(response => {
          console.log("Weather ", response.data)
          setWeather({temperature:response.data.current.temperature,
            humidity:response.data.current.humidity,
            img: response.data.current.weather_icons[0] 
          })          
        })
      }
  }, [capital])


  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  const countriesFound = countries.filter(country => country.name.toLowerCase().includes(searchName.toLowerCase()))

  const showCountryDetails = (name) => {
    setSearchName(name)
  }

  const setToCapital = (name) => {
    setCapital(name)
  }


  return (
    <div>       
        <Filter searchName={searchName} handleSearch={handleSearch} />  
        <Message countries={countriesFound} searchName={searchName} />     
        <Countries countries={countriesFound} 
                  searchName={searchName} 
                  showCountryDetails={showCountryDetails}
                  setToCapital={setToCapital}
                  weather={weather}
                   />

       
    </div>
  )
}

export default App
