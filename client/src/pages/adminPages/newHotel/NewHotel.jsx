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
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  // const [rooms, setRooms] = useState([]);
  const { user } = useContext(AuthContext) // {user._id}
  const navigate = useNavigate()

  const { data, loading, error } = useFetch("/rooms");

  // validate
  const validateInputs = () => {
    // Check if all hotelInputs are filled
    for (let input of hotelInputs) {
      if (!document.getElementById(input.id).value) {
        return false;
      }
    }
    // Check if description is filled
    if (!document.getElementById("desc").value.trim() || (files.length === 0)) {
      return false;
    }
    return true;
  };

  // khi ng dùng nhập thông tin
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // const handleSelect = (e) => {
  //   const value = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value
  //   );
  //   setRooms(value);
  // };

  console.log(files);

  // khi ng dùng submit
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
          // console.log(uploadRes.data)
          const { url } = uploadRes.data;
          return url;
        })
      );

      if (!validateInputs()) {
        toast.error("Please fill in all fields before submitting.");
      } else {
        const newhotel = {
          ...info,
          photos: list,
          ownerId: user._id
        };


        const Success = await axios.post("/hotels", newhotel);
        if (Success) {
          toast.success('Thành công!');
          navigate("/admin/hotels");

        } else toast.error("Error.Please try again");


      }


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
              {/* test */}
              <label>Hotel description</label>
              <textarea
                id="desc"
                rows="4" /* Số dòng mặc định hiển thị ban đầu */
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
              ></textarea>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>



        </div>
      </div>
    </div>
  );
}

export default NewHotel
