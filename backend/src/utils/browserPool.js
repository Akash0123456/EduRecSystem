const { chromium } = require('playwright');

class BrowserPool {
  constructor(maxBrowsers = 3) {
    this.maxBrowsers = maxBrowsers;
    this.browsers = [];
    this.availableBrowsers = [];
    this.pendingRequests = [];
  }

  async initialize() {
    // Initialize the pool with browser instances
    for (let i = 0; i < this.maxBrowsers; i++) {
      const browser = await chromium.launch({ headless: true });
      this.browsers.push(browser);
      this.availableBrowsers.push(browser);
    }
  }

  async acquire() {
    if (this.availableBrowsers.length > 0) {
      return this.availableBrowsers.pop();
    }

    // If no browsers are available, wait for one to become available
    return new Promise((resolve) => {
      this.pendingRequests.push(resolve);
    });
  }

  release(browser) {
    if (this.pendingRequests.length > 0) {
      const resolve = this.pendingRequests.shift();
      resolve(browser);
    } else {
      this.availableBrowsers.push(browser);
    }
  }

  async close() {
    // Close all browser instances
    await Promise.all(this.browsers.map(browser => browser.close()));
    this.browsers = [];
    this.availableBrowsers = [];
  }
}

module.exports = BrowserPool; 