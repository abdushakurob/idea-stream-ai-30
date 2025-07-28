import { useState } from "react";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NoteInputProps {
  onNoteAdded: (content: string) => Promise<void>;
}

const NoteInput = ({ onNoteAdded }: NoteInputProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Empty note",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onNoteAdded(content.trim());
      setContent("");
    } catch (error) {
      // Error handling is done in the useNotes hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-card rounded-2xl"></div>
      <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary-muted rounded-lg">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <label htmlFor="note-content" className="block text-lg font-semibold text-foreground">
                  Capture your thoughts
                </label>
                <p className="text-sm text-muted-foreground">What's sparking in your mind right now?</p>
              </div>
            </div>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pour your thoughts here... ideas, insights, breakthroughs, or just random musings. Every thought is valuable."
              className="w-full min-h-[120px] px-4 py-4 bg-background/50 border border-border rounded-xl placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 text-base"
              rows={4}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>Auto-vectorized for AI search</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center space-x-2 bg-gradient-button text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 disabled:hover:scale-100 transition-all duration-200 shadow-md hover:shadow-glow disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Capture Thought</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteInput;