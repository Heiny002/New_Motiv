/**
 * CoachCacheService
 * 
 * A service that implements caching for coach responses to reduce API calls.
 * Uses a combination of in-memory cache and localStorage for persistence.
 * Implements LRU (Least Recently Used) cache eviction policy.
 */

class CoachCacheService {
  constructor(maxCacheSize = 100) {
    this.maxCacheSize = maxCacheSize;
    this.cache = new Map();
    this.initializeFromStorage();
  }

  /**
   * Initialize cache from localStorage if available
   */
  initializeFromStorage() {
    try {
      const storedCache = localStorage.getItem('coachCache');
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        this.cache = new Map(Object.entries(parsedCache));
      }
    } catch (error) {
      console.error('Error initializing cache from storage:', error);
      this.cache = new Map();
    }
  }

  /**
   * Save cache to localStorage
   */
  saveToStorage() {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem('coachCache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  /**
   * Generate a cache key from the message and context
   * @param {string} message - The user's message
   * @param {Object} context - The conversation context
   * @returns {string} A unique cache key
   */
  generateCacheKey(message, context) {
    // Create a simplified context object with only relevant fields
    const simplifiedContext = {
      currentGoal: context.currentGoal?.title,
      recentChallenges: context.recentChallenges,
      previousExcuses: context.previousExcuses
    };

    // Generate a hash of the message and context
    const keyString = JSON.stringify({
      message: message.toLowerCase().trim(),
      context: simplifiedContext
    });

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  /**
   * Get a cached response if available
   * @param {string} message - The user's message
   * @param {Object} context - The conversation context
   * @returns {Object|null} The cached response or null if not found
   */
  getCachedResponse(message, context) {
    const key = this.generateCacheKey(message, context);
    const cachedItem = this.cache.get(key);

    if (cachedItem) {
      // Update the timestamp to mark as recently used
      this.cache.set(key, {
        ...cachedItem,
        lastUsed: Date.now()
      });
      this.saveToStorage();
      return cachedItem.response;
    }

    return null;
  }

  /**
   * Cache a response
   * @param {string} message - The user's message
   * @param {Object} context - The conversation context
   * @param {Object} response - The coach's response
   */
  cacheResponse(message, context, response) {
    const key = this.generateCacheKey(message, context);

    // If cache is full, remove least recently used item
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastUsed - b.lastUsed)[0][0];
      this.cache.delete(oldestKey);
    }

    // Add new response to cache
    this.cache.set(key, {
      response,
      lastUsed: Date.now()
    });

    this.saveToStorage();
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
    localStorage.removeItem('coachCache');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * Calculate cache hit rate
   * @returns {number} Cache hit rate as a percentage
   */
  calculateHitRate() {
    // This would need to be implemented with actual hit/miss tracking
    // For now, return a placeholder
    return 0;
  }
}

// Export a singleton instance
export const coachCacheService = new CoachCacheService(); 