import React from 'react'
import { useContext } from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext'
import { Link } from 'react-router-dom';
import "./listHotel.css"
const ListHotel = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data, loading, error, reFetch } = useFetch(
        `/hotels?ownerId=${user._id}`);
    // console.log(data)
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="listHotelAdminContainer">
                    {loading ? (
                        "loading"
                    ) : (
                        <>
                            {data.map((item) => (
                                <div className="listHotelAdmin" key={item._id}>
                                    <img src={item.photos[0]} alt="" className="siImg" />
                                    <div className="siDesc">
                                        <h1 className="siTitle">{item.name}</h1>
                                        <span className="siDistance">Distance: {item.distance}m from center</span>
                                       
                                        <span className="siFeatures">Address: {item.address}</span>
                                    </div>
                                    <div className="siDetails">
                                        <div className="siDetailTexts">
                                            {/* <span className="siTaxOp">Cho {options.adult} người, {days} đêm</span> */}
                                            {/* <Link to={`/hotels/${item._id}`}>
                                            </Link> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>


            </div>
        </div>
    )
}

export default ListHotel
