import React from 'react'
import './modifyRoomCount.css'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext, } from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
import { roomInputs } from '../../../formSource';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const ModifyRoomCount = () => {
    const location = useLocation();
    const idRoom = location.pathname.split("/")[5];
    const { data: roomTypeData, loading, error } = useFetch(`/rooms/find/${idRoom}`);

    const handleDelete = (roomId) => {
        console.log("Room ID to delete:", roomId);
        // Thêm logic xử lý xóa phần tử ở đây
    };
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ModifyRoomCountContainer">
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Loại phòng: {roomTypeData.title} (tổng số lượng phòng: {roomTypeData.roomNumbers?.length})</div>
                    <div  className="roomNumberContainer">
                            <div className="roomNumber">STT</div>
                            <div className="roomNumber">Trạng thái</div>
                            <div style={{width:'20%'}} className="roomNumber" >Xóa</div>
                        </div>
                    {roomTypeData.roomNumbers?.map((roomNumber, index) => (
                        <div key={index} className="roomNumberContainer">
                            <div className="roomNumber">{index + 1}</div>
                            <div className="roomNumber">{roomNumber.status ? 'Mở' : 'Đóng'}</div>
                            <button style={{width:'20%'}} className="roomNumber" onClick={() => handleDelete(roomNumber._id)}>Xóa</button>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ModifyRoomCount
