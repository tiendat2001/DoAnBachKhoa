import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReservationSchema = new mongoose.Schema({
    username:{
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
    idOwnerHotel:{
        type:String,
    },
    roomNumbersId:{
        type: [String],
        required:true,
    },
    start:{
        type:Date,
        require:true,
    },
    end:{
        type:Date,
        require:true,
    },
    totalDay:{
        type:Number,
        require:true,
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