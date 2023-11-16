import mongoose, { Schema, model, models } from 'mongoose'

export const ProductSchema =  new Schema ({
    title: { type: String, required: true },
    description: String,
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true},
    images: [String],
});

export const Product = models.Product || model('Product', ProductSchema);