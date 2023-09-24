import { useState } from 'react'
import './App.css'
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import towns from '../town';
import axios from "axios";
import {v4} from "uuid";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [country, setCountry] = useState(null);
  const [town, setTown] = useState(null);
  const [typeOfHouse, setTypeOfHouse] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  
  function handleChangeCountry(country){
    setCountry(country);
  }

  function handleChangeTown(town){
    setTown(town);
  }

  function handleChangeType(type){
    setTypeOfHouse(type)
  }

  async function handlePredictPrice(){
    const endpoint = `https://housify-predictor.onrender.com/${town}/${typeOfHouse}`;
    const response = await axios.get(endpoint);
    setEstimatedPrice(response.data['predicted_price'])
  }

  return (
    <div id="app"> 
      {currentPage === 'main' && 
        <Main>
          <h1>Use our tool to predict the price of any house of your interest</h1>
          <Card currentCountry={country} currentTown={town} onChangeTown={handleChangeTown} onChangeCountry={handleChangeCountry} onChangePage={(page) => setCurrentPage(page)}/>
        </Main>
      }

      {currentPage === 'type' && 
      <Type onPredictPrice={handlePredictPrice} currentTown={town} currentType={typeOfHouse} onChangePage={(page)=> setCurrentPage(page)} selectedHouse={typeOfHouse} onChangeType={handleChangeType} typeOfHouse={typeOfHouse}/>
      }

      {currentPage === 'result' &&
      <Result predictedPrice={estimatedPrice}/>
      }
    </div>
  )
}

const Result = ({predictedPrice}) => {
  return (
    <div className="result-container">
      <div className="content">
        <h3>Estimated Price</h3>
        {predictedPrice ? <h1>${predictedPrice.toLocaleString()}</h1> : <h1>Loading...</h1>}
        <button onClick={()=>window.location.reload()}>Try more</button>
      </div>
    </div>
  )
}

const Main = ({children}) => {
  return (
    <main>
      {children}
    </main>
  )
};

const Card = ({onChangePage, onChangeCountry, onChangeTown, currentCountry, currentTown}) => {
  return (
    <div className="card">
      <form>
        <div className="form-control">
          <label htmlFor="inputCountry">Which country do you live?</label>
          <select onChange={(e)=>onChangeCountry(e.target.value)} name="inputCountry">
            <option>Select a country</option>
            <option value="USA">USA</option>
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="inputTown">Select a town</label>
          <select
            onChange={(e)=>onChangeTown(e.target.value)}
            name="inputTown">
            <option>Select a town</option>
            {
              towns.map(town => <option key={v4()} value={town}>{town}</option>)
            }
          </select>
        </div>
        <button
          onClick={(event)=>{
            if (currentCountry && currentTown){
              event.preventDefault();
              onChangePage('type');
            } else {
              event.preventDefault();
              alert("Make sure all the forms are filled")
            }
          }}
        >Continue</button>
      </form>
    </div>
  )
}

const Type = ({typeOfHouse, onChangeType, selectedHouse, onChangePage, onPredictPrice}) => {

  const types = [
  "Single Family",
  "Condo",
  "Two Family",
  "Three Family",
  "Four Family"
  ]

  return (
    <div className="type-container">
      <nav>
        <BackButton onChangeType={onChangeType} onChangePage={onChangePage}/>
      </nav>
      <div className="content">   
        <h1>Select the type of the house</h1>
        <Carousel>
          {
            types.map(type => <SwiperSlide><HouseTypeCard selectedHouse={selectedHouse} onChangeType={onChangeType} content={type} /></SwiperSlide>)
          }
        </Carousel>
        {typeOfHouse ? 
        <button 
          onClick={()=>{
            onChangePage('result')
            onPredictPrice();
            }
          }>Predict</button> : <button className="disabled" disabled
        >Predict</button>
        }
      </div>
    </div>
  )
}

const BackButton = ({onChangePage, onChangeType}) => {
  return (
  <div className="back-button" onClick={
    ()=> {
      onChangePage('main');
      // Set type to null for not selected
      onChangeType(null);
      }
    }>
    <ion-icon name="chevron-back-outline"></ion-icon>
    <p>Back</p>
  </div>
  )
}

const Carousel = ({children}) => {
  return (
    <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, EffectCoverflow]}
        spaceBetween={50}
        slidesPerView={3}
        effect={'coverflow'}
        pagination={{ clickable: true }}
        grabCursor={true}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
      >
        {children}
      </Swiper>
  )
}

const HouseTypeCard = ({content, onChangeType, selectedHouse}) => {
  const imgDict = {
    "Single Family" : "assets/icon-single-family.png",
    "Condo" : "assets/icon-condominium.png",
    "Two Family" : "assets/icon-two-family.png",
    "Three Family" : "assets/icon-three-family.png",
    "Four Family" : "assets/icon-four-family.png"
  };
  const isSelected = content === selectedHouse
  return (
    <div onClick={()=>onChangeType(content)} className={`house-card ${isSelected ? 'house-card-selected' : null}`}>
      <img className={`${isSelected ? 'floating' : null}`} src={imgDict[content]}/>
      <h1>{content}</h1>
    </div>
  )
}

export default App
