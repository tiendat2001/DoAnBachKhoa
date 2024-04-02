import "./list.css";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState,useContext ,useEffect} from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
const List = () => {
  const location = useLocation();
  const searchContext =useContext(SearchContext);
  const [destination, setDestination] = useState(searchContext.destination);
  const [dates, setDates] = useState(searchContext.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(searchContext.options);
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(10000);
  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}`
  );
  const { dispatch } = useContext(SearchContext);

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };
  const handleClick = () => {
    reFetch();
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
  };

  useEffect(() => {
    // console.log("Updated changes:", dates);
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
  }, [destination, dates, options]);


  const handleDayChange=(item) => {
    setDates([item.selection])
  };

  const handleOptionChange = (e, optionName) => {
    const value = e.target.value;
    setOptions(prevOptions => ({
      ...prevOptions,
      [optionName]: value
    }));
  };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const calculatePrice = (cheapestPrice) => {
    // thay số 2 bằng số người của phòng min price
    if(Math.floor(options.adult / cheapestPrice.people)==0){
      return cheapestPrice.price*days;
    }else{
      return  cheapestPrice.price * Math.floor(options.adult / cheapestPrice.people)*days;
    } 
   
  };
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} value={destination} onChange={handleDestinationChange} type="text" />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                onChange={(item) => handleDayChange(item)}                  
                minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              {/*  chinh gia tien */}
              <label>Price option</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    placeholder={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    placeholder={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div> 
                 <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    onChange={(e) => handleOptionChange(e, 'adult')}
                  />
                </div> 
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    onChange={(e) => handleOptionChange(e, 'children')}

                  />
                </div> 
                 <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    onChange={(e) => handleOptionChange(e, 'room')}

                  />
                </div> 
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "loading"
            ) : (
              <>
              {data.map((item) => {
              const price = calculatePrice(item.cheapestPrice);
              if (price >= min && price <= max) {
                return <SearchItem item={item} key={item._id} />;
              }
              return null;
            })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default List;