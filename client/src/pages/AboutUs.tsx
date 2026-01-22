import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-primary">About Us</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-blue max-w-none">
          <p>
            Welcome to the Treasure Coast Lifestyle Guide, your premier destination for discovering the best dining
            experiences in our beautiful coastal community.
          </p>
          <p>
            Our mission is to connect local food enthusiasts with the incredible restaurants that make the Treasure Coast
            a unique culinary destination. Whether you're a lifelong resident or just visiting, we help you find the
            perfect spot for any occasion.
          </p>
          <p>
            From waterfront seafood shacks to upscale steak houses, we curate the finest local listings to ensure
            you always have a seat at the best tables in town.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
