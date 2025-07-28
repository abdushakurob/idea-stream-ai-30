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
    const { query, userId, limit = 10 } = await req.json();
    
    if (!query || !userId) {
      return new Response(
        JSON.stringify({ error: 'Query and userId are required' }),
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

    // Generate embedding for search query using Gemini
    console.log('Generating embedding for search query:', query);
    
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
            parts: [{ text: query }]
          }
        }),
      }
    );

    if (!embeddingResponse.ok) {
      const error = await embeddingResponse.text();
      console.error('Gemini API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate search embedding' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.embedding?.values;

    if (!queryEmbedding) {
      console.error('No embedding values returned from Gemini');
      return new Response(
        JSON.stringify({ error: 'Invalid embedding response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Search embedding generated successfully');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Search for similar notes using the semantic search function
    const { data: searchResults, error } = await supabase
      .rpc('search_notes_by_similarity', {
        query_embedding: queryEmbedding,
        user_id_param: userId,
        similarity_threshold: 0.7,
        match_count: limit
      });

    if (error) {
      console.error('Database search error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to search notes' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${searchResults?.length || 0} similar notes`);

    return new Response(
      JSON.stringify({ 
        success: true,
        results: searchResults || [],
        query: query
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-notes function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});