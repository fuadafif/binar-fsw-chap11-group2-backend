// import jwt
const jwt = require("jsonwebtoken");

// import models
const { users } = require("../models");

// baca kunci JWT dari env, jika tidak ada gunakan nilai default
const jwtKey = process.env.JWT_KEY || "secret";

// middleware verifikasi & ambil data user dari token jwt
// akan dipasang di route yang ingin di proteksi
const jwtAuthorization = async (req, res, next) => {
  // baca token dari header dengan nama 'Authorization'
  const token = req.headers["authorization"];

  // jika tidak ada token, beri response error
  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  // jika ada token
  try {
    // coba validasi & baca payload
    const decoded = jwt.verify(token, jwtKey);

    // jika cocok, ambil id dari payload
    const userId = decoded.id;

    // cari user di tabel, memastikan data user yang dioper ke controller up-to-date dengan data di database
    const userData = await users.findByPk(userId);

    // jika tidak ada user, beri response error
    if (!userData) {
      return res.status(401).json({
        message: "User tidak ditemukan",
      });
    }

    // jika ada, simpan user ke request object
    req.user = userData;

    next();
  } catch (err) {
    // jika tidak cocok, beri response error
    return res.status(401).json({
      message: "Token tidak valid",
    });
  }
};

module.exports = {
  jwtAuthorization,
};
