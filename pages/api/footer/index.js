// pages/api/footer/index.js
import Footer from "../../../models/Footer";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  console.log("Footer API çağrıldı - Method:", req.method);

  try {
    await dbConnect();
    console.log("DB bağlantısı kuruldu");

    const { method } = req;

    if (method === "GET") {
      try {
        console.log("Footer.find() çağrılıyor...");
        const footers = await Footer.find();
        console.log("Bulunan footer sayısı:", footers.length);

        if (footers.length === 0) {
          console.log("⚠️ No footer data found, creating default footer");

          // Default footer verisi oluştur
          const defaultFooter = new Footer({
            location: "1234 Restaurant Street, Food City, Country",
            email: "info@restaurant.com",
            phoneNumber: "555-0123",
            desc: "We are committed to providing the finest dining experience with fresh ingredients and exceptional service. Our passion for great food brings people together.",
            socialMedia: [
              {
                icon: "fab fa-facebook-f",
                link: "https://facebook.com/restaurant",
              },
              {
                icon: "fab fa-twitter",
                link: "https://twitter.com/restaurant",
              },
              {
                icon: "fab fa-instagram",
                link: "https://instagram.com/restaurant",
              },
              {
                icon: "fab fa-linkedin",
                link: "https://linkedin.com/company/restaurant",
              },
              {
                icon: "fab fa-youtube",
                link: "https://youtube.com/restaurant",
              },
              { icon: "fab fa-whatsapp", link: "https://wa.me/5550123" },
            ],
            openingHours: {
              day: "Monday - Sunday",
              hour: "10:00 AM - 11:00 PM",
            },
          });

          await defaultFooter.save();
          console.log("✅ Default footer created");

          return res.status(200).json([defaultFooter]);
        }

        console.log("✅ Footer data retrieved successfully");
        res.status(200).json(footers);
      } catch (err) {
        console.error("❌ GET Error:", err);
        res.status(500).json({
          success: false,
          error: "Failed to fetch footer data",
          message: err.message,
        });
      }
    } else if (method === "POST") {
      try {
        console.log("POST Body:", req.body);

        // Input validation
        const { location, email, phoneNumber, desc } = req.body;

        if (!location || !email || !phoneNumber || !desc) {
          return res.status(400).json({
            success: false,
            error: "Missing required fields",
            required: ["location", "email", "phoneNumber", "desc"],
          });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            error: "Invalid email format",
          });
        }

        const newFooter = await Footer.create(req.body);
        console.log("✅ Footer created successfully:", newFooter._id);

        res.status(201).json({
          success: true,
          data: newFooter,
          message: "Footer created successfully",
        });
      } catch (err) {
        console.error("❌ POST Error:", err);

        // Handle specific MongoDB errors
        if (err.code === 11000) {
          return res.status(400).json({
            success: false,
            error: "Duplicate entry",
            message: "Footer with this data already exists",
          });
        }

        if (err.name === "ValidationError") {
          const errors = Object.values(err.errors).map((e) => e.message);
          return res.status(400).json({
            success: false,
            error: "Validation failed",
            details: errors,
          });
        }

        res.status(400).json({
          success: false,
          error: "Failed to create footer",
          message: err.message,
        });
      }
    } else {
      // Method not allowed
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`,
        allowedMethods: ["GET", "POST"],
      });
    }
  } catch (dbError) {
    console.error("❌ Database connection error:", dbError);
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      message: "Unable to connect to database",
    });
  }
};

export default handler;
