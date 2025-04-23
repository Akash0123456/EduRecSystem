const { isBannedDomain } = require('../controllers/queryController');

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