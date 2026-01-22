import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertPatron } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCreatePatron() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPatron) => {
      const res = await fetch(api.patrons.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to join");
      }
      return api.patrons.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({ 
        title: "Welcome Aboard!", 
        description: "You've successfully signed up for exclusive local offers." 
      });
    },
    onError: (error) => {
      toast({ 
        title: "Couldn't sign up", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}
