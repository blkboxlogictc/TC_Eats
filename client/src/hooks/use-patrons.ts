import { useState } from "react";
import { type InsertPatron } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { DEMO_PATRONS } from "../data/demo-data";

export function useCreatePatron() {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: InsertPatron) => {
    setIsPending(true);
    
    // Simulate API delay and validation
    setTimeout(() => {
      setIsPending(false);
      
      // Check if phone already exists (demo validation)
      const phoneExists = DEMO_PATRONS.some(p => p.phone === data.phone);
      
      if (phoneExists) {
        toast({
          title: "Couldn't sign up",
          description: "This phone number is already registered.",
          variant: "destructive"
        });
        return;
      }

      // Simulate successful signup
      toast({
        title: "Welcome Aboard!",
        description: "You've successfully signed up for exclusive local offers. (Demo mode - not persisted)"
      });
    }, 1000);
  };

  const mutateAsync = (data: InsertPatron) => {
    mutate(data);
    return Promise.resolve();
  };

  return {
    mutate,
    mutateAsync,
    isPending,
    isError: false,
    error: null,
  };
}
