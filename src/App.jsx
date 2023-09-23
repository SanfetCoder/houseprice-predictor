import { useState } from 'react'
import './App.css'
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
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
      {currentPage === 'main' && <Main onChangeTown={handleChangeTown} onChangeCountry={handleChangeCountry} onChangePage={(page) => setCurrentPage(page)}/>}
      {currentPage === 'type' && <Type selectedHouse={typeOfHouse} onChangeType={handleChangeType} typeOfHouse={typeOfHouse}/>} 
    </div>
  )
}

const Main = ({onChangePage, onChangeCountry, onChangeTown}) => {
  return (
    <main>
      <h1>Use our tool to predict the price of any house of your interest</h1>
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
            onClick={()=>{
              onChangePage('type');
            }}
          >Continue</button>
        </form>
      </div>
    </main>
  )
};

const Type = ({typeOfHouse, onChangeType, selectedHouse}) => {
  return (
    <div className="type-container">
      <h1>Select the type of the house</h1>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y, EffectCoverflow]}
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
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
      >
        <SwiperSlide><HouseTypeCard selectedHouse={selectedHouse} onChangeType={onChangeType} content="Single Family" /></SwiperSlide>
        <SwiperSlide><HouseTypeCard selectedHouse={selectedHouse} onChangeType={onChangeType} content="Condo" /></SwiperSlide>
        <SwiperSlide><HouseTypeCard selectedHouse={selectedHouse} onChangeType={onChangeType} content="Two Family" /></SwiperSlide>
        <SwiperSlide><HouseTypeCard selectedHouse={selectedHouse} onChangeType={onChangeType} content="Three Family" /></SwiperSlide>
        <SwiperSlide><HouseTypeCard selectedHouse={selectedHouse} onChangeType={onChangeType} content="Four Family" /></SwiperSlide>
      </Swiper>
      {typeOfHouse && <button>Predict</button>}
      {!typeOfHouse && <button className="disabled" disabled>Predict</button>}
    </div>
  )
}

const HouseTypeCard = ({content, onChangeType, selectedHouse}) => {
  const isSelected = content === selectedHouse
  return (
    <div onClick={()=>onChangeType(content)} className={`house-card ${isSelected ? 'house-card-selected' : null}`}>
      <h1>{content}</h1>
    </div>
  )
}

export default App
