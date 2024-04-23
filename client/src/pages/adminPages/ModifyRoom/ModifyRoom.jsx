import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext ,} from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { roomInputs } from '../../../formSource';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const ModifyRoom = () => {
    const location = useLocation();
    const idRoom = location.pathname.split("/")[3];
    const { data, loading, error } = useFetch(`/rooms/find/${idRoom}`);
    const [files, setFiles] = useState("");
    const [info, setInfo] = useState(data);
    const { user } = useContext(AuthContext) // {user._id}
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (data) {
          setInfo(data);
        }
      }, [data]);
    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
      };

      // khi người dùng submit
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
    
       
            const newModifyRoom = {
              ...info,
              ...(list.length > 0 && { photos: list }), // nếu người dùng có thêm ảnh vào thì set lại ảnh mới, ko thì giữ nguyên
              ownerId: user._id
            };
          
            
            // console.log(list.length)
    
            const Success = await axios.put(`/rooms/${idRoom}`, newModifyRoom);
            if (Success) {
              toast.success('Thành công chỉnh sửa!');
              navigate(`/admin/rooms`);
    
            } else toast.error("Error.Please try again");
    
    
         
    
    
        } catch (err) {
          console.log(error);
        }
      };

    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />
                {/* css từ newHotel.css */}
                <div className="top">
                    <h1>Chỉnh sửa loại phòng</h1>
                    <h3 style={{ fontSize: '14px', color: '#ccc'}}>(Điền vào trường cần sửa thông tin)</h3>
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
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={data[input.id]}
                                        value={info[input.id]}
                                    />
                                </div>
                            ))}
                            {/* test */}
                            <label>Mô tả phòng</label>
                            <textarea
                                id="desc"
                                rows="4" /* Số dòng mặc định hiển thị ban đầu */
                                onChange={handleChange}
                                placeholder={data.desc }
                                value={info.desc}
                                style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
                            ></textarea>
                            
                            <button onClick={handleClick} disabled={isSending}>
                                {isSending ? 'Sending...' : 'Lưu thông tin loại phòng'}
                            </button>            
                            </form>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default ModifyRoom
