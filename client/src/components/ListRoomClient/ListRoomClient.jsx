import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import "./listRoomClient.css"
const ListRoomClient = ({ hotelId }) => {

  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  console.log(data)
  return (
    <div className="RoomClientContainer">
      {data.map((item) => (
        <div className="flex_div" style={{ border: '1px solid #7fc7af', padding: '10px' }}>

          <div style={{width:'50%'}} >
            <div  className="rTitle">{item.title}</div>
            <div className="rDesc">Số lượng người: {item.maxPeople}</div>
            <div className="rMax">{item.desc}</div>
          </div>

          <div>
            Giá phòng: {item.price}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <select>
              <option value="1">1 phòng</option>
              <option value="2">2 phòng</option>
              <option value="3">3 phòng</option>
              {/*Thêm các tùy chọn khác nếu cần*/}
            </select>
          </div>

          <div>
            <input type="checkbox" id="checkbox" name="checkbox" value="checkbox" />
            <label htmlFor="checkbox"></label>
          </div>


        </div>
      ))}
    </div>
  )
}

export default ListRoomClient
