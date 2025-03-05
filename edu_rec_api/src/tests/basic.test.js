const request = require("supertest");
const app = require("../index");

describe("Basic API Tests", () => {
  it("should return 200 OK for the homepage", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Hello, World!");
  });
});
