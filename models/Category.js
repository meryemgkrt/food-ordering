import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 60},
    /* image: { type: String, required: true }, */
   
  },
 
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
