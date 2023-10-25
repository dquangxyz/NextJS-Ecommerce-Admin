import mongoose, {model, models, Schema} from "mongoose";

export const CategorySchema = new Schema({
  name: {type:String,required:true},
  parentCategory: {type:mongoose.Types.ObjectId, ref: 'Category'}
});

export const Category = models?.Category || model('Category', CategorySchema);