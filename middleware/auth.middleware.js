/**
 * Kiểm tra user đã đăng nhập chưa (session có user id và role)
 */
export const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/auth/login");
  }
  req.user = req.session.user;
  next();
};

/**
 * Phân quyền theo role - chỉ cho phép các role được chỉ định
 * @param {string[]} allowedRoles - Mảng các role được phép truy cập
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.redirect("/auth/login");
    }
    const { role } = req.session.user;
    if (!allowedRoles.includes(role)) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền truy cập trang này."
      });
    }
    req.user = req.session.user;
    next();
  };
};

/**
 * Middleware gán req.user từ session (nếu có) - dùng cho các trang public
 */
export const optionalAuth = (req, res, next) => {
  if (req.session?.user) {
    req.user = req.session.user;
  }
  next();
};
