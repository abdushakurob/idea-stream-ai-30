import { useState, useEffect } from "react";
import { ArrowRight, Brain, Sparkles, Zap, Target, Play } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-muted/20 to-accent-muted/20">
      {/* Header */}
      <header className="relative z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-button rounded-xl shadow-glow animate-pulse-glow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  SupaNotes.AI
                </h1>
                <p className="text-sm text-muted-foreground">Your Second Brain</p>
              </div>
            </div>
            
            <Link
              to="/auth"
              className="inline-flex items-center space-x-2 bg-gradient-button text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-glow"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center space-x-2 bg-primary-muted border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary animate-float" />
              <span className="text-sm font-medium text-primary">AI-Powered Intelligence</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Your Mind,
              </span>
              <br />
              <span className="text-foreground">Amplified</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Capture every brilliant thought. Rediscover forgotten ideas. 
              Let AI connect the dots between your insights and unlock your creative potential.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/auth"
                className="group inline-flex items-center space-x-3 bg-gradient-button text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-glow"
              >
                <span>Start Building Your Second Brain</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors font-medium">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Think Faster,
              </span>
              <span className="text-foreground"> Remember Everything</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform scattered thoughts into organized knowledge with the power of AI
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-3 bg-primary-muted rounded-xl w-fit mb-6 group-hover:animate-bounce-in">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Instant Capture</h3>
              <p className="text-muted-foreground leading-relaxed">
                Don't let brilliant ideas slip away. Capture thoughts in seconds with our lightning-fast interface designed for the flow state.
              </p>
            </div>
            
            <div className="group p-8 bg-gradient-card rounded-2xl border border-border/50 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-3 bg-secondary-muted rounded-xl w-fit mb-6 group-hover:animate-bounce-in">
                <Sparkles className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Semantic Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find ideas by meaning, not just keywords. Our AI understands context and connects related thoughts across time.
              </p>
            </div>
            
            <div className="group p-8 bg-gradient-card rounded-2xl border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-3 bg-accent-muted rounded-xl w-fit mb-6 group-hover:animate-bounce-in">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">AI Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover hidden patterns in your thinking. AI reveals connections between ideas you never knew existed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <Target className="w-16 h-16 text-white mx-auto mb-6 animate-float" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Unlock Your Mind's Potential?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of creators, entrepreneurs, and thinkers who've transformed their ideas into reality with SupaNotes.AI
            </p>
            
            <Link
              to="/auth"
              className="inline-flex items-center space-x-3 bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-glow"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-6 h-6" />
            <span className="text-xl font-bold">SupaNotes.AI</span>
          </div>
          <p className="text-background/80">
            Empowering minds with AI-powered note-taking since 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;