const jobService = require("../services/job.service");
const HttpStatus = require("../constants/httpStatus");
const Messages = require("../constants/error-messages");

const getUnpaidJobs = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const jobs = await jobService.findUnpaidJobs(profileId);

    return res.status(HttpStatus.OK).json(jobs);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: Messages.INTERNAL_ERROR,
    });
  }
};

const payForJob = async (req, res) => {
  try {
    const profileId = req.profile.id;
    const jobId = req.params.job_id;

    const result = await jobService.payJob(profileId, jobId);

    return res.status(HttpStatus.OK).json(result);
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message || Messages.BAD_REQUEST,
    });
  }
};

module.exports = {
  getUnpaidJobs,
  payForJob,
};
