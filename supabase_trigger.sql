CREATE OR REPLACE FUNCTION public.handle_new_appraisal_request()
RETURNS TRIGGER AS $$
DECLARE
  response_status INT;
  response_body TEXT;
BEGIN
  -- Call the Edge Function
  SELECT
    INTO response_status, response_body
    status, content
  FROM
    net.http_post(
      url := 'http://localhost:54321/functions/v1/process-appraisal', -- This URL is for local development. For deployed, use your actual Supabase function URL.
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.claim.sub', true) || '"}'::jsonb,
      body := jsonb_build_object('record', NEW)
    );

  -- Log the response for debugging (optional)
  RAISE NOTICE 'Edge Function Response Status: %', response_status;
  RAISE NOTICE 'Edge Function Response Body: %', response_body;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_new_appraisal_request
AFTER INSERT ON public.appraisal_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_new_appraisal_request();