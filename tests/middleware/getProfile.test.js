const { getProfile } = require("../../src/middleware/getProfile");
const Messages = require("../../src/constants/error-messages");
const HttpStatus = require("../../src/constants/httpStatus");

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getProfile middleware", () => {
  const mockModels = {
    Profile: {
      findOne: jest.fn(),
    },
  };

  const mockApp = {
    get: jest.fn(() => mockModels),
  };

  const mockReq = {
    get: jest.fn(),
    app: mockApp,
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if profile_id is missing", async () => {
    const req = { ...mockReq, get: jest.fn(() => undefined) };
    const res = createMockResponse();

    await getProfile(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      message: Messages.MISSING_PROFILE_ID,
    });
  });

  it("should return 401 if profile not found", async () => {
    const req = { ...mockReq, get: jest.fn(() => 1) };
    const res = createMockResponse();
    mockModels.Profile.findOne.mockResolvedValue(null);

    await getProfile(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      message: Messages.UNAUTHORIZED_PROFILE,
    });
  });

  it("should call next if profile is found", async () => {
    const req = { ...mockReq, get: jest.fn(() => 1) };
    const res = createMockResponse();
    const fakeProfile = { id: 1, name: "John" };
    mockModels.Profile.findOne.mockResolvedValue(fakeProfile);

    await getProfile(req, res, mockNext);

    expect(req.profile).toEqual(fakeProfile);
    expect(mockNext).toHaveBeenCalled();
  });
});
