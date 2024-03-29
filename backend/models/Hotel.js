import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema({
  // Phải thêm vào ID ownder
  name: {
    type: String,
    required: true,
  },
  ownerId:{
    type: String,
    required:true
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
 
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  rooms: {
    type: [String],
  },
  cheapestPrice: {
    type: Number,
    required: true,
  },
 
});

export default mongoose.model("Hotel", HotelSchema)