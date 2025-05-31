"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { departments } from "@/lib/departments";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SuccessAnimation } from "./success-animation";
import { LoadingScreen } from "@/components/loading-screen";
import { ArrowRight, Building2, Clock, Mail, Phone, User } from "lucide-react";

const formSchema = z.object({
  visitorName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  department: z.string({
    required_error: "Please select a department to visit.",
  }),
  employee: z.string({
    required_error: "Please select an employee to visit.",
  }),
  purpose: z.string().min(5, {
    message: "Please provide a brief purpose of visit.",
  }),
  requestedTime: z.string({
    required_error: "Please select your preferred visit time.",
  }),
  timeAllotted: z.string(),
});

type VisitorFormValues = z.infer<typeof formSchema>;

type Employee = {
  id: string;
  name: string;
  email: string;
  departmentId: string;
};

function getDefaultDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export function VisitorForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitorName: "",
      company: "",
      email: "",
      phone: "",
      purpose: "",
      requestedTime: getDefaultDateTime(),
      timeAllotted: "60",
      department: "",
      employee: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      // Fetch employees for the selected department
      fetch(`/api/employees?departmentId=${selectedDepartment}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Employees fetched successfully:', data);
          setEmployees(data);
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
          console.error("Department ID:", selectedDepartment);
          toast({
            title: "Error",
            description: "Failed to fetch employees. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [selectedDepartment, toast]);

  async function onSubmit(values: VisitorFormValues) {
    setIsSubmitting(true);
    setShowLoadingScreen(true);
    
    try {
      const response = await fetch("/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorName: values.visitorName,
          visitorEmail: values.email,
          visitorPhone: values.phone,
          visitorCompany: values.company,
          visitorType: values.company ? "EXTERNAL" : "INTERNAL",
          employeeId: values.employee,
          departmentId: values.department,
          purpose: values.purpose,
          timeAllotted: parseInt(values.timeAllotted, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit visit request");
      }

      await response.json();
      
      // Reset form
      form.reset();
      setSelectedDepartment("");
      setEmployees([]);
      
      // Show success screen
      setShowLoadingScreen(false);
      setShowSuccess(true);

    } catch (error) {
      console.error("Error submitting visit request:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit visit request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setShowLoadingScreen(false);
    }
  }

  const handleAnimationComplete = () => {
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      {showLoadingScreen && (
        <LoadingScreen message="Processing your visit request..." />
      )}
      {showSuccess && (
        <SuccessAnimation onComplete={handleAnimationComplete} />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6 animate-fade-in-up">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="visitorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/70"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Company Name" 
                          {...field} 
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/70"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="john@example.com" 
                            type="email" 
                            {...field} 
                            className="bg-background/50 backdrop-blur-sm focus:bg-background/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1234567890" 
                            {...field} 
                            className="bg-background/50 backdrop-blur-sm focus:bg-background/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Building2 className="w-5 h-5" />
                Visit Details
              </h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department to Visit</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedDepartment(value);
                          form.setValue("employee", "");
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50 backdrop-blur-sm focus:bg-background/70">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee to Visit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 backdrop-blur-sm focus:bg-background/70">
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="requestedTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Preferred Visit Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            className="bg-background/50 backdrop-blur-sm focus:bg-background/70"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeAllotted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 backdrop-blur-sm focus:bg-background/70">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Visit</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description of your visit" 
                          {...field} 
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/70"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group" 
            disabled={isSubmitting}
          >
            <span className="flex items-center gap-2">
              {isSubmitting ? "Submitting..." : "Submit Visit Request"}
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
} 