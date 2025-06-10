"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function VisitorRegistration() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-accent flex items-center justify-between">
          Visitor Registration
          <ArrowRight className="w-6 h-6" />
        </h2>
        <p className="text-base text-muted-foreground">
          Quick and secure registration process for visitors
        </p>
      </div>
      <Link href="/visitor">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all">
          Register as Visitor
        </Button>
      </Link>
    </div>
  );
} 