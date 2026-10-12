import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { CATEGORIES, listingsQuery } from "@/lib/listings";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(listingsQuery()),
  head: () => ({
    meta: [
      { title: "CampusKart — Campus Second-Hand Marketplace" },
      {
        name: "description",
        content:
          "Buy and sell second-hand textbooks, electronics, furniture, and more with students on your campus.",
      },
      { property: "og:title", content: "CampusKart — Campus Second-Hand Marketplace" },
      {
        property: "og:description",
        content:
          "Buy and sell second-hand textbooks, electronics, furniture, and more with students on your campus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: listings } = useSuspenseQuery(listingsQuery());
  const featured = listings.slice(0, 6);

  return (
    <main>
      <section className="border-b bg-accent/40">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-block rounded-full border bg-background px-4 py-1 text-xs font-semibold text-accent-foreground">
            Made by students, for students
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold sm:text-5xl">
            Give your stuff a second life on campus
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Buy and sell second-hand textbooks, electronics, furniture, and more — directly from
            students at your college.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/browse">
                Browse listings <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/new">Post a listing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to="/browse"
              search={{ category: cat.value }}
              className="rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold">{cat.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Fresh on campus</h2>
          <Button variant="ghost" asChild>
            <Link to="/browse">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">Students only</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every member signs up with their own account, so you know who you're meeting.
            </p>
          </div>
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">Meet on campus</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No shipping, no waiting — pick up your stuff between classes.
            </p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">Post in seconds</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Snap a photo, set a price, and your listing is live for the whole campus.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
