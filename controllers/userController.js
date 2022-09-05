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
      message: "User is not registered.",
    });
  }

  // bandingkan password secara async, jika ingin secara sync gunakan .compareSync()
  let isPasswordMatch = await bcrypt.compare(password, userData.password);

  // jika password tidak sesuai
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Wrong password.",
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
  const role = "PlayerUser";
  const picture = "https://res.cloudinary.com/project-nugie/image/upload/v1662047895/profile-2_oh6hqi.webp" // secara default, berikan role PlayerUser pada user baru

  // cari user yang sesuai dengan email
  const emailAlreadyRegistered = await user_game.findOne({
    where: { email: email }
  });

  // jika email sudah terdaftar
  if (emailAlreadyRegistered) {
    return res.status(401).json({
      message: "Email already registered.",
    });
  }

  // cari user yang sesuai dengan username
  const usernameAlready = await user_game.findOne({
    where: { username: username }
  });

  // jika username sudah terdaftar
  if (usernameAlready) {
    return res.status(402).json({
      message: "Username already registered.",
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
    picture: picture
  });

  // buat response
  return res.status(200).json({
    message: "Registration successful.",
    data: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      city: newUser.city,
      role: newUser.role,
      picture: newUser.picture
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
  .catch(() => {
    res.status(404).json({
      message: "Failed to load data."
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
      message: "User not found."
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


// update profile
const updateUser = async (req, res) => {

  const email = req.body.email;
  const city = req.body.city;

  await user_game.update({
    email: email,
    city: city
  }, {
    where: { username: req.params.username }
  });

  return res.status(200).json({
    message: "Update successful",
    data: {
      email,
      city 
    }
  });
}


module.exports = {
  login,
  register,
  showPlayers,
  getUserByName,
  updateUser
};
