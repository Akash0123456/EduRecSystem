const app = require("../index");

let server;

beforeAll(() => {
  server = app.listen(4000, () => {
    console.log("Test server running on port 4000");
  });
});

afterAll((done) => {
  server.close(done);
});

module.exports = server;
