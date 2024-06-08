import React from 'react'
import "./modifyHotel.css"
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { hotelInputs, hotelFacilities } from '../../../formSource';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

// css từ new Hotel
const ModifyHotel = () => {
    const location = useLocation();
    const idHotel = location.pathname.split("/")[3];
    const { data, loading, error } = useFetch(`/hotels/find/${idHotel}`);
    // console.log(data)
    const [files, setFiles] = useState("");
    const [info, setInfo] = useState(data);
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [customFacilities, setCustomFacilities] = useState("");
   
    const [isSending, setIsSending] = useState(false);

    // const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // const decodedToken = jwtDecode(token);
    const { user } = useContext(AuthContext) // {user._id}
    // dùng để select default type chỗ nghỉ
    const defaultType = data.type;

    const navigate = useNavigate()
    const previousPath = location.state?.previousPath;
    if (previousPath !== '/admin/hotels') {
        navigate('/admin/hotels');
    }

    useEffect(() => {
       
        if (data) {
            setInfo(data);
           // lấy facilities của hotel hiện tại cho vào các biến phù hợp
           const initialSelectedFacilities = data.facilities?.filter(facility => hotelFacilities?.includes(facility));
           const initialCustomFacilities = data.facilities?.filter(facility => !hotelFacilities?.includes(facility)).join(", ");
           setSelectedFacilities(initialSelectedFacilities);
           setCustomFacilities(initialCustomFacilities);
        }
    }, [data]);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    // chỉnh check box facilities
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
      // facilities tự nhập
      const handleCustomFacilitiesChange = (event) => {
        setCustomFacilities(event.target.value);
      };
    
    // console.log(info)

    const handleClick = async (e) => {
        setIsSending(true)
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
            
            // lấy facilities từ checkbox và người dùng nhập
            const customFacilitiesArray = customFacilities.split(',').map(item => item.trim()).filter(item => item);
            const allSelectedFacilities = [...selectedFacilities, ...customFacilitiesArray];
            const newModifyHotel = {
                ...info,
                ...(list.length > 0 && { photos: list }),// nếu người dùng có thêm ảnh vào thì set lại ảnh mới, ko thì giữ nguyên
                facilities: allSelectedFacilities
            };


            // console.log(list.length)

            const Success = await axios.put(`/hotels/${idHotel}`, newModifyHotel);
            if (Success) {
                setIsSending(false)
                toast.success('Thành công chỉnh sửa!');
                navigate("/admin/hotels");

            } else {
                toast.error("Error.Please try again");
                setIsSending(false)

            }

        } catch (err) {
            console.log(error);
        }
    };
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
                {/* lấy theo css của newHotel.css */}
                <div className="listHotelAdminContainer">
                    <div className="top">
                        <h1 style={{ fontWeight: 'bold' }}>Chỉnh sửa thông tin</h1>

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
                            <div className="right">
                                <form>
                                    <div className="formInput">
                                        <label htmlFor="file">
                                            Up ảnh (Click vào đây để thêm ảnh): <DriveFolderUploadOutlinedIcon className="icon" />
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
                                            <option value={defaultType} >{defaultType}</option> {/* Option mặc định */}
                                            <option value="Khách sạn" hidden={defaultType === "Khách sạn"}>Khách sạn</option> {/* Các option của dropdown */}
                                            <option value="Căn hộ" hidden={defaultType === "Căn hộ"}>Căn hộ</option>
                                            <option value="Biệt thự" hidden={defaultType === "Biệt thự"}>Biệt thự</option> {/* Các option của dropdown */}
                                            <option value="Resort" hidden={defaultType === "Resort"}>Resort</option>


                                        </select>
                                    </div>

                                    {/* render các trường */}
                                    {hotelInputs.map((input) => (
                                        <div className="formInput" key={input.id}>
                                            <label> {input.label} {info?.type ? info.type.toLowerCase() : "chỗ nghỉ"}</label>
                                            <input
                                                id={input.id}
                                                onChange={handleChange}
                                                type={input.type}
                                                value={info[input.id]}
                                            />
                                        </div>
                                    ))}
                                    {/* test */}
                                    <label>Mô tả chỗ nghỉ của bạn(Tối đa 1000 ký tự) </label>
                                    <textarea
                                        id="desc"
                                        rows="10" /* Số dòng mặc định hiển thị ban đầu */
                                        maxLength = "1000"
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
                                        placeholder={data.desc}
                                        value={info.desc}
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
                                                        checked={selectedFacilities?.includes(facility)}
                                                    />
                                                    {facility}
                                                </label>
                                            </div>
                                        ))}

                                        {/* tự nhập */}
                                        <div className="customFacilities">
                                            <label>Nhập cơ sở vật chất khác (ngăn cách bằng dấu phẩy): </label>
                                            <input style={{ width: "100%" }}
                                                type="text"
                                                value={customFacilities}
                                                placeholder="Ví dụ:Thuê xe đạp, Dịch vụ phòng"
                                                onChange={handleCustomFacilitiesChange}
                                            />
                                        </div>
                                    </div>



                                    <button onClick={handleClick} disabled={isSending}>
                                        {isSending ? 'Đang lưu...' : 'Lưu thông tin chỗ nghỉ'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModifyHotel
