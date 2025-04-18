const adminService = require("../services/admin.service");
const Messages = require("../constants/error-messages");
const HttpStatus = require("../constants/httpStatus");

const getBestProfession = async (req, res) => {
  try {
    const profession = await adminService.findBestProfession(req.query);
    res.status(HttpStatus.OK).json({ profession });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: Messages.INTERNAL_ERROR,
    });
  }
};

const getBestClients = async (req, res) => {
  try {
    const clients = await adminService.findBestClients(req.query);
    res.status(HttpStatus.OK).json({ clients });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: Messages.INTERNAL_ERROR,
    });
  }
};

module.exports = {
  getBestProfession,
  getBestClients,
};
