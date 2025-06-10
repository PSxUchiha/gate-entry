"use client";

import { Clock } from "@/components/clock";

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-background/30" />
      <div className="relative z-10 text-center space-y-4 p-8">
        <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight animate-fade-in">
          Gate Entry{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            Management
          </span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">
          Streamline your visitor management process with our modern, secure, and efficient gate entry system
        </p>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <div className="glass p-2 rounded-lg">
          <Clock />
        </div>
      </div>
    </section>
  );
} 