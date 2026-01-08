/**
 * User Preferences Management
 * 
 * Functions for saving and loading user preferences using localStorage
 */

const STORAGE_KEY = 'tax-calculator-preferences';

export interface UserPreferences {
  selectedCountry: string;
  lastUsed: number;
}

/**
 * Save user preferences to localStorage
 */
export function savePreferences(country: string): void {
  try {
    const prefs: UserPreferences = {
      selectedCountry: country,
      lastUsed: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    // Silently fail if localStorage is not available
    console.warn('Failed to save preferences:', error);
  }
}

/**
 * Load user preferences from localStorage
 */
export function loadPreferences(): UserPreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const prefs = JSON.parse(stored) as UserPreferences;
    return prefs;
  } catch (error) {
    // Return null if parsing fails
    console.warn('Failed to load preferences:', error);
    return null;
  }
}
