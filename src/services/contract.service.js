const { Contract } = require("../model/index");
const { Op } = require("sequelize");

const findContractById = async (profileId, contractId) => {
  return await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
};

const findContractsForProfile = async (profileId) => {
  return await Contract.findAll({
    where: {
      status: { [Op.ne]: "terminated" },
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
};

module.exports = {
  findContractById,
  findContractsForProfile,
};
