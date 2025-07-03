import cookie from "cookie";

const handler = (req, res) => {
  const { method } = req;

  if (method !== "POST" && method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    if (method === "POST") {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      if (
        username === process.env.ADMIN_NAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", process.env.ADMIN_TOKEN, {
            maxAge: 60 * 60,
            sameSite: "strict",
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
        );
        return res
          .status(200)
          .json({ success: true, message: "Login successful" });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    }

    if (method === "PUT") {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", "", {
          maxAge: -1,
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
      );
      return res
        .status(200)
        .json({ success: true, message: "Logout successful" });
    }
  } catch (error) {
    console.error("Admin handler error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default handler;
