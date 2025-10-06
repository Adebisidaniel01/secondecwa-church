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

    const { email, firstName, lastName, subscriptionType } = await req.json();

    // Validate required fields
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if already subscribed
    const { data: existing } = await supabaseClient
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.is_active) {
        return new Response(JSON.stringify({ error: 'Email is already subscribed' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Reactivate subscription
        const { data, error } = await supabaseClient
          .from('newsletter_subscriptions')
          .update({
            first_name: firstName || null,
            last_name: lastName || null,
            subscription_type: subscriptionType || 'weekly',
            is_active: true
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error reactivating subscription:', error);
          return new Response(JSON.stringify({ error: 'Failed to reactivate subscription' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, data, reactivated: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Insert new subscription
    const { data, error } = await supabaseClient
      .from('newsletter_subscriptions')
      .insert({
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        subscription_type: subscriptionType || 'weekly',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return new Response(JSON.stringify({ error: 'Failed to create subscription' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in newsletter-subscription function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});