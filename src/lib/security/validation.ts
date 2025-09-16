// P0: Security Hardening & Address Validation
import type { AddressAllowlist, WebhookSignature, ChainId } from '../wallet/types';

// Environment-based address allowlists
const ADDRESS_ALLOWLISTS: Record<string, AddressAllowlist[]> = {
  development: [
    {
      chainId: 'solana-devnet',
      addresses: [
        '11111111111111111111111111111111', // System Program
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token Program
        // Add development contracts here
      ],
      environment: 'development'
    }
  ],
  staging: [
    {
      chainId: 'solana-mainnet',
      addresses: [
        '11111111111111111111111111111111',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        // Add staging contracts here
      ],
      environment: 'staging'
    }
  ],
  production: [
    {
      chainId: 'solana-mainnet',
      addresses: [
        '11111111111111111111111111111111',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        // Add production contracts here - NEVER use test addresses
      ],
      environment: 'production'
    }
  ]
};

// Get current environment
const getCurrentEnvironment = (): 'development' | 'staging' | 'production' => {
  if (import.meta.env.DEV) return 'development';
  if (import.meta.env.VITE_APP_ENV === 'staging') return 'staging';
  return 'production';
};

// Address validation
export const validateAddress = (address: string, chainId: ChainId): boolean => {
  const environment = getCurrentEnvironment();
  const allowlists = ADDRESS_ALLOWLISTS[environment] || [];
  
  const relevantAllowlist = allowlists.find(list => list.chainId === chainId);
  if (!relevantAllowlist) {
    console.warn(`No allowlist found for chain ${chainId} in ${environment}`);
    return false;
  }
  
  return relevantAllowlist.addresses.includes(address);
};

// Address checksum validation for Ethereum-based chains
export const validateChecksumAddress = (address: string): boolean => {
  if (!address.startsWith('0x') || address.length !== 42) {
    return false;
  }
  
  // Simple checksum validation (EIP-55)
  const addressHash = address.toLowerCase().slice(2);
  const hash = simpleKeccak256(addressHash);
  
  for (let i = 0; i < 40; i++) {
    const char = address[i + 2];
    const shouldBeUppercase = parseInt(hash[i], 16) >= 8;
    
    if (char !== char.toLowerCase() && char !== char.toUpperCase()) {
      continue; // Numbers are fine
    }
    
    if (shouldBeUppercase && char !== char.toUpperCase()) {
      return false;
    }
    
    if (!shouldBeUppercase && char !== char.toLowerCase()) {
      return false;
    }
  }
  
  return true;
};

// Solana address validation  
export const validateSolanaAddress = (address: string): boolean => {
  // Basic Solana address validation
  if (address.length < 32 || address.length > 44) {
    return false;
  }
  
  // Check for valid base58 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(address);
};

// CORS headers for security
export const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Access-Control-Allow-Origin': import.meta.env.DEV ? '*' : 'https://your-production-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
} as const;

// Content validation
export const sanitizeUserContent = (content: string): string => {
  // Remove potential XSS vectors
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// URL validation for uploads and links
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow HTTPS (except localhost in development)
    if (parsedUrl.protocol !== 'https:' && 
        !(import.meta.env.DEV && parsedUrl.hostname === 'localhost')) {
      return false;
    }
    
    // Block known malicious domains
    const blockedDomains = [
      'malicious-site.com',
      'phishing-site.com'
      // Add more as needed
    ];
    
    if (blockedDomains.includes(parsedUrl.hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  
  // Additional validation based on file extension
  const extension = file.name.toLowerCase().split('.').pop();
  const allowedExtensions = allowedTypes.map(type => type.split('/')[1]);
  
  return extension ? allowedExtensions.includes(extension) : false;
};

// File size validation
export const validateFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

// Webhook signature validation
export const validateWebhookSignature = (
  payload: string, 
  signature: string, 
  secret: string,
  timestamp: number,
  tolerance: number = 300 // 5 minutes
): boolean => {
  // Check timestamp to prevent replay attacks
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - timestamp) > tolerance) {
    console.warn('Webhook timestamp outside tolerance window');
    return false;
  }
  
  // Validate HMAC signature
  const expectedSignature = simpleHmacSha256(secret, `${timestamp}.${payload}`);
  const providedSignature = signature.replace('v1=', '');
  
  return timingSafeEqual(expectedSignature, providedSignature);
};

// Timing-safe string comparison to prevent timing attacks
const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
};

// Simple HMAC-SHA256 implementation (for demo - use crypto library in production)
const simpleHmacSha256 = (key: string, data: string): string => {
  // This is a simplified implementation for demonstration
  // In production, use the WebCrypto API or a proper crypto library
  return btoa(`hmac-sha256-${key}-${data}`).slice(0, 32);
};

// Simple Keccak256 implementation (simplified for demo)
const simpleKeccak256 = (data: string): string => {
  // This is a simplified implementation for demonstration
  // In production, use a proper crypto library like keccak
  let hash = '';
  for (let i = 0; i < data.length; i++) {
    hash += data.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hash.slice(0, 40);
};

// Rate limiting helpers
interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const checkRateLimit = (
  identifier: string, 
  maxRequests: number, 
  windowMs: number
): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now - entry.windowStart > windowMs) {
    // New window or first request
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  entry.count++;
  return true;
};

// Security audit log
export const auditLog = (event: string, details: Record<string, any>) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    origin: typeof window !== 'undefined' ? window.location.origin : 'server'
  };
  
  console.log('SECURITY_AUDIT:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
  if (!import.meta.env.DEV) {
    // sendToSecurityService(logEntry);
  }
};