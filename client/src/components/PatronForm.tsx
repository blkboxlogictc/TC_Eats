import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPatronSchema, type InsertPatron } from "@shared/schema";
import { useCreatePatron } from "@/hooks/use-patrons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export function PatronForm() {
  const { mutate, isPending } = useCreatePatron();
  
  const form = useForm<InsertPatron>({
    resolver: zodResolver(insertPatronSchema),
    defaultValues: {
      phone: "",
      city: "",
      zip: "",
      termsAccepted: true
    }
  });

  function onSubmit(data: InsertPatron) {
    mutate(data, {
      onSuccess: () => form.reset()
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-border/50">
      <div className="text-center mb-8">
        <h3 className="font-display text-2xl font-bold text-primary mb-2">
          Join the Treasure Club
        </h3>
        <p className="text-muted-foreground">
          Get exclusive offers from top local restaurants sent straight to your phone.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(772) 555-0123" {...field} className="bg-gray-50 border-gray-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Stuart" {...field} className="bg-gray-50 border-gray-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="34994" {...field} className="bg-gray-50 border-gray-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg bg-gray-50/50">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to receive marketing SMS from Treasure Coast Lifestyle. Msg & data rates may apply.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold shadow-lg shadow-primary/20"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Get Offers Now"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
