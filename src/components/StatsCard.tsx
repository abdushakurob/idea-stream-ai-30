import { FileText, Search, Brain, TrendingUp } from "lucide-react";

interface StatsCardProps {
  totalNotes: number;
  totalSearches: number;
}

const StatsCard = ({ totalNotes, totalSearches }: StatsCardProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-card rounded-2xl"></div>
      <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-tertiary-muted rounded-xl">
            <TrendingUp className="w-6 h-6 text-tertiary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Your Journey</h3>
            <p className="text-sm text-muted-foreground">Building your second brain</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-primary-muted to-primary-muted/50 rounded-xl border border-primary/20">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{totalNotes}</div>
            <div className="text-sm text-primary/80">Thoughts Captured</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-accent-muted to-accent-muted/50 rounded-xl border border-accent/20">
            <div className="flex items-center justify-center mb-2">
              <Search className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-accent mb-1">{totalSearches}</div>
            <div className="text-sm text-accent/80">Ideas Discovered</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-primary animate-float" />
            <span className="text-sm font-semibold text-primary">AI Enhancement</span>
          </div>
          <p className="text-xs text-primary/80 leading-relaxed">
            Every thought is vectorized for intelligent discovery and unexpected connections
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;