import React, { useState, useEffect } from "react";
import { useStore } from "react-redux";
import { read, diffDays, isAlreadyBooked } from "../actions/hotel";
import { getSessionId } from "../actions/stripe";
import moment from "moment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const ViewHotel = ({ match,history}) => {
     const [hotel, setHotel ] = useState({});
     const [image, setImage] = useState("");
     const [loading, setLoading] = useState(false);
     const [alreadyBooked, setAlreadyBooked] = useState(false);
     const { auth } = useSelector((state) => ({ ...state }));

     useEffect(() => { loadSellerHotel();
    } , []);

    useEffect(() => {
        if (auth && auth.token) {
            isAlreadyBooked(auth.token, match.params.hotelId).then((res) => { 
                if (res.data.ok) setAlreadyBooked(true);
      });
    }
}, []); 
 
const loadSellerHotel = async () => {
    let res = await read(match.params.hotelId);
    setHotel(res.data);
    setImage(`${process.env.REACT_APP_API}/hotel/image/${res.data._id}`);
};
