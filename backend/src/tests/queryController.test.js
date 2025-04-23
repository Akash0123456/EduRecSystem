const { isBannedDomain, parseMessage, getAnswerWithSources } = require('../controllers/queryController');
const googleApiClient = require('../utils/googleApiClient');
const { scrapeMultipleUrls } = require('../utils/scrapeMultipleUrls');
const { getChatCompletion } = require('../utils/openaiApiService');
const { generateSearchQuery } = require('../utils/searchQueryGenerator');

// Mock the dependencies
jest.mock('../utils/googleApiClient');
jest.mock('../utils/scrapeMultipleUrls');
jest.mock('../utils/openaiApiService');
jest.mock('../utils/searchQueryGenerator');

describe('isBannedDomain', () => {
  test('should return true for banned domains', () => {
    expect(isBannedDomain('https://www.facebook.com/some-page')).toBe(true);
    expect(isBannedDomain('https://reddit.com/r/something')).toBe(true);
    expect(isBannedDomain('https://www.youtube.com/watch?v=123')).toBe(true);
  });

  test('should return false for non-banned domains', () => {
    expect(isBannedDomain('https://www.example.com')).toBe(false);
    expect(isBannedDomain('https://educational-site.org')).toBe(false);
    expect(isBannedDomain('https://academic-resource.edu')).toBe(false);
  });

  test('should handle invalid URLs', () => {
    expect(isBannedDomain('not-a-url')).toBe(true);
    expect(isBannedDomain('')).toBe(true);
    expect(isBannedDomain(null)).toBe(true);
  });
});

describe('parseMessage', () => {
  test('should correctly parse message with previous questions', () => {
    const message = {
      content: 'What is the capital of France?',
      previousQuestions: ['What is the population of Paris?', 'What is the Eiffel Tower?']
    };

    const result = parseMessage(message);
    expect(result).toEqual({
      previousQuestions: ['What is the population of Paris?', 'What is the Eiffel Tower?'],
      currentQuestion: 'What is the capital of France?'
    });
  });

  test('should handle message without previous questions', () => {
    const message = {
      content: 'What is the capital of France?'
    };

    const result = parseMessage(message);
    expect(result).toEqual({
      previousQuestions: [],
      currentQuestion: 'What is the capital of France?'
    });
  });

  test('should handle empty message object', () => {
    const message = {};

    const result = parseMessage(message);
    expect(result).toEqual({
      previousQuestions: [],
      currentQuestion: undefined
    });
  });
});

describe('getAnswerWithSources', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson
    };

    // Setup mock request
    mockReq = {
      body: {
        messages: [{
          role: 'user',
          content: 'What is the capital of France?',
          previousQuestions: ['What is the population of Paris?']
        }]
      }
    };

    // Setup mock implementations
    generateSearchQuery.mockResolvedValue('capital of France');
    googleApiClient.get.mockResolvedValue({
      data: {
        items: [
          { link: 'https://example.com/france', title: 'France Info' },
          { link: 'https://example.com/paris', title: 'Paris Guide' }
        ]
      }
    });
    scrapeMultipleUrls.mockResolvedValue([
      { url: 'https://example.com/france', content: 'Paris is the capital of France' },
      { url: 'https://example.com/paris', content: 'Paris is a beautiful city' }
    ]);
    getChatCompletion.mockResolvedValue({
      answer: {
        sections: [
          {
            type: 'paragraph',
            content: 'Paris is the capital of France.'
          }
        ]
      },
      sources: [
        { title: 'France Info', url: 'https://example.com/france' },
        { title: 'Paris Guide', url: 'https://example.com/paris' }
      ],
      analysisMethodology: 'Analysis based on reliable sources'
    });
  });

  test('should return 400 if no messages are provided', async () => {
    mockReq.body.messages = [];
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Request must include at least one user message."
    });
  });

  test('should return 400 if first message is not from user', async () => {
    mockReq.body.messages[0].role = 'assistant';
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: "First message must be a user query."
    });
  });

  test('should successfully process a valid request', async () => {
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      answer: expect.any(Object),
      sources: expect.any(Array),
      analysisMethodology: expect.any(String)
    }));
  });

  test('should handle errors during processing', async () => {
    googleApiClient.get.mockRejectedValue(new Error('API Error'));
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Something went wrong during search or scraping."
    });
  });

  test('should handle empty search results', async () => {
    googleApiClient.get.mockResolvedValue({
      data: {
        items: []
      }
    });
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      answer: expect.any(Object),
      sources: [],
      analysisMethodology: expect.any(String)
    }));
  });

  test('should handle failed scraping', async () => {
    scrapeMultipleUrls.mockResolvedValue([]);
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      answer: expect.any(Object),
      sources: [],
      analysisMethodology: expect.any(String)
    }));
  });

  test('should handle OpenAI API error', async () => {
    getChatCompletion.mockRejectedValue(new Error('OpenAI API Error'));
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Something went wrong during search or scraping."
    });
  });

  test('should handle search query generation error', async () => {
    generateSearchQuery.mockRejectedValue(new Error('Query Generation Error'));
    await getAnswerWithSources(mockReq, mockRes);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: "Something went wrong during search or scraping."
    });
  });

  test('should filter out banned domains from search results', async () => {
    googleApiClient.get.mockResolvedValue({
      data: {
        items: [
          { link: 'https://facebook.com/some-page', title: 'Facebook Page' },
          { link: 'https://example.com/valid', title: 'Valid Page' }
        ]
      }
    });
    await getAnswerWithSources(mockReq, mockRes);
    expect(scrapeMultipleUrls).toHaveBeenCalledWith(['https://example.com/valid'], 3, 4000);
  });
}); 