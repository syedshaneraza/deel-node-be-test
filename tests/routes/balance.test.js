const request = require("supertest");
const app = require("../../src/app");
const { Profile } = require("../../src/model/index");
const Messages = require("../../src/constants/error-messages");
const HttpStatus = require("../../src/constants/httpStatus");

// Mock Sequelize models
jest.mock("../../src/model/index", () => {
  const Messages = require("../../src/constants/error-messages");

  // Mock save method (called on Profile instance)
  const mockSave = jest.fn().mockResolvedValue(true);

  const Profile = {
    findByPk: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return Promise.resolve({
          id: 1,
          balance: 100,
          save: mockSave,
        });
      }
      return Promise.resolve(null);
    }),
  };

  const Job = {
    findAll: jest.fn().mockResolvedValue([{ price: 40 }, { price: 60 }]),
  };

  const Contract = {};

  const sequelize = {
    transaction: jest.fn(() =>
      Promise.resolve({
        commit: jest.fn(),
        rollback: jest.fn(),
      })
    ),
  };

  return {
    Profile,
    Job,
    Contract,
    sequelize,
  };
});

describe("POST /deposit/:userId", () => {
  it("should return 200 and deposit if valid", async () => {
    const response = await request(app)
      .post("/balances/deposit/1")
      .send({ userId: 1, amount: 10 });

    expect(response.body).toHaveProperty("success", true);
    expect(response.body.message).toMatch(/Deposited/);
  });

  it("should fail with 500 if user mismatch", async () => {
    const response = await request(app)
      .post("/balances/deposit/1")
      .send({ userId: 2, amount: 10 });

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe(Messages.INTERNAL_ERROR);
  });
});
