import React from 'react'
import './newRoom.css'
import axios from "axios";
import useFetch from '../../../hooks/useFetch';
import { useState, useContext } from "react";
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { hotelInputs } from '../../../formSource';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const NewRoom = () => {
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
            </div>
        </div>
    )
}

export default NewRoom
