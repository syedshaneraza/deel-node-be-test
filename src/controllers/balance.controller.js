const balancesService = require("../services/balance.service");
const HttpStatus = require("../constants/httpStatus");
const Messages = require("../constants/error-messages");

const depositBalance = async (req, res) => {
  const { userId: paramUserId } = req.params;
  const { userId: bodyUserId, amount } = req.body;

  try {
    const result = await balancesService.deposit(
      +paramUserId,
      +bodyUserId,
      parseFloat(amount)
    );
    return res.status(HttpStatus.OK).json(result);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: Messages.INTERNAL_ERROR,
    });
  }
};

module.exports = {
  depositBalance,
};
