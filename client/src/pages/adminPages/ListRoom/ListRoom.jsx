import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import "./listRoom.css"
import { DataGrid } from "@mui/x-data-grid";
import { roomColumns } from '../../../datatablesource';
import useFetch from '../../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation } from "react-router-dom";

const ListRoom = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data: hotelData, loading: hotelLoading, error: hotelError, reFetch: hotelReFetch } = useFetch(`/hotels?ownerId=${user._id}`);
    const [hotelId, setHotelId] = useState(hotelData.length > 0 ? hotelData[0]._id : null);
    const { data: roomData, loading: roomLoading, error: roomError, reFetch: roomReFetch } = useFetch(`/rooms/${hotelId}`);
    const handleHotelChange = (e) => {
        setHotelId(e.target.value);
    };
    useEffect(() => {
        // Gọi roomReFetch khi hotelId thay đổi để load lại dữ liệu phòng mới
        if (hotelId) {
            roomReFetch();
        }
    }, [hotelId]);
    // console.log(roomData)

    // thêm cột xóa sửa
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 170,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link
                              to={`/admin/rooms/${params.row._id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="viewButton">Chỉnh sửa</div>
                        </Link>
                        <div
                            className="deleteButton"
                        //   onClick={() => handleDelete(params.row._id)}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ListRoomAdminContainer">
                    <h2>Your Rooms</h2>
                    <div style={{ display: 'flex' , justifyContent:'space-between', alignItems:'center' }}>

                        <div className="hotelSelectBox">
                            {/* <label>Choose a hotel</label> */}
                            <select
                                id="hotelId"
                                value={hotelId}
                                onChange={handleHotelChange}
                            >
                                <option disabled selected>Chọn khách sạn</option>
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

                        <Link to={`/admin/rooms/new`}>
                            <button style={{ fontSize: '14px', backgroundColor: '#ccc', border: 'none', height: '40px' }}>Thêm loại phòng</button>

                        </Link>
                    </div>


                </div>


                <DataGrid autoHeight
                    className="datagrid"
                    rows={roomData}
                    columns={roomColumns.concat(actionColumn)}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    getRowId={(row) => row._id}
                />




            </div>
        </div>

    )
}

export default ListRoom
