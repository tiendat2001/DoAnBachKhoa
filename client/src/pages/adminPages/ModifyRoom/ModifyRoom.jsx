import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { hotelInputs } from '../../../formSource';
import { toast } from 'react-toastify';
const ModifyRoom = () => {
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
            </div>
        </div>
    )
}

export default ModifyRoom
