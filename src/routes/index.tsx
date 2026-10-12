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
    <main className="min-h-screen bg-[#F4F8F5]">
      {/* Hero Section */}
      <section className="bg-[#F4F8F5] pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-block rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
            Made by students, for students
          </span>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-[1.1]">
            Give your stuff a <br className="hidden sm:inline" />
            second life on campus
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            Buy and sell second-hand textbooks, electronics, furniture, and more
            <span className="block mt-1">— directly from students at your college.</span>
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#00C853] hover:bg-[#00B04A] text-white px-6 py-3 rounded-lg shadow-sm"
              asChild
            >
              <Link to="/browse">
                Browse listings <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white border-gray-200 text-slate-800 hover:bg-gray-50 px-6 py-3 rounded-lg shadow-sm"
              asChild
            >
              <Link to="/new">Post a listing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to="/browse"
              search={{ category: cat.value }}
              className="rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">{cat.label}</h3>
              <p className="mt-1 text-sm text-slate-500">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh on Campus */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Fresh on campus</h2>
          <Button variant="ghost" asChild>
            <Link to="/browse" className="text-slate-700 hover:text-slate-900">
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

      {/* Trust Badges */}
      <section className="border-t bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#00C853]" />
            <h3 className="mt-3 font-semibold text-slate-900">Students only</h3>
            <p className="mt-1 text-sm text-slate-500">
              Every member signs up with their own account, so you know who you're meeting.
            </p>
          </div>
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-[#00C853]" />
            <h3 className="mt-3 font-semibold text-slate-900">Meet on campus</h3>
            <p className="mt-1 text-sm text-slate-500">
              No shipping, no waiting — pick up your stuff between classes.
            </p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto h-8 w-8 text-[#00C853]" />
            <h3 className="mt-3 font-semibold text-slate-900">Post in seconds</h3>
            <p className="mt-1 text-sm text-slate-500">
              Snap a photo, set a price, and your listing is live for the whole campus.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
