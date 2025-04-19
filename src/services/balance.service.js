const Messages = require("../constants/error-messages");
const { Profile, Job, Contract, sequelize } = require("../model");
const { Op } = require("sequelize");

const deposit = async (targetUserId, fromUserId, amount) => {
  if (targetUserId !== fromUserId) {
    throw new Error(Messages.USER_MISMATCH);
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error(Messages.INVALID_AMOUNT);
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await Profile.findByPk(fromUserId, { transaction });
    if (!user) {
      throw new Error(Messages.NOT_FOUND);
    }

    // Calculate total amount of unpaid jobs for this client (in_progress)
    const unpaidJobs = await Job.findAll({
      where: { paid: { [Op.not]: true } },
      include: {
        model: Contract,
        where: {
          ClientId: fromUserId,
          status: "in_progress",
        },
        required: true,
      },
      transaction,
    });
    const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
    const maxDeposit = totalUnpaid * 0.25;
    if (amount > maxDeposit) {
      throw new Error(Messages.DEPOSIT_LIMIT_EXCEEDED);
    }

    // Update balance
    user.balance += amount;
    await user.save({ transaction });

    await transaction.commit();

    return {
      success: true,
      message: `Deposited $${amount.toFixed(2)} successfully.`,
      newBalance: user.balance,
    };
  } catch (error) {
    console.log('error : ', error)
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  deposit,
};
