const request = require("supertest");
const express = require("express");
const jobController = require("../../src/controllers/job.controller");
const jobService = require("../../src/services/job.service");
const Messages = require("../../src/constants/error-messages");
const HttpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/job.service");

const app = express();
app.use(express.json());

// Reuse your existing getProfile middleware setup
const mockProfile = { id: 1 };
const getProfile = (req, res, next) => {
  req.profile = mockProfile;
  next();
};

// Routes using your actual controller logic
const router = express.Router();
router.get("/unpaid", getProfile, jobController.getUnpaidJobs);
router.post("/:job_id/pay", getProfile, jobController.payForJob);
app.use("/jobs", router);

describe("Job Controller", () => {
  describe("GET /jobs/unpaid", () => {
    it("should return unpaid jobs for the profile", async () => {
      const mockJobs = [{ id: 1, description: "Design logo" }];
      jobService.findUnpaidJobs.mockResolvedValue(mockJobs);

      const res = await request(app).get("/jobs/unpaid");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual(mockJobs);
      expect(jobService.findUnpaidJobs).toHaveBeenCalledWith(1);
    });

    it("should return 500 on service error", async () => {
      jobService.findUnpaidJobs.mockRejectedValue(
        new Error(Messages.INTERNAL_ERROR)
      );

      const res = await request(app).get("/jobs/unpaid");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });
    });
  });

  describe("POST /jobs/:job_id/pay", () => {
    it("should pay for a job successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Payment successful. 200 has been transferred.",
      };

      jobService.payJob.mockResolvedValue(mockResponse);

      const res = await request(app).post("/jobs/123/pay");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual(mockResponse);
      expect(jobService.payJob).toHaveBeenCalledWith(1, "123");
    });

    it("should return 400 if payment fails with known error", async () => {
      jobService.payJob.mockRejectedValue(new Error("Insufficient funds"));

      const res = await request(app).post("/jobs/123/pay");

      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toBe("Insufficient funds");
    });

    it("should return generic 400 for unexpected errors", async () => {
      jobService.payJob.mockRejectedValue({});

      const res = await request(app).post("/jobs/123/pay");

      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toBeDefined();
    });
  });
});
