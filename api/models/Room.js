import mongoose from 'mongoose';
const { Schema } = mongoose;

const RoomSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    hotelId:{
        type: String,
        required:true
    },
    hotelName:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    maxPeople:{
        type: Number,
        required:true
    },
    desc:{
        type: String,
        required:true
    },
    roomNumbers:[{ number:Number, unavailableDates:{type:[Date]} }], // them status, neu unavai ko rong thi ko dc de status hủy, them id tu gen
},
{ timestamps : true }
);

export default mongoose.model("Room", RoomSchema)