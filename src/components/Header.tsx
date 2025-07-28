import { Brain } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2 bg-gradient-button rounded-xl shadow-glow animate-pulse-glow">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                SupaNotes.AI
              </h1>
              <p className="text-sm text-muted-foreground">Your AI-powered second brain</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-accent-muted border border-accent/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-accent">Demo Mode</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;