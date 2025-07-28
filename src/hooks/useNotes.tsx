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

  // Edit a note
  const editNote = async (id: string, content: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Remove the old embedding
      const { error: deleteError } = await supabase
        .from('notes')
        .update({ embedding: null })
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error clearing old embedding:', deleteError);
        toast({
          title: "Error updating note",
          description: "Failed to update note embedding. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Update the note content and generate a new embedding
      const response = await supabase.functions.invoke('generate-embedding', {
        body: {
          id,
          content,
          userId: user.id,
        },
      });

      if (response.error) {
        console.error('Error updating note:', response.error);
        toast({
          title: "Error updating note",
          description: "Failed to update your note. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Reload notes to get the latest data
      await loadNotes();

      toast({
        title: "Note updated!",
        description: "Your note has been successfully updated.",
      });

      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error updating note",
        description: "Failed to update your note. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete a note
  const deleteNote = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        toast({
          title: "Error deleting note",
          description: "Failed to delete your note. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Remove the deleted note from the state
      setNotes(notes.filter(note => note.id !== id));

      toast({
        title: "Note deleted!",
        description: "Your note has been successfully deleted.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error deleting note",
        description: "Failed to delete your note. Please try again.",
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
    editNote,
    deleteNote,
    searchNotes,
    loadNotes,
  };
};
