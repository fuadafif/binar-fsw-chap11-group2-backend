// import bcrypt untuk password
const bcrypt = require("bcrypt");

// import jwt
const jwt = require("jsonwebtoken");

// import models
const { user_game } = require("../models");

// baca kunci JWT dari env, jika tidak ada gunakan nilai default
const jwtKey = process.env.JWT_KEY || "secret";

const login = async (req, res) => {
  // baca username & password dari request body
  const username = req.body.username;
  const password = req.body.password;

  // cari user yang sesuai dengan email
  const userData = await user_game.findOne({
    where: { username: username }
  });

  // jika user tidak ditemukan
  if (!userData) {
    return res.status(401).json({
      message: "User tidak terdaftar.",
    });
  }

  // bandingkan password secara async, jika ingin secara sync gunakan .compareSync()
  let isPasswordMatch = await bcrypt.compare(password, userData.password);

  // jika password tidak sesuai
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Password salah.",
    });
  }

  // buat token payload
  const tokenPayload = {
    id: userData.id,
    email: userData.email,
    username: userData.username,
    city: userData.city,
    roles: userData.roles,
  };

  // buat token
  const token = jwt.sign(tokenPayload, jwtKey);

  // kirim response ke client
  return res.status(200).json({
    message: "Login successful.",
    data: {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      city: userData.city,
      roles: userData.roles,
      token: token,
    },
  });
};

const register = async (req, res) => {
  // baca email & password dari request body
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const city = req.body.city;
  const role = "PlayerUser"; // secara default, berikan role PlayerUser pada user baru

  // cari user yang sesuai dengan email
  const emailAlreadyRegistered = await user_game.findOne({
    where: { email: email }
  });

  // jika email sudah terdaftar
  if (emailAlreadyRegistered) {
    return res.status(401).json({
      message: "Email sudah terdaftar.",
    });
  }

  // cari user yang sesuai dengan username
  const usernameAlready = await user_game.findOne({
    where: { username: username }
  });

  // jika username sudah terdaftar
  if (usernameAlready) {
    return res.status(401).json({
      message: "Username sudah terdaftar.",
    });
  }

  // encrypt password
  const encryptedPassword = await bcrypt.hash(password, 10);

  // buat user baru
  const newUser = await user_game.create({
    email: email,
    username: username,
    password: encryptedPassword,
    city: city,
    role: role,
  });

  // buat response
  return res.status(200).json({
    message: "Registrasi berhasil.",
    data: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      city: newUser.city,
      role: newUser.role,
    },
  });
};

// tampilkan semua players
const showPlayers = (req, res) => {
  user_game.findAll({
    order: [
      ["id", "ASC"]
    ]
  })
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    res.status(404).json({
      message: "Gagal memuat data"
    });

  }) 
}


// menampilkan profil
const getUserByName = async (req, res) => {
  
  const userData = await user_game.findOne({
    where : { username: req.params.username }
  });

  if (!userData) {
    return res.status(404).json({
      message: "User tidak ditemukan"
    });
  }

  const userBiodata = await user_game.findAll({
    where: { username: req.params.username }
  });

  if (!userBiodata) {
    return res.status(200).json({
      data: [],
    });
  }

  return res.status(200).json(userBiodata);
}



module.exports = {
  login,
  register,
  showPlayers,
  getUserByName
};
