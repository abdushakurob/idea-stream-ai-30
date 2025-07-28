import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchBar = ({ onSearch, isSearching }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear search if input is empty
    if (!value.trim()) {
      onSearch("");
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-accent opacity-10 rounded-2xl"></div>
      <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-accent rounded-xl shadow-md animate-float">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Semantic Search</h3>
              <p className="text-sm text-muted-foreground">Discover ideas by meaning, not just keywords</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search your thoughts... e.g., 'productivity insights' or 'creative breakthroughs'"
              className="w-full pl-12 pr-4 py-4 bg-background/50 border border-border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
            />
          </div>
          
          {query && (
            <button
              type="submit"
              disabled={isSearching}
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-accent text-white py-3 rounded-xl font-semibold hover:scale-105 disabled:hover:scale-100 transition-all duration-200 shadow-md hover:shadow-glow"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching your mind...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Discover Ideas</span>
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;