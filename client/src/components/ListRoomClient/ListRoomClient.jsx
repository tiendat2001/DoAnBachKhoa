import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import "./listRoomClient.css"
import { useContext, useState } from "react";

const ListRoomClient = ({ hotelId }) => {

  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // lấy roomNumber_id theo tích
  const handleSelectCheckBox = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value) // nếu bỏ tích thì bỏ phòng có value đấy ra mảng, giữ lại phòng kp value
    );
  };
  const isAvailable = (roomNumber) => {
    // const isFound = roomNumber.unavailableDates.some((date) =>
    //   alldates.includes(new Date(date).getTime())
    // );

    // return !isFound;
    return false
  };

  // console.log(selectedRooms)

  return (
    <div className="RoomClientContainer">
      <h1>Bạn muốn đặt phòng?</h1>
      {data.map((item) => (
        <div className="flex_div" style={{ border: '1px solid #7fc7af', }}>

          <div style={{ width: '50%' }} >
            <div className="rTitle">{item.title}</div>
            <div className="rDesc">Số lượng người: {item.maxPeople}</div>
            <div className="rMax">{item.desc}</div>
          </div>

          <div>
            Giá phòng: {item.price}
            <br />
            (Mỗi đêm)
          </div>

          {/* <div style={{ marginBottom: '10px' }}>
            <select>
              <option value="1">1 phòng</option>
              <option value="2">2 phòng</option>
              <option value="3">3 phòng</option>
            </select>
          </div> */}

          <div className="rSelectRooms" style={{ width: '20%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '70%', alignItems: 'center' }}>
              {item.roomNumbers.map((roomNumber) => (
                isAvailable(roomNumber) ? (
                  <div className="room" key={roomNumber._id}>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelectCheckBox}
                    />
                  </div>
                ) : null
              ))}
            </div>

            <div style={{ width: '20%' }}>(TÍch số lượng ô bằng với số lượng phòng)</div>

            {/* <label htmlFor="checkbox"></label> */}
          </div>


        </div>
      ))}
    </div>
  )
}

export default ListRoomClient
