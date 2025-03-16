const googleApiClient = require("../utils/googleApiClient");
const { getSearchResults } = require("../controllers/googleSearchController");
const axios = require("axios");

jest.mock("../utils/googleApiClient");

describe("Google Search API Controller", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            query: {}
        };

        const jsonMock = jest.fn();
        const statusMock = jest.fn(() => ({ json: jsonMock }));
        
        res = {
          status: statusMock,
          json: jsonMock
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("expect 400 error due to missing query parameter", async () => {
        await getSearchResults(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status(400).json).toHaveBeenCalledWith({
            error: "Query parameter (query) is required"
        });
    });
});

