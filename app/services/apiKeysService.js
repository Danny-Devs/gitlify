// apiKeysService.js - A service layer for API keys management
// Using Supabase for data storage

import supabase from '../lib/supabase';

// Helper to generate a unique key string
const generateKeyString = (type) => {
  return `gitl_${type}_${Math.random().toString(36).substring(2, 15)}`;
};

// Format the API key from database format to application format
const formatApiKey = (dbKey) => {
  if (!dbKey) return null;

  return {
    id: dbKey.id,
    name: dbKey.name,
    key: dbKey.key,
    type: dbKey.type,
    usage: dbKey.usage,
    createdAt: new Date(dbKey.created_at).toISOString().split('T')[0]
  };
};

// Get all API keys
export const getApiKeys = async () => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }

    return data.map(formatApiKey);
  } catch (error) {
    console.error('Error getting API keys:', error);
    return [];
  }
};

// Create a new API key
export const createApiKey = async (newKeyData) => {
  try {
    // Get the current user's ID from the session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const newKey = {
      name: newKeyData.name,
      key: generateKeyString(newKeyData.type || 'dev'),
      type: newKeyData.type || 'dev',
      usage: 0,
      user_id: user.id // Add the user_id from the authenticated session
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return null;
    }

    return formatApiKey(data);
  } catch (error) {
    console.error('Error creating API key:', error);
    return null;
  }
};

// Update an existing API key
export const updateApiKey = async (updatedKey) => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({
        name: updatedKey.name,
        type: updatedKey.type,
        updated_at: new Date().toISOString()
      })
      .eq('id', updatedKey.id);

    if (error) {
      console.error('Error updating API key:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating API key:', error);
    return false;
  }
};

// Delete an API key
export const deleteApiKey = async (id) => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting API key:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    return false;
  }
};

// Increment the usage count for an API key
export const incrementKeyUsage = async (id) => {
  try {
    const { error } = await supabase.rpc('increment_key_usage', { key_id: id });

    if (error) {
      console.error('Error incrementing API key usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error incrementing API key usage:', error);
    return false;
  }
}; 