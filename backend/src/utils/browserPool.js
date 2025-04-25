const { chromium } = require('playwright');

class BrowserPool {
  constructor(maxBrowsers = 3) {
    this.maxBrowsers = maxBrowsers;
    this.browsers = [];
    this.availableBrowsers = [];
    this.pendingRequests = [];
    this.lastCleanup = Date.now();
  }

  async initialize() {
    // Initialize the pool with browser instances
    for (let i = 0; i < this.maxBrowsers; i++) {
      const browser = await chromium.launch(
        { 
          headless: true, 
          args: ['--no-sandbox', '--disable-dev-shm-usage']
        }
      );
      browser.isIdle = true;
      browser.idleTime = Date.now();
      this.browsers.push(browser);
      this.availableBrowsers.push(browser);
    }
  }

  async cleanup() {
    const now = Date.now();
    // Cleanup every 5 minutes
    if (now - this.lastCleanup > 5 * 60 * 1000) {
      console.log('Performing browser pool cleanup...');
      // Close and recreate browsers that have been idle for too long
      for (let i = 0; i < this.browsers.length; i++) {
        const browser = this.browsers[i];
        if (browser.isIdle && browser.idleTime > 10 * 60 * 1000) { // 10 minutes
          console.log(`Closing idle browser ${i}`);
          await browser.close();
          const newBrowser = await chromium.launch(
            { 
              headless: true, 
              args: ['--no-sandbox', '--disable-dev-shm-usage'] 
            }
          );
          newBrowser.isIdle = true;
          newBrowser.idleTime = Date.now();
          this.browsers[i] = newBrowser;
          this.availableBrowsers.push(newBrowser);
        }
      }
      this.lastCleanup = now;
    }
  }

  async acquire() {
    await this.cleanup();
    if (this.availableBrowsers.length > 0) {
      const browser = this.availableBrowsers.pop();
      browser.isIdle = false;
      browser.idleTime = 0;
      return browser;
    }

    // If no browsers are available, wait for one to become available
    return new Promise((resolve) => {
      this.pendingRequests.push(resolve);
    });
  }

  release(browser) {
    browser.isIdle = true;
    browser.idleTime = Date.now();
    if (this.pendingRequests.length > 0) {
      const resolve = this.pendingRequests.shift();
      resolve(browser);
    } else {
      this.availableBrowsers.push(browser);
    }
  }

  async close() {
    console.log('Closing all browser instances...');
    // Close all browser instances
    await Promise.all(this.browsers.map(browser => browser.close()));
    this.browsers = [];
    this.availableBrowsers = [];
  }
}

module.exports = BrowserPool; 