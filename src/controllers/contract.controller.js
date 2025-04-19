const Messages = require("../constants/error-messages");
const HttpStatus = require("../constants/httpStatus");
const contractsService = require("../services/contract.service");

const getContractById = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const contract = await contractsService.findContractById(
      profileId,
      req.params.id
    );
    if (!contract) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: Messages.NOT_FOUND });
    }
    return res.status(HttpStatus.OK).json(contract);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: Messages.INTERNAL_ERROR,
    });
  }
};

const getContractsForProfile = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const contracts = await contractsService.findContractsForProfile(profileId);

    return res.status(HttpStatus.OK).json(contracts);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: Messages.INTERNAL_ERROR,
    });
  }
};

module.exports = {
  getContractById,
  getContractsForProfile,
};
