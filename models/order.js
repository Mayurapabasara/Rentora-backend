import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId : {
            type : String,
            required: true,
            unique : true
        },

        items : {
            type : [
                {
                    porductId : {
                        type : String,
                        required: true
                    },
                    name : {
                        type : String,
                        required: true
                    },
                    quantity : {
                        type : Number,
                        required: true
                    },
                    price : {
                        type : Number,
                        required: true
                    },
                    image : {
                        type : String,
                        required: true
                    }
                }
            ]
        },
        customerName : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true
        },
        phone : {
            type: String,
            required: true
        },
        address : {
            type: String,
            required: true
        },
        total : {
            type: Number,
            required: true
        },
        status : {
            type: String,
            required: true,
            default: 'pending'
        },
        date : {
            type: Date,
            default: Date.now
        }
    }
)

const Order = mongoose.model("order", orderSchema);
export default Order;