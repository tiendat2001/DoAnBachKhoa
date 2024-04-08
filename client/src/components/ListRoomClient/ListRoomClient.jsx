import React from 'react'
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
const ListRoomClient = () => {

const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);

  return (
    <div>
      <h1>ddd</h1>
    </div>
  )
}

export default ListRoomClient
