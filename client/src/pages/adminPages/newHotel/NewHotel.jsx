import React from 'react'
import "./newHotel.css"
import axios from "axios";
import useFetch from '../../../hooks/useFetch';
import { useState, useContext } from "react";
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { hotelInputs, hotelFacilities } from '../../../formSource';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [customFacilities, setCustomFacilities] = useState("");
  const handleCustomFacilitiesChange = (event) => {
    setCustomFacilities(event.target.value);
  };
  // const [rooms, setRooms] = useState([]);
  // const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  // const decodedToken = jwtDecode(token);
  const { user } = useContext(AuthContext) // {user._id}
  const navigate = useNavigate()

  const { data, loading, error } = useFetch("/rooms");

  // xử lý khi submit form
  const [isSending, setIsSending] = useState(false);


  // validate
  const validateInputs = () => {
    // Check if all hotelInputs are filled
    for (let input of hotelInputs) {
      if (!document.getElementById(input.id).value || !document.getElementById("type").value) {
        return false;
      }
    }
    // Check if description is filled
    if (!document.getElementById("desc").value.trim() ||(!customFacilities && selectedFacilities.length ==0)
    || (files.length === 0)) {//|| (files.length === 0) sau thêm cái này vào lúc triển khai
      return false;
    }
    return true;
  };

  // khi ng dùng nhập thông tin
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value, }));

  };
  // facilities người dùng tích
  const handleCheckboxChange = (facility) => {
    setSelectedFacilities((prevSelected) => {
      // nếu người dùng tích cái đã có - tức bỏ nó đi thì bỏ nó khỏi mảng
      if (prevSelected.includes(facility)) {
        return prevSelected.filter((item) => item !== facility);
      } else {
        return [...prevSelected, facility];
      }
    });
  };

  // console.log(selectedFacilities)
  // khi ng dùng submit
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
        const customFacilitiesArray = customFacilities.split(',').map(item => item.trim()).filter(item => item);
        const allSelectedFacilities = [...selectedFacilities, ...customFacilitiesArray];
        const newhotel = {
          ...info,
          photos: list,
          facilities: allSelectedFacilities
          // ownerId: decodedToken.id
        };

        const Success = await axios.post("/hotels", newhotel);
        if (Success) {
          toast.success('Thành công!');
          navigate("/admin/hotels");

        } else toast.error("Error.Please try again");


      }


    } catch (err) {
      console.log(error);
    } finally {
      setIsSending(false); // Kết thúc xử lý, trả lại trạng thái ban đầu cho nút
    }
  };
  return (
    // lấy css từ ListHotel.css
    <div className="listAdmin">
      <Sidebar />
      <div className="listContainerAdmin">
        <NavbarAdmin />
        <div className="top">
          <h1>Thêm chỗ nghỉ</h1>
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
                  Up ảnh: (Click vào đây để thêm ảnh) <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles([...e.target.files])}
                  style={{ display: "none" }}
                />
              </div>

              <div className="formInput" key='type'>
                <label>Chọn loại chỗ nghỉ</label>
                <select
                  id='type'
                  onChange={handleChange}
                  value={info.type}
                >
                  <option value="" >Chọn loại chỗ nghỉ</option> {/* Các option của dropdown */}
                  <option value="Khách sạn" >Khách sạn</option> {/* Các option của dropdown */}
                  <option value="Căn hộ" >Căn hộ</option>

                </select>
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
              <label>Mô tả chỗ nghỉ của bạn (Tối đa 1000 ký tự) </label>
              <textarea
                id="desc"
                rows="10" /* Số dòng mặc định hiển thị ban đầu */
                maxLength = "1000"
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
              ></textarea>


              <div className="hotelFacilities">
                <div style={{ marginBottom: '10px' }}>Cơ sở vật chất chỗ nghỉ </div>
                {hotelFacilities.map((facility) => (
                  <div style={{ marginBottom: "10px" }} key={facility}>
                    <label>
                      <input
                        type="checkbox"
                        value={facility}
                        onChange={() => handleCheckboxChange(facility)}
                        checked={selectedFacilities.includes(facility)}
                      />
                      {facility}
                    </label>
                  </div>
                ))}

                {/* tự nhập */}
                <div className="customFacilities">
                  <label>Nhập cơ sở vật chất khác (ngăn cách bằng dấu phẩy): </label>
                  <input style={{width:"100%"}}
                    type="text"
                    value={customFacilities}
                    placeholder="Ví dụ:Thuê xe đạp, Dịch vụ phòng"
                    onChange={handleCustomFacilitiesChange}
                  />
                </div>
              </div>

              <button onClick={handleClick} disabled={isSending}>
                {isSending ? 'Đang lưu...' : 'Đăng chỗ nghỉ'}
              </button>
            </form>
          </div>



        </div>
      </div>
    </div>
  );
}

export default NewHotel
