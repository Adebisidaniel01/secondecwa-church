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

    const { 
      ministryId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      position, 
      emergencyContact, 
      emergencyPhone 
    } = await req.json();

    // Validate required fields
    if (!ministryId || !firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if ministry exists and is active
    const { data: ministry, error: ministryError } = await supabaseClient
      .from('ministries')
      .select('name, is_active')
      .eq('id', ministryId)
      .eq('is_active', true)
      .single();

    if (ministryError || !ministry) {
      return new Response(JSON.stringify({ error: 'Ministry not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for existing volunteer registration
    const { data: existingVol } = await supabaseClient
      .from('ministry_volunteers')
      .select('id')
      .eq('ministry_id', ministryId)
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (existingVol) {
      return new Response(JSON.stringify({ error: 'You are already registered as a volunteer for this ministry' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert volunteer registration
    const { data, error } = await supabaseClient
      .from('ministry_volunteers')
      .insert({
        ministry_id: ministryId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        position: position || 'Volunteer',
        emergency_contact: emergencyContact || null,
        emergency_phone: emergencyPhone || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering volunteer:', error);
      return new Response(JSON.stringify({ error: 'Failed to register as volunteer' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data, ministry }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ministry-volunteer function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});