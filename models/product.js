import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    altName: {
        type: [String],
        default: [],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: [],
        required: true 
    },
    price: {
        type: Number,
        required: true
    },
    labelledPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }

});

const Product = mongoose.model("Product", productSchema);
export default Product;