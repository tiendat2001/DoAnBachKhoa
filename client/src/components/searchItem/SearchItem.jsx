import { Link } from "react-router-dom";
import "./searchItem.css";
import React from "react";
import { SearchContext } from "../../context/SearchContext";
import { useState, useContext } from "react";

// nhung HOTEL hien tren thanh search


const SearchItem = ({ item }) => {
  const {dates, options } = useContext(SearchContext);
  const [roomInSearchItem, setroomInSearchItem] = useState(1);
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const calculatePrice = (cheapestPrice) => {
    let totalPrice=0;
    let totalPeople = parseInt(options.adult, 10) + parseFloat(options.children) * 0.5;
    if(options.room >Math.floor(totalPeople / cheapestPrice.people)){
      totalPrice= cheapestPrice.price *options.room*days;
    } else
    // console.log(totalPeople)
    if (Math.floor(totalPeople / cheapestPrice.people) == 0) {
      totalPrice= cheapestPrice.price * days;
    } else {
      //new Intl.NumberFormat('vi-VN').format(params.value*1000)
      totalPrice= cheapestPrice.price * Math.floor(totalPeople / cheapestPrice.people) * days;
    }
    // nhân 1000 chỉ là để hiển thị, còn lọc giá ở trang list ko nhân 1000
    return Intl.NumberFormat('vi-VN').format(totalPrice*1000)
   
  };

  const calculateRoom = (cheapestPrice) => {
    let totalPeople = parseInt(options.adult, 10) + parseFloat(options.children) * 0.5;

      if(options.room >Math.floor(totalPeople / cheapestPrice.people)) return options.room
      else{
        return  Math.floor(totalPeople / cheapestPrice.people)
      }
     
   
  };
  return (
    <div className="searchItem">
      <img src={item.photos[0]} alt="" className="siImg" />
      
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">Distance: {item.distance}m from center</span>
        {/* <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span> */}
        {/* <span className="siFeatures">{item.desc}</span> */}
        {/* <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span> */}
        <span className="siFeatures">Address: {item.address}</span>
      </div>

      <div className="siDetails">
        {/* {item.rating && <div className="siRating">
          <span>Excellent</span>
          <button>{item.rating}</button>
        </div>} */}

        <div className="siDetailTexts">
        <span className="siPrice">Giá từ: {calculatePrice(item.cheapestPrice)} VND</span>
          <span className="siTaxOp">Cho {options.adult} người, {options.children} trẻ em, {calculateRoom(item.cheapestPrice)} phòng, {days} đêm</span>
          {/* chuyen sang xem thong tin tung hotel */}
          <Link to={`/hotels/${item._id}`}>
          <button className="siCheckButton">More info</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;