// Cross-fetch polyfill for browser environment
(function() {
  'use strict';
  
  // If fetch is already available globally, use it
  if (typeof window !== 'undefined' && window.fetch) {
    // Ensure cross-fetch module provides a default export
    if (typeof window.module === 'undefined') {
      window.module = {};
    }
    if (typeof window.exports === 'undefined') {
      window.exports = {};
    }
    
    // Provide the fetch function as default export for cross-fetch
    window.crossFetch = window.fetch;
    
    // For CommonJS compatibility
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = window.fetch;
      module.exports.default = window.fetch;
    }
  }
})();