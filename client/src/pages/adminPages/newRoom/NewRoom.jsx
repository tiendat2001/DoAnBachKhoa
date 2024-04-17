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
    const { data, loading, error } = useFetch(`/hotels?ownerId=${user._id}`);
    const [hotelId, setHotelId] = useState();
    const navigate = useNavigate()

    const handleHotelChange = (e) => {
        setHotelId(e.target.value);
    };

    const validateInputs = () => {
        console.log(hotelId)
        // Check if all hotelInputs are filled
        for (let input of roomInputs) {
          if (!document.getElementById(input.id).value) {
            return false;
          }
        }
        // Check if description is filled
        if (!document.getElementById("desc").value.trim()  || (files.length === 0) || hotelId == null   )  {//|| (files.length === 0) sau thêm cái này vào lúc triển khai
          return false;
        }
        return true;
      };

    const handleChange = (e) => {
        if (e.target.id === "roomNumbers") {
            const numberOfRooms = parseInt(e.target.value);
            const roomQuantity = Array.from({ length: numberOfRooms }, () => ({}));
            setInfo((prev) => ({ ...prev, [e.target.id]: roomQuantity }));
        } else {
            setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        }

        

    };
    // console.log(info)

    // khi người dùng submit

    const handleClick = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
          const list = await Promise.all(
            Object.values(files).map(async (file) => {
              const data = new FormData();
              data.append("file", file);
              data.append("upload_preset", "upload");
              const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/tiendat2001/image/upload",
                data
              );
              // console.log(uploadRes.data)
              const { url } = uploadRes.data;
              return url;
            })
          );
    
          if (!validateInputs()) {
            toast.error("Please fill in all fields before submitting.");
          } else {
            const newRoom = {
              ...info,
              photos: list,
              ownerId: user._id
            };
    
                // console.log(newRoom)

            const Success = await axios.post(`/rooms/${hotelId}`, newRoom);
            if (Success) {
              toast.success('Thành công!');
            //   navigate("/admin/hotels");
    
            } else toast.error("Error.Please try again");
    
    
          }
    
    
        } catch (err) {
          console.log(err);
        } finally {
          setIsSending(false); // Kết thúc xử lý, trả lại trạng thái ban đầu cho nút
        }
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

                            {/* select box khach san */}
                            <div className="roomSelectBox">
                            {/* <label>Choose a hotel</label> */}
                            <select
                                id="hotelId"
                                value={hotelId}
                                onChange={handleHotelChange}
                            >
                                <option disabled selected>Chọn khách sạn</option>
                                {loading
                                    ? "loading"
                                    : data &&
                                    data.map((hotel) => (
                                        <option key={hotel._id} value={hotel._id}>
                                            {hotel.name}
                                        </option>
                                    ))}
                            </select>

                        </div>


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
                            {roomInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        onChange={handleChange}
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
                                onChange={handleChange}
                                style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
                            ></textarea>

                            <button onClick={handleClick} disabled={isSending}>
                                {isSending ? 'Sending...' : 'Thêm loại phòng'}
                            </button>            
                            </form>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default NewRoom
