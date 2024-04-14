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
    const location = useLocation();
    const idRoom = location.pathname.split("/")[3];
    const { data, loading, error } = useFetch(`/rooms/find/${idRoom}`);
    // console.log(data)
    const [files, setFiles] = useState("");
    const [info, setInfo] = useState({});
    const { user } = useContext(AuthContext) // {user._id}
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                  {/* css từ newHotel.css */}
                  <div className="top">
                    <h1>Chỉnh sửa thông tin loại phòng</h1>
                </div>
            </div>
        </div>
    )
}

export default ModifyRoom
