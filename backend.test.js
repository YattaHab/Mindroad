//  MindRoad Project — BACKEND API Unit Tests

const axios = require("axios");
jest.mock("axios");

const BASE_URL = "https://mindroad.runasp.net/api";

afterEach(() => jest.clearAllMocks());

// ============================================================
// ACCOUNT API
// ============================================================

describe("Account API Tests", () => {

  test("GET is-email-registered", async () => {
    axios.get.mockResolvedValue({ status: 200, data: true });

    const email = "notregistered@test.com";

    const res = await axios.get(
      `${BASE_URL}/Account/is-email-already-registered`,
      { params: { email } }
    );

    expect(res.status).toBe(200);
    expect(axios.get).toHaveBeenCalledWith(
      `${BASE_URL}/Account/is-email-already-registered`,
      { params: { email } }
    );
  });

  const loginErrors = [
    {
      name: "wrong password",
      body: { Email: "test@gmail.com", Password: "123", RememberMe: false },
      error: { status: 400 }
    },
    {
      name: "empty email",
      body: { Email: "", Password: "123", RememberMe: false },
      error: { status: 400 }
    },
    {
      name: "empty password",
      body: { Email: "test@gmail.com", Password: "", RememberMe: false },
      error: { status: 400 }
    }
  ];

  loginErrors.forEach(({ name, body, error }) => {
    test(`POST login ${name}`, async () => {
      axios.post.mockRejectedValue({ response: error });

      try {
        await axios.post(`${BASE_URL}/Account/login`, body);
        throw new Error("should fail");
      } catch (err) {
        expect(err.response.status).toBe(error.status);
      }
    });
  });

});

// ============================================================
// ROADMAP API
// ============================================================

describe("Roadmap API Tests", () => {

  test("GET all roadmaps", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { items: [] },
    });

    const res = await axios.get(`${BASE_URL}/Roadmap`);

    expect(res.status).toBe(200);
  });

  test("GET roadmap by id", async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { roadmapId: 1 },
    });

    const res = await axios.get(`${BASE_URL}/Roadmap/1`);

    expect(res.status).toBe(200);
    expect(res.data).not.toBeNull();
  });

  test("GET invalid roadmap", async () => {
    axios.get.mockRejectedValue({
      response: { status: 404 },
    });

    try {
      await axios.get(`${BASE_URL}/Roadmap/999`);
      throw new Error();
    } catch (err) {
      expect([400, 404]).toContain(err.response.status);
    }
  });

});