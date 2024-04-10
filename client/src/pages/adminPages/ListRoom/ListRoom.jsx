import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import "./listRoom.css"
import { DataGrid } from "@mui/x-data-grid";
import { roomColumns } from '../../../datatablesource';
import useFetch from '../../../hooks/useFetch';
import { useContext,useState,useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext';

const ListRoom = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data: hotelData, loading: hotelLoading, error: hotelError, reFetch: hotelReFetch } = useFetch(`/hotels?ownerId=${user._id}`);   
    const [hotelId, setHotelId] = useState(hotelData.length > 0 ? hotelData[3]._id : null);
    const { data: roomData, loading: roomLoading, error: roomError, reFetch: roomReFetch } = useFetch(`/rooms/${hotelId}`);

    useEffect(() => {
        // Kiểm tra xem hotelData có dữ liệu không và set hotelId từ dữ liệu đầu tiên (nếu có)
      roomReFetch()
    }, [hotelData, hotelId]); 
    console.log(roomData)
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {hotelLoading
                    ? "loading"
                    : hotelData &&
                    hotelData.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
           </div>
        </div>

    )
}

export default ListRoom
