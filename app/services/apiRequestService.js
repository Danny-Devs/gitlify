// apiRequestService.js - Service for making API requests
import supabase from '../lib/supabase';

/**
 * Execute an API request with the provided configuration
 * @param {Object} requestConfig - Configuration for the API request
 * @param {string} requestConfig.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} requestConfig.url - The URL to make the request to
 * @param {Object} [requestConfig.headers] - Request headers
 * @param {Object|string} [requestConfig.body] - Request body
 * @param {Object} [requestConfig.auth] - Authentication details
 * @param {string} [requestConfig.auth.type] - Auth type (bearer, basic, apiKey)
 * @param {string} [requestConfig.auth.key] - The API key or token
 * @param {string} [requestConfig.auth.headerName] - Custom header name for API key
 * @param {string} [requestConfig.apiKeyId] - ID of the API key to track usage
 * @returns {Promise<Object>} - Response object with data, status, headers, etc.
 */
export const executeRequest = async (requestConfig) => {
  const { method, url, headers = {}, body, auth, apiKeyId } = requestConfig;

  // Start timing the request
  const startTime = performance.now();

  try {
    // Prepare headers
    const requestHeaders = { ...headers };

    // Add authentication if provided
    if (auth) {
      switch (auth.type) {
        case 'bearer':
          requestHeaders['Authorization'] = `Bearer ${auth.key}`;
          break;
        case 'basic':
          requestHeaders['Authorization'] = `Basic ${btoa(auth.key)}`;
          break;
        case 'apiKey':
          // Add API key to headers using the specified header name or default to X-API-Key
          requestHeaders[auth.headerName || 'X-API-Key'] = auth.key;
          break;
        // Could add more auth types as needed
      }
    }

    // Prepare request options
    const requestOptions = {
      method,
      headers: requestHeaders,
      cache: 'no-cache',
      redirect: 'follow',
    };

    // Add body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD' && body) {
      if (typeof body === 'string') {
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    // Execute the request
    const response = await fetch(url, requestOptions);

    // Calculate request duration
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Parse response based on content type
    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      responseData = await response.text();
    } else {
      // Attempt to get text for any other type
      try {
        responseData = await response.text();
      } catch (e) {
        responseData = 'Unable to parse response body';
      }
    }

    // Get all response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Create the result object
    const result = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      duration,
      success: response.ok,
    };

    // Save request history to Supabase if apiKeyId is provided
    if (apiKeyId) {
      // Update API key usage count
      await supabase.rpc('increment_key_usage', { key_id: apiKeyId });

      // Store request history
      await supabase.from('request_history').insert([{
        method,
        url,
        headers: requestHeaders,
        body: typeof body === 'string' ? body : JSON.stringify(body),
        response_status: response.status,
        response_headers: responseHeaders,
        response_body: typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
        duration
      }]);
    }

    return result;
  } catch (error) {
    // Calculate request duration even for errors
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Return error response
    return {
      error: error.message || 'Request failed',
      duration,
      success: false,
    };
  }
};

/**
 * Save a request as a template
 * @param {string} name - Name of the template
 * @param {Object} requestConfig - Configuration for the API request
 * @returns {Promise<Object>} - Saved template
 */
export const saveRequestTemplate = async (name, requestConfig) => {
  try {
    const { method, url, headers, body, auth } = requestConfig;

    const { data, error } = await supabase
      .from('request_templates')
      .insert([{
        name,
        method,
        url,
        headers: headers || {},
        body: typeof body === 'string' ? body : JSON.stringify(body),
        auth_config: auth || {}
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving template:', error);
    return null;
  }
};

/**
 * Get all request templates
 * @returns {Promise<Array>} - Array of templates
 */
export const getRequestTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('request_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting templates:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
};

/**
 * Get a specific request template
 * @param {string} id - Template ID
 * @returns {Promise<Object>} - Template object
 */
export const getRequestTemplate = async (id) => {
  try {
    const { data, error } = await supabase
      .from('request_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting template:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting template:', error);
    return null;
  }
};

/**
 * Delete a request template
 * @param {string} id - Template ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteRequestTemplate = async (id) => {
  try {
    const { error } = await supabase
      .from('request_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting template:', error);
    return false;
  }
};
