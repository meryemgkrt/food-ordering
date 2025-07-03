import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  // Sadece POST methoduna izin ver
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await dbConnect();

    const { fullName, email, password, confirmPassword } = req.body;

    // Input validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Lütfen tüm alanları doldurun",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Geçerli bir email adresi girin",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Şifre en az 6 karakter olmalıdır",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Şifreler eşleşmiyor",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      // confirmPassword'u veritabanına kaydetmeyin
    });

    await newUser.save();

    // Response'da password'u gösterme
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    console.log("✅ New user created:", userResponse._id);

    res.status(201).json({
      success: true,
      message: "Hesap başarıyla oluşturuldu",
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bu email adresi zaten kullanılıyor",
      });
    }

    // Validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Girilen bilgiler geçersiz",
        errors: errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin",
    });
  }
};

export default handler;
