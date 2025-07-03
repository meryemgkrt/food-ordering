import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method, query } = req;

  if (method === "GET") {
    try {
      // Email ile arama yapılıyorsa
      if (query.email) {
        console.log("🔍 Searching for user with email:", query.email);

        const user = await User.findOne({
          email: { $regex: new RegExp(`^${query.email}$`, "i") },
        }).select("-password");

        if (!user) {
          console.log("❌ User not found for email:", query.email);
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        console.log("✅ User found:", user._id);
        return res.status(200).json({
          success: true,
          user: user,
        });
      }

      // Normal tüm kullanıcıları getir
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (err) {
      console.error("❌ Error in GET users:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  if (method === "POST") {
    try {
      const newUser = await User.create(req.body);
      // Password'u response'dan kaldır
      const userResponse = { ...newUser.toObject() };
      delete userResponse.password;

      res.status(200).json({
        success: true,
        user: userResponse,
      });
    } catch (err) {
      console.error("❌ Error creating user:", err);
      res.status(500).json({
        success: false,
        message: "Error creating user",
      });
    }
  }
};

export default handler;
