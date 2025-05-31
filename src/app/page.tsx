"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "@/components/clock";
import { ArrowRight, Building2, Users, Clock3 } from "lucide-react";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-b from-background to-card overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center bg-background/40">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight animate-fade-in">
              Gate Entry{" "}
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Management
              </span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">
              Streamline your visitor management process with our modern, secure, and efficient gate entry system
            </p>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="bg-card/50 backdrop-blur-sm hover:bg-card/70 text-foreground"
            onClick={() => scrollToSection('visitor-section')}
          >
            Visitor Registration
          </Button>
          <Button 
            variant="ghost" 
            className="bg-card/50 backdrop-blur-sm hover:bg-card/70 text-foreground"
            onClick={() => scrollToSection('staff-section')}
          >
            Staff Login
          </Button>
          <Clock />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 bg-card">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm animate-fade-in-up">
            <Building2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiple Departments</h3>
            <p className="text-muted-foreground">Manage visitors across different departments efficiently</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm animate-fade-in-up delay-100">
            <Users className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
            <p className="text-muted-foreground">Quick and hassle-free visitor registration process</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background/50 backdrop-blur-sm animate-fade-in-up delay-200">
            <Clock3 className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">Monitor visitor status and duration in real-time</p>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div id="visitor-section">
            <Link href="/visitor" className="group">
              <Card className="card-interactive h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-semibold text-accent group-hover:text-accent/90 flex items-center justify-between">
                    Visitor Registration
                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    Quick and secure registration process for visitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:shadow-lg transition-all">
                    Register as Visitor
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div id="staff-section">
            <Link href="/login" className="group">
              <Card className="card-interactive h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-semibold text-primary group-hover:text-primary/90 flex items-center justify-between">
                    Staff Login
                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    Secure access for staff and security personnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-lg transition-all">
                    Login as Staff
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 px-8 mt-auto">
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
    </main>
  );
} 