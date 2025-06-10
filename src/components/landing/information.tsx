"use client";

import Link from "next/link";
import { Building2, Users, Clock3 } from "lucide-react";

export function Information() {
  return (
    <>
      {/* Features Section */}
      <section className="w-full py-16 px-8 backdrop-blur-sm bg-background/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg glass hover-lift animate-fade-in-up">
            <div className="glass-feature-icon">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Departments</h3>
            <p className="text-muted-foreground">Manage visitors across different departments efficiently</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg glass hover-lift animate-fade-in-up delay-100">
            <div className="glass-feature-icon">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
            <p className="text-muted-foreground">Quick and hassle-free visitor registration process</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg glass hover-lift animate-fade-in-up delay-200">
            <div className="glass-feature-icon">
              <Clock3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">Monitor visitor status and duration in real-time</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full backdrop-blur-sm bg-background/30 py-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Gate Entry Management System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
} 