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
    const { data:roomTypeData, loading, error } = useFetch(`/rooms/find/${idRoom}`);
    console.log(roomTypeData)
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="detailsRoomTypeContainer">
                    <h1>d</h1>
                </div>

            </div>
        </div>

    )
}

export default SmallRoomDetails
