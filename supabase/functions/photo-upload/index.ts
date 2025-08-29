import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          session_token: string | null
          session_expires_at: string | null
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_token?: string | null
          session_expires_at?: string | null
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_token?: string | null
          session_expires_at?: string | null
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          thumbnail_url: string | null
          category: string | null
          is_featured: boolean | null
          upload_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          thumbnail_url?: string | null
          category?: string | null
          is_featured?: boolean | null
          upload_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          thumbnail_url?: string | null
          category?: string | null
          is_featured?: boolean | null
          upload_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, sessionToken, title, description, category, is_featured, file, fileName, photoId } = await req.json();

    console.log('Photo upload request:', { action, title, category, is_featured });

    // Verify admin session
    const { data: adminData, error: adminError } = await supabaseClient
      .from('admin_settings')
      .select('session_expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (adminError || !adminData) {
      console.error('Admin verification failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if session is expired
    if (adminData.session_expires_at && new Date(adminData.session_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Session expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'upload') {
      // Upload file to storage
      const fileBuffer = Uint8Array.from(atob(file), c => c.charCodeAt(0));
      const fileExt = fileName.split('.').pop();
      const filePath = `${Date.now()}-${fileName}`;

      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('photos')
        .upload(filePath, fileBuffer, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return new Response(
          JSON.stringify({ error: 'Failed to upload file' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Insert photo record
      const { data: photoData, error: photoError } = await supabaseClient
        .from('photos')
        .insert({
          title,
          description,
          file_url: publicUrl,
          category: category || 'general',
          is_featured: is_featured || false
        })
        .select()
        .single();

      if (photoError) {
        console.error('Photo insert error:', photoError);
        // Clean up uploaded file if database insert fails
        await supabaseClient.storage.from('photos').remove([filePath]);
        return new Response(
          JSON.stringify({ error: 'Failed to save photo data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, photo: photoData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete') {
      // Get photo data first
      const { data: photoData, error: fetchError } = await supabaseClient
        .from('photos')
        .select('file_url')
        .eq('id', photoId)
        .single();

      if (fetchError || !photoData) {
        return new Response(
          JSON.stringify({ error: 'Photo not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract file path from URL
      const filePath = photoData.file_url.split('/').pop();

      // Delete from database
      const { error: deleteError } = await supabaseClient
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) {
        console.error('Photo delete error:', deleteError);
        return new Response(
          JSON.stringify({ error: 'Failed to delete photo' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete from storage
      if (filePath) {
        await supabaseClient.storage.from('photos').remove([filePath]);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in photo-upload function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});