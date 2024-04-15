
import React from 'react';
import Navbar from '../navbar/Navbar';
import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import { useState, useContext } from "react";
// hien calendar
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format,addDays  } from "date-fns";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from '../../context/AuthContext';

const Header = ({ type }) => {
  const searchContext =useContext(SearchContext);
  const [destination, setDestination] = useState(searchContext.destination);
  const [dates, setDates] = useState(searchContext.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(searchContext.options);

  const [openOptions, setOpenOptions] = useState(false);

  const navigate = useNavigate();
  // sự kiện chỉnh sửa số người, room
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        // dùng [] để truy cập vì name là biến, chưa xác định rõ (hoặc giá trị chứa dấu cách), chỉ khi xđ rõ mới dùng dấu .
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  // Search Context
  const { dispatch } = useContext(SearchContext);

  const {user} = useContext(AuthContext)

  const handleSearch = () => {
    // luu nhung lua chon de dung cho page sau
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });

    navigate("/hotels", { state: { destination, dates, options } });
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        {/* <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span>Attractions</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airport taxis</span>
          </div>
        </div> */}
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
             You can go anywhere you want
            </h1>
            <p className="headerDesc">
              Choose the hotel with the best price for yourself
            </p>
            {/* {!user && <button className="headerBtn">Sign in / Register</button>} */}
            <div className="headerSearch">
              {/* thanh search city */}
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  placeholder="Hà Nội"
                  className="headerSearchInput "
                  // doi trang thai state destination moi khi thay doi
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              {/* thanh search ngày */}
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                {/* chỗ hiển thị lên UI */}
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>

                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    className="date"
                    minDate={new Date()} // ngày tối thiểu đc chọn
                  />
                )}
              </div>


              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" /> 
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span> 
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Room</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.room <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;