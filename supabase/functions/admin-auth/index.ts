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

    const { action, password, token } = await req.json();

    if (action === 'login') {
      // Simple password check - in production, use proper hashing
      const hashedPassword = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      const hashHex = Array.from(new Uint8Array(hashedPassword))
        .map(b => b.toString(16).padStart(2, '0')).join('');

      // Check if admin settings exist, if not create them
      let { data: adminSettings } = await supabaseClient
        .from('admin_settings')
        .select('*')
        .limit(1);

      if (!adminSettings || adminSettings.length === 0) {
        // Create initial admin settings with the provided password
        const { error } = await supabaseClient
          .from('admin_settings')
          .insert({
            password_hash: hashHex,
            session_token: crypto.randomUUID(),
            session_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          });

        if (error) {
          console.error('Error creating admin settings:', error);
          return new Response(JSON.stringify({ error: 'Setup failed' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          token: crypto.randomUUID(),
          message: 'Admin account created and logged in' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify password
      const settings = adminSettings[0];
      if (settings.password_hash === hashHex) {
        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        await supabaseClient
          .from('admin_settings')
          .update({
            session_token: sessionToken,
            session_expires_at: expiresAt
          })
          .eq('id', settings.id);

        return new Response(JSON.stringify({ 
          success: true, 
          token: sessionToken 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ error: 'Invalid password' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (action === 'verify') {
      const { data } = await supabaseClient
        .from('admin_settings')
        .select('session_expires_at')
        .eq('session_token', token)
        .gt('session_expires_at', new Date().toISOString())
        .limit(1);

      return new Response(JSON.stringify({ 
        valid: data && data.length > 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-auth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});