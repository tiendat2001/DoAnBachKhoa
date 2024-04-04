import React from 'react'
import "./newHotel.css"
import axios from "axios";
import useFetch from '../../../hooks/useFetch';
import { useState, useContext } from "react";
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { hotelInputs } from '../../../formSource';
import { AuthContext } from '../../../context/AuthContext';
const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const { user } = useContext(AuthContext) // {user._id}


  const { data, loading, error } = useFetch("/rooms");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };

  // console.log(files);

  const handleClick = async (e) => {
    e.preventDefault();
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
          console.log(uploadRes.data)
          const { url } = uploadRes.data;
          return url;
        })
      );

      const newhotel = {
        ...info,
        photos: list,
        ownerId: user._id
      };

      const Success = await axios.post("/hotels", newhotel);
      if (Success) alert("Adding hotel successfully");
      else alert("Lost connection");
    } catch (err) {
      console.log(error);
    }
  };
  return (
    // lấy css từ ListHotel.css
    <div className="listAdmin">
      <Sidebar />
      <div className="listContainerAdmin">
        <NavbarAdmin />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          {/*left- chỗ up ảnh */}

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
              {hotelInputs.map((input) => (
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

              {/* <div className="selectRooms">
                  <label>Rooms</label>
                  <select id="rooms" multiple onChange={handleSelect}>
                    {loading
                      ? "loading"
                      : data &&
                        data.map((room) => (
                          <option key={room._id} value={room._id}>
                            {room.title}
                          </option>
                        ))}
                  </select>
                </div> */}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>



        </div>
      </div>
    </div>
  );
}

export default NewHotel
