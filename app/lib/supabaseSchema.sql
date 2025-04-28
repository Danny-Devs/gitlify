-- Schema for the API Tester application

-- API Keys table to store and manage API keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  key_value TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scopes TEXT[] DEFAULT ARRAY[]::TEXT[],
  rate_limit INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Comment on the api_keys table and its columns
COMMENT ON TABLE public.api_keys IS 'API keys created by users for accessing services';

-- Request templates to save common API requests
CREATE TABLE public.request_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment on the request_templates table and its columns
COMMENT ON TABLE public.request_templates IS 'Saved API request templates';

-- API request history to track usage and responses
CREATE TABLE public.api_request_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  method TEXT NOT NULL,
  request_headers JSONB,
  request_body TEXT,
  response_status INTEGER,
  response_headers JSONB,
  response_body TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment on the api_request_history table and its columns
COMMENT ON TABLE public.api_request_history IS 'History of API requests made by users';

-- Function to get average duration for a specific API key
CREATE OR REPLACE FUNCTION get_average_duration(key_id UUID)
RETURNS FLOAT
LANGUAGE SQL
AS $$
  SELECT AVG(duration)::FLOAT
  FROM api_request_history
  WHERE api_key_id = key_id;
$$;

-- RLS Policies

-- Enable RLS on the tables
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_request_history ENABLE ROW LEVEL SECURITY;

-- Policies for api_keys
CREATE POLICY "Users can create their own API keys"
  ON public.api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own API keys"
  ON public.api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON public.api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON public.api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for request_templates
CREATE POLICY "Users can create their own request templates"
  ON public.request_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own request templates"
  ON public.request_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own request templates"
  ON public.request_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own request templates"
  ON public.request_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for api_request_history
CREATE POLICY "Users can view their own request history"
  ON public.api_request_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "API history can be inserted with any user"
  ON public.api_request_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX idx_api_request_history_api_key_id ON public.api_request_history(api_key_id);
CREATE INDEX idx_api_request_history_user_id ON public.api_request_history(user_id);
CREATE INDEX idx_api_request_history_created_at ON public.api_request_history(created_at);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_request_templates_user_id ON public.request_templates(user_id); 