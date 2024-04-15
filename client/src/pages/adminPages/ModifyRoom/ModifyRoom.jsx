import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { roomInputs } from '../../../formSource';
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
                    <h1>Chỉnh sửa loại phòng</h1>
                </div>

                <div className="bottom">

                    {/*left- chỗ hiện ảnh đã chọn */}
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


                    {/* field up ảnh */}
                    <div className="right">
                        <form>

                            <div className="formInput">
                                <label htmlFor="file">
                                    Ảnh: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    multiple
                                    onChange={(e) => setFiles([...e.target.files])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {/* render các trường */}
                            {roomInputs.slice(0, 3).map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        // onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}
                            {/* test */}
                            <label>Mô tả phòng</label>
                            <textarea
                                id="desc"
                                rows="4" /* Số dòng mặc định hiển thị ban đầu */
                                // onChange={handleChange}
                                style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
                            ></textarea>

                            {/* <button onClick={handleClick} disabled={isSending}>
                                {isSending ? 'Sending...' : 'Thêm loại phòng'}
                            </button>             */}
                            </form>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default ModifyRoom
