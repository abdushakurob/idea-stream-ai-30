import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, userId } = await req.json();
    
    if (!content || !userId) {
      return new Response(
        JSON.stringify({ error: 'Content and userId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate embedding using Gemini
    console.log('Generating embedding for content:', content.substring(0, 100) + '...');
    
    const embeddingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [{ text: content }]
          }
        }),
      }
    );

    if (!embeddingResponse.ok) {
      const error = await embeddingResponse.text();
      console.error('Gemini API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate embedding' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.embedding?.values;

    if (!embedding) {
      console.error('No embedding values returned from Gemini');
      return new Response(
        JSON.stringify({ error: 'Invalid embedding response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Embedding generated successfully, length:', embedding.length);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save note with embedding to database
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        content: content,
        embedding: embedding,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save note' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Note saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        noteId: data.id,
        message: 'Note saved successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-embedding function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});