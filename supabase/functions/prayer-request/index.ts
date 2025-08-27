import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { name, email, phone, request, isUrgent, isConfidential } = await req.json();

    // Validate required fields
    if (!name || !request) {
      return new Response(JSON.stringify({ error: 'Name and prayer request are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert prayer request
    const { data, error } = await supabaseClient
      .from('prayer_requests')
      .insert({
        name,
        email: email || null,
        phone: phone || null,
        request,
        is_urgent: isUrgent || false,
        is_confidential: isConfidential || false,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting prayer request:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit prayer request' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in prayer-request function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});