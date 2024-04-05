import React from 'react'
import "./modifyHotel.css"
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
const ModifyHotel = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[3];
    const { data, loading, error } = useFetch(`/hotels/find/${id}`);
    console.log(data)
    const [files, setFiles] = useState("");
    const [info, setInfo] = useState({});
    // const [rooms, setRooms] = useState([]);
    const { user } = useContext(AuthContext) // {user._id}
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
                {/* lấy theo css của newHotel.css */}
                <div className="listHotelAdminContainer">
                    <div className="top">
                        <h1>Modify Your Hotel</h1>
                    </div>

                    <div className="bottom">
                        <div className="left">
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt={`Uploaded image ${index + 1}`}
                                    />
                                ))
                            ) : (
                                <div className="no-image-container">
                                    {data.photos?.map((photo, index) => (
                                        <img key={index} src={photo} alt={`Ảnh ${index}`} />
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="right">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModifyHotel
