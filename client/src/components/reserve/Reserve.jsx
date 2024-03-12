import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from '../../context/AuthContext';
const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedRoomsNumber, setSelectedRoomsNumber] = useState([]);

  // lay ds room theo hotel Id
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const {user} = useContext(AuthContext)
  const [selectedRoomsPrice, setSelectedRoomsPrice] = useState();

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const dayDistance = dayDifference(dates[0].endDate, dates[0].startDate);
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e, price,roomNumberSelected) => {
    const checked = e.target.checked;
    const value = e.target.value;
    
    setSelectedRoomsPrice(price);
    setSelectedRoomsNumber(roomNumberSelected)

    console.log(value)
    // lay cac phong nguoi dung da tick, them value vao selectedRoom
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const reserveRoom = async () => {

    if(selectedRooms.length==1){
      try {
        await Promise.all(
          selectedRooms.map((roomId) => {
            const res = axios.put(`/rooms/availability/${roomId}`, {
              dates: alldates,
            });
            
            const upload =  axios.post(`/orders/${roomId}`, {
              username:user.username,
              roomNumbers:selectedRoomsNumber,
              start:dates[0].startDate,
              end:dates[0].endDate,
              price:selectedRoomsPrice*selectedRooms.length*dayDistance,
              hotelid:hotelId
                });
  
  
            return res.data;
          })
          
        );
        setOpen(false);
       
      } catch (err) {}
      console.log("User đặt"+user._id)
      console.log("So Phòng đặt"+selectedRoomsNumber)
      console.log("Ngày phòng đặt"+dates[0].endDate)
  
      console.log("Giá hóa đơn"+selectedRoomsPrice*selectedRooms.length*dayDistance)
  
   
  
      alert("Successful reserve")
      navigate("/");
    }else{
      alert("Please select only one room")
    }
    
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price} per night</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  {/*  lam the nao truyen them item.price */}
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onClick={(e) => handleSelect(e, item.price,roomNumber.number)}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={reserveRoom} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;