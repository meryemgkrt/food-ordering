import Footer from "../../../models/Footer";
import dbConnect from "../../../util/dbConnect"; // 3 seviye üst!

const handler = async (req, res) => {
  await dbConnect();
  const {
    method,
    query: { id },
  } = req;

  if (method === "GET") {
    try {
      const footer = await Footer.findById(id);
      if (!footer) {
        return res.status(404).json({ error: "Footer not found" });
      }
      res.status(200).json(footer);
    } catch (err) {
      console.error("GET Error:", err);
      res.status(500).json({ error: "Failed to fetch footer" });
    }
  }

  if (method === "PUT") {
    try {
      const footer = await Footer.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true, // Schema validasyonlarını çalıştır
      });
      if (!footer) {
        return res.status(404).json({ error: "Footer not found" });
      }
      res.status(200).json(footer);
    } catch (err) {
      console.error("PUT Error:", err);
      res.status(400).json({ error: err.message });
    }
  }

  if (method === "DELETE") {
    try {
      const footer = await Footer.findByIdAndDelete(id);
      if (!footer) {
        return res.status(404).json({ error: "Footer not found" });
      }
      res.status(200).json({ message: "Footer deleted successfully" });
    } catch (err) {
      console.error("DELETE Error:", err);
      res.status(500).json({ error: "Failed to delete footer" });
    }
  }

  // Desteklenmeyen method
  if (!["GET", "PUT", "DELETE"].includes(method)) {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${method} not allowed` });
  }
};

export default handler;
