import React from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./home.css";
import PropertyList from "../../components/propertyList/PropertyList";
import RecentSeenHotel from "../../components/recentSeenHotel/RecentSeenHotel";
import MailList from "../../components/MailList/MailList";
import Footer from "../../components/footer/Footer";
const Home = () => {
  return (
    <>
      <Navbar></Navbar>
      <Header></Header>
      <div className="homeContainer">
        {/* phân loại khách sạn theo địa điểm FEATURED */} 
        <h1 className="homeTitle">Nơi có nhiều chỗ nghỉ</h1>
        <Featured />

        <h1 className="homeTitle">Gợi ý cho bạn</h1>
        <RecentSeenHotel />
        
        {/* phân loại các khách sạn theo loai như hotel, homestay */}
          <h1 className="homeTitle">Browse by type</h1>
          <PropertyList />

     
        
          
          {/* phần thanh gửi mail */}
          <MailList />
          <Footer />

      </div>
    </>
  );
};

export default Home;
