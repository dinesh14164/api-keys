import { supabase } from './supabase'

// API Keys table operations
export const apiKeysService = {
  // Get all API keys for a user
  async getAll(userId = 'default-user') {
    try {
      console.log('Fetching API keys...');
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching API keys:', error)
        throw error
      }

      console.log('Raw data from Supabase:', data);

      // Transform the data to match our frontend expectations
      const transformedData = data ? data.map(item => ({
        id: item.id,
        name: item.name,
        key: item.value, // Map 'value' column to 'key'
        type: 'dev', // Default type since column doesn't exist
        limit: 1000, // Default limit since column doesn't exist
        usage: item.usage || 0  // Use 'usage' column or default to 0
      })) : [];

      console.log('Transformed data:', transformedData);
      return transformedData;
    } catch (err) {
      console.error('Database connection error:', err)
      throw err
    }
  },

  // Create a new API key
  async create(apiKey, userId = 'default-user') {
    try {
      console.log('Creating API key:', apiKey);
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: apiKey.name,
          value: apiKey.key, // Map 'key' to 'value' column
          usage: 0 // Initialize usage to 0
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating API key:', error)
        throw error
      }

      console.log('Created API key data:', data);

      // Transform the response back to frontend format
      return {
        id: data.id,
        name: data.name,
        key: data.value, // Map 'value' back to 'key'
        type: 'dev', // Default type
        limit: 1000, // Default limit
        usage: data.usage || 0
      }
    } catch (err) {
      console.error('Error creating API key:', err)
      throw err
    }
  },

  // Update an API key
  async update(id, updates, userId = 'default-user') {
    try {
      console.log('Updating API key:', id, updates);
      
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          name: updates.name
          // Note: Only updating name since other columns don't exist
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating API key:', error)
        throw error
      }

      // Transform the response back to frontend format
      return {
        id: data.id,
        name: data.name,
        key: data.value,
        type: 'dev',
        limit: 1000,
        usage: data.usage || 0
      }
    } catch (err) {
      console.error('Error updating API key:', err)
      throw err
    }
  },

  // Delete an API key
  async delete(id, userId = 'default-user') {
    try {
      console.log('Deleting API key:', id);
      
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting API key:', error)
        throw error
      }

      return true
    } catch (err) {
      console.error('Error deleting API key:', err)
      throw err
    }
  },

  // Increment usage count
  async incrementUsage(id, userId = 'default-user') {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({ 
          usage: supabase.raw('usage + 1')
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error incrementing usage:', error)
        throw error
      }

      return data
    } catch (err) {
      console.error('Error incrementing usage:', err)
      throw err
    }
  },

  // Validate an API key
  async validateApiKey(apiKey) {
    try {
      console.log('Validating API key:', apiKey);
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('value', apiKey)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - invalid API key
          return { valid: false, message: 'Invalid API key' };
        }
        console.error('Error validating API key:', error)
        throw error
      }

      if (data) {
        console.log('API key validation successful:', data);
        return { 
          valid: true, 
          message: 'Valid API key - /protect can be accessed',
          keyData: data 
        };
      }

      return { valid: false, message: 'Invalid API key' };
    } catch (err) {
      console.error('Error validating API key:', err)
      return { valid: false, message: 'Error validating API key' };
    }
  }
}

export default apiKeysService 