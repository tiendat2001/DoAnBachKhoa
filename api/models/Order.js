import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    hotelid:{
        type:String,
        required:true,
    },
    roomid:{
        type:String,
        required:true,
    },
    roomNumbers:{ 
        type:Number,
        require:true,
    },
    start:{
        type:Date,
        require:true,
    },
    end:{
        type:Date,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    status:{
        type:Boolean,
        default:false,
    },
},
{ timestamps : true }
);

export default mongoose.model("Order", OrderSchema)