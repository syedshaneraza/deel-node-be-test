const Messages = require("../constants/error-messages");
const HttpStatus = require("../constants/httpStatus");

const getProfile = async (req, res, next) => {
  try {
    const { Profile } = req.app.get("models");
    const profileId = req.get("profile_id");

    if (!profileId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: Messages.MISSING_PROFILE_ID,
      });
    }

    const profile = await Profile.findOne({ where: { id: profileId } });

    if (!profile) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: Messages.UNAUTHORIZED_PROFILE,
      });
    }

    req.profile = profile;
    next();
  } catch (error) {
    console.log("Error in getProfile middleware:", error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.INTERNAL_ERROR});
  }
};

module.exports = { getProfile };
