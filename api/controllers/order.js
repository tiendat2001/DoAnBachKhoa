import Hotel from "../models/Hotel.js";
import Order from "../models/Order.js";

export const createOrder = async (req,res,next)=>{
    const newOrder = new Order(req.body)
    
    try {
        const hotel = await Hotel.findById(
            req.body.hotelid
        );
        newOrder.hotelid = hotel.name
        newOrder.roomid = req.params.id
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (err) {
        next(err)
    }
}
export const getOrders = async (req,res,next)=>{
    try {
        const Orders = await Order.find();
        res.status(200).json(Orders)
    } catch (err) {
        next(err)
    }
}
export const getOrder = async (req,res,next)=>{
    try {
        const orderid = await Order.findById(
            req.params.id
        );
        res.status(200).json(orderid)
    } catch (err) {
        next(err)
    }
}
export const updateOrder = async (req,res,next)=>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedOrder)
    } catch (err) {
        next(err)
    }
}