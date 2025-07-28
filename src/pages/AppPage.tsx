import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import Header from "@/components/Header";
import NoteInput from "@/components/NoteInput";
import SearchBar from "@/components/SearchBar";
import NotesList from "@/components/NotesList";
import StatsCard from "@/components/StatsCard";

interface DisplayNote {
  id: string;
  content: string;
  createdAt: string;
  similarity?: number;
}

const AppPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { notes, loading: notesLoading, saveNote, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DisplayNote[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalSearches, setTotalSearches] = useState(0);
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleNoteAdded = async (content: string) => {
    await saveNote(content);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setTotalSearches(prev => prev + 1);
    
    try {
      const results = await searchNotes(query);
      // Convert database notes to display notes
      const displayResults: DisplayNote[] = results.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.created_at,
        similarity: note.similarity
      }));
      setSearchResults(displayResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-muted/10 to-accent-muted/10 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will be redirected)
  if (!user) {
    return null;
  }

  // Convert database notes to display notes
  const displayNotes: DisplayNote[] = notes.map(note => ({
    id: note.id,
    content: note.content,
    createdAt: note.created_at,
    similarity: note.similarity
  }));

  const notesToDisplay = searchQuery ? searchResults : displayNotes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-muted/10 to-accent-muted/10">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="inline-flex items-center space-x-2 bg-primary-muted border border-primary/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary animate-float" />
              <span className="text-sm font-medium text-primary">AI-Powered Second Brain</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Capture. Discover. Create.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your scattered thoughts into organized knowledge. Let AI help you rediscover forgotten ideas and spark new connections.
            </p>
          </div>

          {/* Note Input */}
          <div className="animate-slide-up">
            <NoteInput onNoteAdded={handleNoteAdded} />
          </div>

          {/* Search Bar */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          </div>

          {/* Stats and Notes Layout */}
          <div className="grid lg:grid-cols-4 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Sidebar with Stats */}
            <div className="lg:col-span-1">
              <StatsCard totalNotes={notes.length} totalSearches={totalSearches} />
            </div>

            {/* Notes List */}
            <div className="lg:col-span-3">
              {notesLoading ? (
                <div className="note-card text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your notes...</p>
                </div>
              ) : (
                <NotesList 
                  notes={notesToDisplay} 
                  searchQuery={searchQuery} 
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppPage;