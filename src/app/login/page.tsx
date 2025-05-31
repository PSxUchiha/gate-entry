"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { departments } from "@/lib/departments";
import { LoadingScreen } from "@/components/loading-screen";

// For demo purposes - replace with actual database authentication
type SecurityCredential = {
  password: string;
};

type DepartmentCredential = {
  password: string;
};

type ValidCredentials = {
  security: SecurityCredential;
  rd: DepartmentCredential;
  steel_prod: DepartmentCredential;
  quality: DepartmentCredential;
  hr: DepartmentCredential;
  automation: DepartmentCredential;
};

const VALID_CREDENTIALS: ValidCredentials = {
  security: {
    password: 'security123',
  },
  rd: {
    password: 'rd123',
  },
  steel_prod: {
    password: 'steel123',
  },
  quality: {
    password: 'quality123',
  },
  hr: {
    password: 'hr123',
  },
  automation: {
    password: 'automation123',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    role: "",
    departmentId: "",
  });

  const getLoadingMessage = (role: string, departmentId: string) => {
    if (role === 'security') {
      return "Loading security dashboard...";
    } else if (role === 'department') {
      const department = departments.find(dept => dept.id === departmentId);
      return `Loading ${department?.name || 'department'} dashboard...`;
    }
    return "Loading...";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For department role, validate against department credentials
      const credentialKey = formData.role === 'department' ? formData.departmentId : formData.role;
      const validCredential = VALID_CREDENTIALS[credentialKey as keyof ValidCredentials];

      if (!validCredential || formData.password !== validCredential.password) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.role === 'security' ? 'security' : formData.departmentId,
          password: formData.password,
          role: formData.role,
          departmentId: formData.departmentId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
        
        // Set loading message and show loading screen
        setLoadingMessage(getLoadingMessage(formData.role, formData.departmentId));
        setShowLoadingScreen(true);
        
        // Add a small delay to ensure loading screen is shown
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect based on role
        if (formData.role === 'department') {
          router.push(`/dashboard?type=employee&departmentId=${formData.departmentId}`);
        } else {
          router.push('/dashboard?type=security');
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen message={loadingMessage} />}
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    setFormData({ 
                      ...formData, 
                      role: value,
                      departmentId: "", // Reset department when role changes
                      password: "", // Reset password
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">Employee</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "department" && (
                <div className="space-y-2">
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        departmentId: value,
                        password: "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !formData.role || (formData.role === 'department' && !formData.departmentId)}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 