const mongoose = require("mongoose");

const { Schema } = mongoose;

const productsSchema = new Schema({
    pname: {
        type: String,
    },
    Price: {
        type: Number,
    },
    Description: {
        type: String,
    },
    category: {
        type: String,
    },
    Image: {
        type: String,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productsSchema);

module.exports = Product;
