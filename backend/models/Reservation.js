import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReservationSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    hotelId:{
        type:String,
        required:true,
    },
    // hotelName:{
    //     type:String,
    // },
    // hotelContact:{
    //     type:String,
    // },
    idOwnerHotel:{
        type:String,
    },
    roomNumbersId:{
        type: [String],
        required:true,
    },
    roomTypeIdsReserved:[
        {
            roomTypeId: {type:String},
            quantity:{type:Number},
        }
    ],
    roomsDetail:{
        type:String,
    },
    start:{
        type:Date,
        require:true,
    },
    end:{
        type:Date,
        require:true,
    },
    guest:{
        adult:Number,
        children:Number
    },
    allDatesReserve:{
        type:[Date],
        require:true,
    },
    totalPrice:{
        type:Number,
        require:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
},
{ timestamps : true }
);

export default mongoose.model("Reservation", ReservationSchema)