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

    const { action, token, youtubeData } = await req.json();

    // Verify admin token for write operations
    if (action !== 'status') {
      const { data: adminData } = await supabaseClient
        .from('admin_settings')
        .select('id')
        .eq('session_token', token)
        .gt('session_expires_at', new Date().toISOString())
        .limit(1);

      if (!adminData || adminData.length === 0) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (action === 'configure') {
      const { apiKey, channelId, channelName, liveStreamKey } = youtubeData;

      // Check if settings exist
      const { data: existing } = await supabaseClient
        .from('youtube_settings')
        .select('id')
        .limit(1);

      let result;
      if (existing && existing.length > 0) {
        // Update existing
        result = await supabaseClient
          .from('youtube_settings')
          .update({
            api_key: apiKey,
            channel_id: channelId,
            channel_name: channelName,
            live_stream_key: liveStreamKey
          })
          .eq('id', existing[0].id)
          .select()
          .single();
      } else {
        // Create new
        result = await supabaseClient
          .from('youtube_settings')
          .insert({
            api_key: apiKey,
            channel_id: channelId,
            channel_name: channelName,
            live_stream_key: liveStreamKey
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error configuring YouTube:', result.error);
        return new Response(JSON.stringify({ error: 'Configuration failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, settings: result.data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'go-live') {
      const { title, description } = youtubeData;

      // Update live status
      const { error } = await supabaseClient
        .from('youtube_settings')
        .update({ is_live: true })
        .limit(1);

      if (error) {
        console.error('Error updating live status:', error);
        return new Response(JSON.stringify({ error: 'Failed to go live' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // In a real implementation, you would call YouTube API here to start the live stream
      console.log('Going live with:', { title, description });

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Live stream started',
        streamUrl: 'https://youtube.com/watch?v=live-stream-id'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'stop-live') {
      const { error } = await supabaseClient
        .from('youtube_settings')
        .update({ is_live: false })
        .limit(1);

      if (error) {
        console.error('Error stopping live stream:', error);
        return new Response(JSON.stringify({ error: 'Failed to stop live stream' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Live stream stopped'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'status') {
      const { data: settings } = await supabaseClient
        .from('youtube_settings')
        .select('channel_name, is_live')
        .limit(1);

      return new Response(JSON.stringify({ 
        settings: settings && settings.length > 0 ? settings[0] : null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in youtube-integration function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});