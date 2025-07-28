import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  content: string;
  created_at: string;
  similarity?: number;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load notes from database
  const loadNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notes:', error);
        toast({
          title: "Error loading notes",
          description: "Failed to load your notes. Please try again.",
          variant: "destructive",
        });
      } else {
        setNotes(data || []);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save a new note
  const saveNote = async (content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await supabase.functions.invoke('generate-embedding', {
        body: {
          content,
          userId: user.id,
        },
      });

      if (response.error) {
        console.error('Error saving note:', response.error);
        toast({
          title: "Error saving note",
          description: "Failed to save your note. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Reload notes to get the latest data
      await loadNotes();
      
      toast({
        title: "Note saved!",
        description: "Your thought has been captured and vectorized.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error saving note",
        description: "Failed to save your note. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Search notes
  const searchNotes = async (query: string): Promise<Note[]> => {
    if (!user || !query.trim()) return [];

    try {
      const response = await supabase.functions.invoke('search-notes', {
        body: {
          query,
          userId: user.id,
          limit: 10,
        },
      });

      if (response.error) {
        console.error('Error searching notes:', response.error);
        toast({
          title: "Search error",
          description: "Failed to search your notes. Please try again.",
          variant: "destructive",
        });
        return [];
      }

      return response.data?.results || [];
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  // Set up real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Reload notes when a new note is inserted
          loadNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notes,
    loading,
    saveNote,
    searchNotes,
    loadNotes,
  };
};