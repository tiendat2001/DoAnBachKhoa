import { Link } from "react-router-dom";
import "./searchItem.css";
import React from "react";
import { SearchContext } from "../../context/SearchContext";
import { useState, useContext } from "react";

// nhung HOTEL hien tren thanh search


const SearchItem = ({ item }) => {
  const {dates, options } = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const calculatePrice = (cheapestPrice) => {
    // thay số 2 bằng số người của phòng min price
    if(Math.floor(options.adult / 2)==0){
      return cheapestPrice*days;
    }else{
      return  cheapestPrice * Math.floor(options.adult / 2)*days;
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
        <span className="siPrice">Price from: ${calculatePrice(item.cheapestPrice)}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
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