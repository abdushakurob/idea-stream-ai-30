import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import NoteInput from "@/components/NoteInput";
import SearchBar from "@/components/SearchBar";
import NotesList from "@/components/NotesList";
import StatsCard from "@/components/StatsCard";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  similarity?: number;
}

const AppPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalSearches, setTotalSearches] = useState(0);

  // Load initial demo data
  useEffect(() => {
    const demoNotes: Note[] = [
      {
        id: "demo-1",
        content: "Building a note-taking app with AI embeddings. The key is to make semantic search feel magical - users should be able to find ideas by meaning, not just exact keywords. Think about the user experience of rediscovering old thoughts.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-2", 
        content: "Startup idea: A productivity tool that learns your work patterns and suggests optimal times for deep work vs meetings. Could integrate with calendar and use ML to predict when you'll be most focused.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-3",
        content: "The best interfaces disappear. When designing software, especially AI-powered tools, the goal should be to make the intelligence feel effortless and natural. Users shouldn't think about the complexity underneath.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setNotes(demoNotes);
  }, []);

  const handleNoteAdded = (newNote: Note) => {
    setNotes(prev => [newNote, ...prev]);
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
      // Simulate semantic search - in real app this would call the Edge Function
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock semantic similarity scoring based on keyword overlap and content similarity
      const results = notes
        .map(note => {
          const queryWords = query.toLowerCase().split(' ');
          const noteWords = note.content.toLowerCase().split(' ');
          
          // Simple similarity calculation for demo
          let similarity = 0;
          queryWords.forEach(qWord => {
            if (qWord.length > 2) {
              noteWords.forEach(nWord => {
                if (nWord.includes(qWord) || qWord.includes(nWord)) {
                  similarity += 0.3;
                }
              });
            }
          });
          
          // Boost similarity for semantic matches (demo logic)
          if (query.toLowerCase().includes('ai') && note.content.toLowerCase().includes('intelligence')) similarity += 0.4;
          if (query.toLowerCase().includes('productivity') && note.content.toLowerCase().includes('work')) similarity += 0.3;
          if (query.toLowerCase().includes('startup') && note.content.toLowerCase().includes('idea')) similarity += 0.3;
          
          return { ...note, similarity: Math.min(similarity, 0.95) };
        })
        .filter(note => note.similarity > 0.1)
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const displayedNotes = searchQuery ? searchResults : notes;

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
              <NotesList notes={displayedNotes} searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppPage;