import mongoose from "mongoose";
const ClosedRoomSchema = new mongoose.Schema({
    // Phải thêm vào ID ownder

    ownerId: {
        type: String,
        required: true
    },
    roomTypeId: {
        type: String,
        required: true
    },
    quantityRoomClosed: {
        type: Number,
        required: true
    },
    startClose: {
        type: Date,
        require: true,
    },
    endClose: {
        type: Date,
        require: true,
    },
    allDatesClosed: {
        type: [Date],
        require: true,
    },


},
    { timestamps: true }
);

export default mongoose.model("ClosedRoom", ClosedRoomSchema)