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
      eventId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      specialNeeds, 
      emergencyContact, 
      emergencyPhone 
    } = await req.json();

    // Validate required fields
    if (!eventId || !firstName || !lastName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if event exists and has capacity
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return new Response(JSON.stringify({ error: 'Event not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check registration deadline
    if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
      return new Response(JSON.stringify({ error: 'Registration deadline has passed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check capacity if set
    if (event.capacity) {
      const { count, error: countError } = await supabaseClient
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .in('attendance_status', ['registered', 'attended']);

      if (countError) {
        console.error('Error checking capacity:', countError);
      } else if (count && count >= event.capacity) {
        return new Response(JSON.stringify({ error: 'Event is at full capacity' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Check for duplicate registration
    const { data: existingReg } = await supabaseClient
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .neq('attendance_status', 'cancelled')
      .single();

    if (existingReg) {
      return new Response(JSON.stringify({ error: 'You are already registered for this event' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert registration
    const { data, error } = await supabaseClient
      .from('event_registrations')
      .insert({
        event_id: eventId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        special_needs: specialNeeds || null,
        emergency_contact: emergencyContact || null,
        emergency_phone: emergencyPhone || null,
        attendance_status: 'registered'
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering for event:', error);
      return new Response(JSON.stringify({ error: 'Failed to register for event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data, event }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in event-registration function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});