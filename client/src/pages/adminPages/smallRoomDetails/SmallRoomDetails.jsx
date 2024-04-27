import React from 'react'
import './smallRoomDetails.css'
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
const SmallRoomDetails = () => {
    const location = useLocation();
    const idRoom = location.pathname.split("/")[4];
    const { data: roomTypeData, loading, error } = useFetch(`/rooms/find/${idRoom}`);
    const { data: roomCountStatus, loadingroomCountStatus, errorroomCountStatus } = useFetch(`/rooms/statusRoomCount/${idRoom}`);
    console.log(roomTypeData)
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="detailsRoomTypeContainer">
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Loại phòng: {roomTypeData.title} (tổng số lượng phòng: {roomTypeData.roomNumbers?.length})</div>
                    <div>
                        Số lượng phòng đang rao bán trong 30 ngày tới
                        <span style={{ fontWeight: 'bold' }}> </span>
                    </div>
                    <div className="tableRoomStatus">
                        <div className="grid-container">
                            {roomCountStatus.map((status, index) => (
                                <div className="grid-item" key={index}>
                                    <div>{`${status.day}/${status.month}/${status.year}`}</div>
                                    <div>Phòng trống:{status.countAvailable}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default SmallRoomDetails
