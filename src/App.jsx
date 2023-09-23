import { useState } from 'react'
import './App.css'
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import towns from '../town';

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
  
  function handleChangeCountry(country){
    setCountry(country);
  }

  function handleChangeTown(town){
    setTown(town);
  }

  function handleChangeType(type){
    setTypeOfHouse(type)
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
      <Type onChangePage={(page)=> setCurrentPage(page)} selectedHouse={typeOfHouse} onChangeType={handleChangeType} typeOfHouse={typeOfHouse}/>
      } 
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
          <label for="inputCountry">Which country do you live?</label>
          <select onChange={(e)=>onChangeCountry(e.target.value)} name="inputCountry">
            <option>Select a country</option>
            <option value="USA">USA</option>
          </select>
        </div>
        <div className="form-control">
          <label for="inputTown">Select a town</label>
          <select
            onChange={(e)=>onChangeTown(e.target.value)}
            name="inputTown">
            <option>Select a town</option>
            {
              towns.map(town => <option value={town}>{town}</option>)
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

const Type = ({typeOfHouse, onChangeType, selectedHouse, onChangePage}) => {
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
        {typeOfHouse ? <button>Predict</button> : <button className="disabled" disabled>Predict</button>}
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
    "Single Family" : "src/assets/icon-single-family.png",
    "Condo" : "src/assets/icon-condominium.png",
    "Two Family" : "src/assets/icon-two-family.png",
    "Three Family" : "src/assets/icon-three-family.png",
    "Four Family" : "src/assets/icon-four-family.png"
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
