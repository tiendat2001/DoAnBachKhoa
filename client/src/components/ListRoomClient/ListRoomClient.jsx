import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import "./listRoomClient.css"
const ListRoomClient = ({ hotelId }) => {

  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);



  return (
    <div className="RoomClientContainer">
      <h1>Danh sách phòng</h1>
      {data.map((item) => (
        <div className="flex_div" style={{ border: '1px solid #7fc7af', padding: '10px' }}>

          <div style={{ width: '50%' }} >
            <div className="rTitle">{item.title}</div>
            <div className="rDesc">Số lượng người: {item.maxPeople}</div>
            <div className="rMax">{item.desc}</div>
          </div>

          <div>
            Giá phòng: {item.price}
          </div>

          {/* <div style={{ marginBottom: '10px' }}>
            <select>
              <option value="1">1 phòng</option>
              <option value="2">2 phòng</option>
              <option value="3">3 phòng</option>
            </select>
          </div> */}

          <div className="rSelectRooms" style={{ width: '30%' }}>
            {item.roomNumbers.map((roomNumber) => (
              <div className="room">
                {/* <label>{roomNumber.number}</label> */}
                {/*  lam the nao truyen them item.price */}
                <input
                  type="checkbox"
                  value={roomNumber._id}
                  // onClick={(e) => handleSelect(e, item.price, roomNumber.number)}
                  // disabled={!isAvailable(roomNumber)}
                />
              </div>
            ))}
            {/* <label htmlFor="checkbox"></label> */}
          </div>


        </div>
      ))}
    </div>
  )
}

export default ListRoomClient
