"use client";

import { Hero } from "@/components/landing/hero";
import { Information } from "@/components/landing/information";
import { VisitorRegistration } from "@/components/landing/visitor-registration";
import { StaffLogin } from "@/components/landing/staff-login";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-card">
      {/* Background decorative elements */}
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Decorative glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-20" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-3xl opacity-20" />

      {/* Content */}
      <div className="relative">
        <Hero />
        
        <div className="w-full backdrop-blur-sm bg-background/30">
          <div className="w-full max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-lg hover-lift">
              <VisitorRegistration />
            </div>
            <div className="glass-card p-6 rounded-lg hover-lift">
              <StaffLogin />
            </div>
          </div>
        </div>

        <Information />
      </div>
    </main>
  );
} 