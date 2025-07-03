// pages/api/categories.js
import Category from "@/models/Category";
import dbConnect from "@/util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;

  if (method === "GET") {
    try {
      const categories = await Category.find();
      return res.status(200).json(categories);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Kategoriler alınırken hata oluştu" });
    }
  }

  if (method === "POST") {
    try {
      // Kategorinin zaten var olup olmadığını kontrol et
      const existingCategory = await Category.findOne({
        title: req.body.title,
      });

      if (existingCategory) {
        return res.status(400).json({ message: "Bu kategori zaten mevcut" });
      }

      const newCategory = await Category.create(req.body);
      return res.status(201).json(newCategory);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Kategori oluşturulamadı", error: err });
    }
  }

  if (method === "DELETE") {
    try {
      const deletedCategory = await Category.findOneAndDelete({
        title: req.body.title,
      });

      if (!deletedCategory) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }

      return res.status(200).json(deletedCategory);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Kategori silinemedi", error: err });
    }
  }

  // GET, POST, DELETE dışında gelen istekleri engelle
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
