import { VisitorForm } from "@/components/visitor/visitor-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VisitorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-card">
      {/* Background decorative elements */}
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Decorative glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-3xl opacity-20" />

      <div className="relative">
        {/* Back button */}
        <Link 
          href="/" 
          className="fixed top-4 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
              Visitor{" "}
              <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                Registration
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Complete the form below to request your visit
            </p>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 rounded-lg shadow-xl animate-fade-in-up">
              <VisitorForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 