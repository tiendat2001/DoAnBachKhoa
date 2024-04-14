import React from 'react'
import './newRoom.css'
import axios from "axios";
import useFetch from '../../../hooks/useFetch';
import { useState, useContext } from "react";
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { roomInputs } from '../../../formSource';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const NewRoom = () => {

    const [files, setFiles] = useState("");
    const [info, setInfo] = useState({});
    // const [rooms, setRooms] = useState([]);
    const { user } = useContext(AuthContext) // {user._id}
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
                {/* css từ newHotel.css */}
                <div className="top">
                    <h1>Thêm loại phòng</h1>
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
                            <img
                                src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                alt="No image"
                            />
                        )}
                    </div>


                    {/* field up ảnh */}
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
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
                            {roomInputs.map((input) => (
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
                                {isSending ? 'Sending...' : 'Post your hotel'}
                            </button>             */}
                            </form>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default NewRoom
