-- Set up Supabase Auth configuration
-- This script configures authentication settings for your Supabase project

-- Enable email confirmations (optional)
-- UPDATE auth.config SET email_confirm = true;

-- Set up custom claims for our user roles
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  claims jsonb;
  user_role text;
  user_institution_id uuid;
BEGIN
  -- Fetch the user role and institution from our users table
  SELECT role, institution_id INTO user_role, user_institution_id
  FROM public.users
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_role IS NOT NULL THEN
    -- Set custom claims
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    
    IF user_institution_id IS NOT NULL THEN
      claims := jsonb_set(claims, '{institution_id}', to_jsonb(user_institution_id));
    END IF;
  ELSE
    claims := jsonb_set(claims, '{user_role}', 'null');
  END IF;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.users TO supabase_auth_admin;

-- Create a trigger to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- This function will be called when a new user signs up
  -- You can customize this to create a user profile automatically
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The actual trigger setup would be done in the Supabase dashboard
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
