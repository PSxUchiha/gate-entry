"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function StaffLogin() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-primary flex items-center justify-between">
          Staff Login
          <ArrowRight className="w-6 h-6" />
        </h2>
        <p className="text-base text-muted-foreground">
          Secure access for staff and security personnel
        </p>
      </div>
      <Link href="/login">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
          Login as Staff
        </Button>
      </Link>
    </div>
  );
} 