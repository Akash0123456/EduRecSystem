module.exports = {
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "../coverage",
    roots: ["../src/tests/"],
    setupFilesAfterEnv: ["../src/tests/setupTests.js"] 
  };