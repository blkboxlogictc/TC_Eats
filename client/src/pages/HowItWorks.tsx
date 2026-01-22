import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-primary">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
              <h3 className="font-bold text-xl">Discover</h3>
              <p className="text-muted-foreground">Browse our curated list of the best restaurants across the Treasure Coast.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
              <h3 className="font-bold text-xl">Get Deals</h3>
              <p className="text-muted-foreground">Sign up for our local offers to receive exclusive discounts directly to your phone.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
              <h3 className="font-bold text-xl">Enjoy</h3>
              <p className="text-muted-foreground">Visit your favorite spots and enjoy the best food the coast has to offer.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
