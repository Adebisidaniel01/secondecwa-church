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

    const { action, token, videoData } = await req.json();

    // Verify admin token
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

    if (action === 'upload') {
      const { title, description, fileUrl, thumbnailUrl, duration, fileSize } = videoData;

      const { data, error } = await supabaseClient
        .from('videos')
        .insert({
          title,
          description,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl,
          duration,
          file_size: fileSize
        })
        .select()
        .single();

      if (error) {
        console.error('Error uploading video:', error);
        return new Response(JSON.stringify({ error: 'Upload failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, video: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'list') {
      const { data: videos, error } = await supabaseClient
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ videos }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const { videoId } = videoData;

      const { error } = await supabaseClient
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) {
        console.error('Error deleting video:', error);
        return new Response(JSON.stringify({ error: 'Delete failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in video-upload function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});