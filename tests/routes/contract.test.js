const request = require("supertest");
const express = require("express");
const contractController = require("../../src/controllers/contract.controller");
const contractService = require("../../src/services/contract.service");
const HttpStatus = require("../../src/constants/httpStatus");

jest.mock("../../src/services/contract.service");

// Mock the Profile model used in the middleware
const mockProfile = { id: 42 };
const mockModels = {
  Profile: {
    findOne: jest.fn().mockResolvedValue(mockProfile),
  },
};

const app = express();
app.use(express.json());
app.set("models", mockModels); // Set mock models for middleware

const { getProfile } = require("../../src/middleware/getProfile");
const router = express.Router();
router.get("/:id", getProfile, contractController.getContractById);
router.get("/", getProfile, contractController.getContractsForProfile);
app.use("/contracts", router);

describe("Contract Controller", () => {
  describe("GET /contracts/:id", () => {
    it("should return a contract if found", async () => {
      const mockContract = { id: 1, terms: "Sample contract" };
      contractService.findContractById.mockResolvedValue(mockContract);

      const res = await request(app)
        .get("/contracts/1")
        .set("profile_id", "42");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual(mockContract);
      expect(contractService.findContractById).toHaveBeenCalledWith(42, "1");
    });

    it("should return 404 if contract not found", async () => {
      contractService.findContractById.mockResolvedValue(null);

      const res = await request(app)
        .get("/contracts/123")
        .set("profile_id", "42");

      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(res.body).toEqual({ message: expect.any(String) });
    });

    it("should return 500 if service throws an error", async () => {
      contractService.findContractById.mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .get("/contracts/1")
        .set("profile_id", "42");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });
    });
  });

  describe("GET /contracts", () => {
    it("should return contracts for the profile", async () => {
      const mockContracts = [
        { id: 1, terms: "Contract A" },
        { id: 2, terms: "Contract B" },
      ];

      contractService.findContractsForProfile.mockResolvedValue(mockContracts);

      const res = await request(app).get("/contracts").set("profile_id", "42");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual(mockContracts);
      expect(contractService.findContractsForProfile).toHaveBeenCalledWith(42);
    });

    it("should return 500 if service throws an error", async () => {
      contractService.findContractsForProfile.mockRejectedValue(
        new Error("Unexpected error")
      );

      const res = await request(app).get("/contracts").set("profile_id", "42");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });
    });
  });
});
