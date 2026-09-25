// Centralized API configuration supporting local development and deployed production URLs
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
