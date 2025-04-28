// apiKeysService.js - A service layer for API keys management
// Currently using localStorage but designed to be swapped with Supabase later

const STORAGE_KEY = 'gitlify_api_keys';

// Default/initial keys if none exist
const defaultKeys = [
  {
    id: "1",
    name: "default",
    key: "gitl-dev-xxxxxxxxxxxx",
    type: "dev",
    usage: 0,
    createdAt: new Date().toISOString().split('T')[0]
  }
];

// Helper to generate a unique key string
const generateKeyString = (type) => {
  return `gitl_${type}_${Math.random().toString(36).substring(2, 15)}`;
};

// Get all API keys
export const getApiKeys = () => {
  if (typeof window === 'undefined') return defaultKeys;

  try {
    const keys = localStorage.getItem(STORAGE_KEY);
    return keys ? JSON.parse(keys) : defaultKeys;
  } catch (error) {
    console.error('Error getting API keys:', error);
    return defaultKeys;
  }
};

// Create a new API key
export const createApiKey = (newKeyData) => {
  try {
    const keys = getApiKeys();

    const newKey = {
      id: Date.now().toString(),
      key: generateKeyString(newKeyData.type || 'dev'),
      type: newKeyData.type || 'dev',
      usage: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...newKeyData
    };

    const updatedKeys = [...keys, newKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));

    return newKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    return null;
  }
};

// Update an existing API key
export const updateApiKey = (updatedKey) => {
  try {
    const keys = getApiKeys();
    const updatedKeys = keys.map(key =>
      key.id === updatedKey.id ? { ...key, ...updatedKey } : key
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
    return true;
  } catch (error) {
    console.error('Error updating API key:', error);
    return false;
  }
};

// Delete an API key
export const deleteApiKey = (id) => {
  try {
    const keys = getApiKeys();
    const updatedKeys = keys.filter(key => key.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    return false;
  }
};

// When migrating to Supabase, you'll replace the implementations above
// with Supabase client calls, but keep the same function signatures
// so the rest of your application won't need to change. 