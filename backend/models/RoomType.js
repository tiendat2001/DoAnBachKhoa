import mongoose from 'mongoose';
const { Schema } = mongoose;

const RoomTypeSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    hotelId:{
        type: String,
        required:true
    },
 
    price:{
        type: Number,
        required:true
    },
    photos: {
        type: [String],
      },
    maxPeople:{
        type: Number, // 2 tre em = 1 ng lon
        required:true
    },
    desc:{
        type: String,
        required:true
    },
    roomNumbers:[
        {   
            // number:Number, 
            unavailableDates:{type:[Date]},
            status:{type: Boolean, default:true},
            unavailableRangeDates:
            [
                {
                    startDateRange: {type:Date},
                    endDateRange: {type:Date}
                }
            ]
        }
                ], // them status, neu unavai ko rong thi ko dc de status hủy, them id tu gen
},
{ timestamps : true }
);

export default mongoose.model("RoomType", RoomTypeSchema)