const request = require("supertest");
const app = require("../../src/app");
const HttpStatus = require("../../src/constants/httpStatus");

const adminService = require("../../src/services/admin.service");

describe("Admin Controller - APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /best-profession", () => {
    it("should return the best profession using real logic", async () => {
      const res = await request(app).get("/admin/best-profession");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty("profession");
    });

    it("should handle errors and return 500", async () => {
      const originalFn = adminService.findBestProfession;
      adminService.findBestProfession = jest
        .fn()
        .mockRejectedValue(new Error("Fail"));

      const res = await request(app).get("/admin/best-profession");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });

      adminService.findBestProfession = originalFn;
    });
  });

  describe("GET /best-clients", () => {
    it("should return the best clients using real logic", async () => {
      const res = await request(app).get("/admin/best-clients");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty("clients");
      expect(Array.isArray(res.body.clients)).toBe(true);
    });

    it("should handle errors and return 500", async () => {
      const originalFn = adminService.findBestClients;

      adminService.findBestClients = jest
        .fn()
        .mockRejectedValue(new Error("DB failure"));

      const res = await request(app).get("/admin/best-clients");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });

      adminService.findBestClients = originalFn;
    });
  });
});
