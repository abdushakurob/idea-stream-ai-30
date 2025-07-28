import { Clock, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  content: string;
  created_at: string;
  similarity?: number;
}

interface NotesListProps {
  notes: Note[];
  searchQuery?: string;
}

const NotesList = ({ notes, searchQuery }: NotesListProps) => {
  if (notes.length === 0) {
    return (
      <div className="note-card text-center">
        <div className="py-12">
          <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery ? "No matching notes found" : "No notes yet"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchQuery 
              ? "Try adjusting your search or create a new note about this topic."
              : "Start capturing your thoughts and ideas. They'll appear here for easy discovery."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchQuery && (
        <div className="bg-primary-muted border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Found {notes.length} semantically similar note{notes.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-sm text-primary/80 mt-1">
            Results ranked by semantic similarity to "{searchQuery}"
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {notes.map((note, index) => (
          <div key={note.id} className="note-card slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                </span>
              </div>
              
              {note.similarity && (
                <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <span>{Math.round(note.similarity * 100)}% match</span>
                </div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
