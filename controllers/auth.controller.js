import User from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Hiển thị form đăng nhập
 */
export const showLoginForm = (req, res) => {
  if (req.session?.user) {
    return res.redirect("/bookings");
  }
  res.render("auth/login", { error: null });
};

/**
 * Xử lý đăng nhập - check email + password, lưu id + role vào session
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/login", {
        error: "Vui lòng nhập email và mật khẩu."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.render("auth/login", {
        error: "Email hoặc mật khẩu không đúng."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("auth/login", {
        error: "Email hoặc mật khẩu không đúng."
      });
    }

    // Lưu id và role vào session để phân quyền
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect("/bookings");
  } catch (err) {
    res.render("auth/login", {
      error: err.message || "Đăng nhập thất bại."
    });
  }
};

/**
 * Đăng xuất
 */
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/bookings");
    }
    res.redirect("/auth/login");
  });
};
