import Product from "@/models/Product";
import dbConnect from "@/util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;

  if (method === "GET") {
    try {
      const products = await Product.find();
      return res.status(200).json(products);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Product alırken hata oluştu" });
    }
  }

  if (method === "POST") {
    try {
      const newProduct = await Product.create(req.body);
      return res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Product oluşturulamadı", error: err });
    }
  }

  // GET veya POST dışında gelen istekleri engelle
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
