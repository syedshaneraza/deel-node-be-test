const request = require("supertest");
const app = require("../../src/app");
const adminService = require("../../src/services/admin.service")
const HttpStatus = require("../../src/constants/httpStatus");

describe("Admin Controller - Best APIs", () => {
  describe("GET /best-profession", () => {
    it("should return the best profession", async () => {
      adminService.findBestProfession.mockResolvedValue("Engineer");

      const res = await request(app).get("/best-profession");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ profession: "Engineer" });
      expect(adminService.findBestProfession).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      adminService.findBestProfession.mockRejectedValue(
        new Error("Something broke")
      );

      const res = await request(app).get("/best-profession");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });
    });
  });

  describe("GET /best-clients", () => {
    it("should return the best clients", async () => {
      const mockClients = [
        { id: 1, fullName: "Client A", paid: 500 },
        { id: 2, fullName: "Client B", paid: 300 },
      ];

      adminService.findBestClients.mockResolvedValue(mockClients);

      const res = await request(app).get("/best-clients");

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.body).toEqual({ clients: mockClients });
      expect(adminService.findBestClients).toHaveBeenCalled();
    });

    it("should handle errors and return 500", async () => {
      adminService.findBestClients.mockRejectedValue(new Error("DB failure"));

      const res = await request(app).get("/best-clients");

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).toEqual({ message: expect.any(String) });
    });
  });
});
