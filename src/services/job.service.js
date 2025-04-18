const { Job, Contract, Profile } = require("../model/index");
const { Op, Error } = require("sequelize");
const Messages = require("../constants/error-messages");

const findUnpaidJobs = async (profileId) => {
  return await Job.findAll({
    where: { paid: false },
    include: {
      model: Contract,
      required: true,
      where: {
        status: "in_progress",
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      },
    },
  });
};

const payJob = async (clientId, jobId) => {
  const transaction = await sequelize.transaction(); // using transactions for atomicity
  try {
    const job = await Job.findOne({
      where: {
        id: jobId,
        paid: { [Op.not]: true },
      },
      include: {
        model: Contract,
        where: { ClientId: clientId, status: "in_progress" },
        required: true,
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!job) {
      throw new Error(Messages.JOB_NOT_FOUND);
    }

    const contractorId = job.Contract.ContractorId;
    const amount = job.price;

    const client = await Profile.findOne({
      where: { id: clientId },
      transaction,
    });
    if (client.balance < amount) {
      throw new Error(Messages.INSUFFICIENT_FUNDS);
    }

    const [clientUpdated] = await Profile.update(
      {
        balance: sequelize.literal(`balance - ${amount}`),
      },
      {
        where: { id: clientId },
        transaction,
      }
    );

    if (!clientUpdated) throw new Error(Messages.LOCK_CONFLICT);

    const [contractorUpdated] = await Profile.update(
      {
        balance: sequelize.literal(`balance + ${amount}`),
      },
      {
        where: { id: contractorId },
        transaction,
      }
    );

    if (!contractorUpdated) throw new Error(Messages.LOCK_CONFLICT);

    await Job.update(
      {
        paid: true,
        paymentDate: new Date(),
      },
      {
        where: { id: jobId },
        transaction,
      }
    );
    // transaction complete
    await transaction.commit();

    return {
      success: true,
      message: `${Messages.PAYMENT_SUCCESS}. ${amount} has been transferred.`,
    };
  } catch (err) {
    // On any error, we will rollback the transaction to avoid partial updates
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  findUnpaidJobs,
  payJob,
};
