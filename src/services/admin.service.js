const { Job, Contract, Profile } = require("../model");
const { Op } = require("sequelize");

const findBestProfession = async ({ start, end }) => {
  const startDate = start ? new Date(start) : new Date("1900-01-01");
  const endDate = end ? new Date(end) : new Date();

  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
    include: {
      model: Contract,
      include: [
        { model: Profile, as: "Contractor", attributes: ["profession"] },
      ],
    },
  });

  const professionEarnings = {};

  for (const job of jobs) {
    const profession = job.Contract.Contractor.profession;
    professionEarnings[profession] =
      (professionEarnings[profession] || 0) + parseFloat(job.price);
  }

  // Sort and return the profession with the highest earnings
  const bestProfession =
    Object.entries(professionEarnings).sort((a, b) => b[1] - a[1])?.[0]?.[0] ||
    null;

  return bestProfession;
};

const findBestClients = async ({ start, end, limit = 2 }) => {
  const startDate = start ? new Date(start) : new Date("1900-01-01");
  const endDate = end ? new Date(end) : new Date();
  const maxClients = parseInt(limit, 10) || 2;

  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
    include: {
      model: Contract,
      include: [
        {
          model: Profile,
          as: "Client",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    },
  });

  const clientPayments = {};

  for (const job of jobs) {
    const client = job.Contract.Client;
    if (!client) continue;

    const id = client.id;
    if (!clientPayments[id]) {
      clientPayments[id] = {
        id,
        fullName: `${client.firstName} ${client.lastName}`,
        paid: 0,
      };
    }
    clientPayments[id].paid += parseFloat(job.price);
  }

  return Object.values(clientPayments)
    .sort((a, b) => b.paid - a.paid)
    .slice(0, maxClients);
};

module.exports = {
  findBestProfession,
  findBestClients,
};
