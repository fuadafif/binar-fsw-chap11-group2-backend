// import cloudinary uploader
const cloud = require('../cloud/cloudinary');
const { user_game } = require("../models");

// fungsi menambah file
const uploadFile = async (req, res) => {
  // baca dari files, jika tidak ada, beri nilai []
  const file = req.files || [];

  // upload foto
  let fileURL = '';
  if (file.length) {
    try {
      fileURL = await cloud.upload(file[0]); // hanya upload 1 file
      await user_game.update({
        picture: fileURL
      }, {
        where: { username: req.params.username }
      });
    } catch (err) {
      return res.status(500).json({
        message: 'Something wrong.',
      });
    }
  }

  // berikan response sukses
  return res.status(201).json({
    message: 'Successfully added image.',
    url: fileURL,
  });
};

module.exports = {
  uploadFile,
};
