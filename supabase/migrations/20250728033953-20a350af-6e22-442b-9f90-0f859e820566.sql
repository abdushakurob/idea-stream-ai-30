-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create notes table with pgvector support
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768), -- Gemini embeddings are 768 dimensions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own notes" 
ON public.notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for vector similarity search
CREATE INDEX notes_embedding_idx ON public.notes USING ivfflat (embedding vector_cosine_ops);

-- Create function for semantic search
CREATE OR REPLACE FUNCTION public.search_notes_by_similarity(
  query_embedding vector(768),
  user_id_param UUID,
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    notes.id,
    notes.content,
    notes.created_at,
    (1 - (notes.embedding <=> query_embedding)) as similarity
  FROM public.notes
  WHERE 
    notes.user_id = user_id_param
    AND notes.embedding IS NOT NULL
    AND (1 - (notes.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY notes.embedding <=> query_embedding
  LIMIT match_count;
$$;