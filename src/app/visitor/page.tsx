import { VisitorForm } from "@/components/visitor/visitor-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VisitorPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[30vh] flex items-center justify-center bg-gradient-to-b from-background to-card overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center bg-background/40">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight animate-fade-in">
              Visitor{" "}
              <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                Registration
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">
              Complete the form below to request your visit
            </p>
          </div>
        </div>
        <Link 
          href="/" 
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-lg shadow-xl animate-fade-in-up">
            <VisitorForm />
          </div>
        </div>
      </section>
    </main>
  );
} 