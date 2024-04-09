import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import "./listRoomClient.css"
const ListRoomClient = ({hotelId}) => {

const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
    console.log(data)
  return (
    <div className="RoomClientContainer">
      {data.map((item) => (
        <div className="flex_div">
          <div>
            <h1>{item.title}</h1>
            <h2>{item.maxPeople}</h2>
            <h2>{item.desc}</h2>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListRoomClient
