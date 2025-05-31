"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear cookies
    document.cookie = "user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    // Redirect to home page
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage all visitor check-ins and check-outs
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="management">Visit Management</TabsTrigger>
            <TabsTrigger value="activity">Daily Activity</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="ml-4"
        >
          Logout
        </Button>
      </div>
    </div>
  );
} 