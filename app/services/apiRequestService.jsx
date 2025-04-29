'use client';

import supabase from '../lib/supabase';

/**
 * Execute an API request based on the provided configuration
 * 
 * @param {Object} config - Request configuration
 * @param {string} config.method - HTTP method (GET, POST, PUT, etc.)
 * @param {string} config.url - API endpoint URL
 * @param {Object} config.headers - HTTP headers
 * @param {string} config.body - Request body (for POST, PUT, etc.)
 * @param {Object} config.auth - Authentication configuration
 * @param {string} config.auth.type - Auth type (none, bearer, basic, apiKey)
 * @param {string} config.auth.token - Bearer token 
 * @param {string} config.auth.username - Basic auth username
 * @param {string} config.auth.password - Basic auth password
 * @param {string} config.auth.keyName - API key name
 * @param {string} config.auth.keyValue - API key value
 * @param {string} config.auth.location - API key location (header, query)
 * @param {string} [config.apiKeyId] - API key ID for tracking usage
 * @returns {Promise<Object>} - Response details
 */
export async function executeRequest(config) {
  // Start timer for request
  const startTime = Date.now();

  try {
    const { method, url, headers = {}, body, auth, apiKeyId } = config;

    // Prepare fetch options
    const options = {
      method,
      headers: { ...headers },
      redirect: 'follow',
    };

    // Add body for non-GET requests if provided
    if (method !== 'GET' && method !== 'HEAD' && body) {
      options.body = body;
    }

    // Apply authentication
    let requestUrl = url;

    // Process different authentication types
    if (auth) {
      switch (auth.type) {
        case 'bearer':
          if (auth.token) {
            options.headers['Authorization'] = `Bearer ${auth.token}`;
          }
          break;

        case 'basic':
          if (auth.username || auth.password) {
            const credentials = btoa(`${auth.username || ''}:${auth.password || ''}`);
            options.headers['Authorization'] = `Basic ${credentials}`;
          }
          break;

        case 'apiKey':
          if (auth.keyName && auth.keyValue) {
            if (auth.location === 'header') {
              options.headers[auth.keyName] = auth.keyValue;
            } else if (auth.location === 'query') {
              // Add API key to URL as query parameter
              const separator = url.includes('?') ? '&' : '?';
              requestUrl = `${url}${separator}${encodeURIComponent(auth.keyName)}=${encodeURIComponent(auth.keyValue)}`;
            }
          }
          break;

        default:
          // No authentication or unknown type
          break;
      }
    }

    // Execute the request
    const response = await fetch(requestUrl, options);

    // End timer for request
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Get response body based on content type
    let responseBody;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else if (contentType.includes('text/')) {
      responseBody = await response.text();
    } else {
      responseBody = await response.text();
    }

    // Convert headers to an object
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Create response details object
    const responseDetails = {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      duration,
      size: JSON.stringify(responseBody).length,
      contentType,
    };

    // If apiKeyId is provided, save the request to history in Supabase
    if (apiKeyId) {
      try {
        await supabase.from('api_request_history').insert({
          api_key_id: apiKeyId,
          url: requestUrl,
          method,
          request_headers: headers,
          request_body: body,
          response_status: response.status,
          response_headers: responseHeaders,
          response_body: responseBody,
          duration,
        });
      } catch (error) {
        console.error('Failed to save request history:', error);
      }
    }

    return responseDetails;
  } catch (error) {
    // Handle network errors or other exceptions
    throw {
      error: true,
      message: error.message || 'Request failed',
      details: error,
    };
  }
}

/**
 * Save a request as a template
 * 
 * @param {string} name - Template name
 * @param {Object} config - Request configuration
 * @returns {Promise<Object>} - Saved template
 */
export async function saveRequestTemplate(name, config) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('request_templates')
      .insert({
        name,
        config,
        user_id: user?.id
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving template:', error);
    throw error;
  }
}

/**
 * Get all request templates
 * 
 * @returns {Promise<Array>} - Array of templates
 */
export async function getRequestTemplates() {
  try {
    const { data, error } = await supabase
      .from('request_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

/**
 * Get a specific request template by ID
 * 
 * @param {string} id - Template ID
 * @returns {Promise<Object>} - Template object
 */
export async function getRequestTemplate(id) {
  try {
    const { data, error } = await supabase
      .from('request_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
}

/**
 * Delete a request template by ID
 * 
 * @param {string} id - Template ID
 * @returns {Promise<void>}
 */
export async function deleteRequestTemplate(id) {
  try {
    const { error } = await supabase
      .from('request_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
}

/**
 * Get request history for an API key
 * 
 * @param {string} apiKeyId - API key ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of records to return
 * @param {number} options.page - Page number
 * @returns {Promise<Array>} - Array of request history records
 */
export async function getRequestHistory(apiKeyId, options = {}) {
  try {
    const { limit = 10, page = 1 } = options;
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from('api_request_history')
      .select('*')
      .eq('api_key_id', apiKeyId)
      .order('created_at', { ascending: false })
      .limit(limit)
      .offset(offset);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching request history:', error);
    throw error;
  }
}

/**
 * Get statistics for API key usage
 * 
 * @param {string} apiKeyId - API key ID
 * @returns {Promise<Object>} - Usage statistics
 */
export async function getApiKeyStats(apiKeyId) {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('api_request_history')
      .select('*', { count: 'exact', head: true })
      .eq('api_key_id', apiKeyId);

    if (countError) throw countError;

    // Get recent errors
    const { data: errors, error: errorsError } = await supabase
      .from('api_request_history')
      .select('*')
      .eq('api_key_id', apiKeyId)
      .gte('response_status', 400)
      .order('created_at', { ascending: false })
      .limit(5);

    if (errorsError) throw errorsError;

    // Get average response time
    const { data: avgData, error: avgError } = await supabase
      .rpc('get_average_duration', { key_id: apiKeyId });

    if (avgError) throw avgError;

    return {
      totalRequests: count,
      recentErrors: errors,
      averageDuration: avgData || 0,
    };
  } catch (error) {
    console.error('Error fetching API key stats:', error);
    throw error;
  }
}
