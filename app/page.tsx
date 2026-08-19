import Link from "next/link";
import {
  Search,
  ShieldCheck,
  CreditCard,
  Home,
  ArrowRight,
  MapPin,
  Building2,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* =========================================
            HERO
        ========================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
          {/* Decorative blobs */}
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Find your next home
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                A better way to
                <span className="block text-blue-600">
                  find your home.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Browse quality rental properties, connect with
                landlords, submit requests and manage everything
                from one beautiful platform.
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700"
                >
                  Browse Properties
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                >
                  List Your Property
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Easy property search
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Secure rental flow
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Trusted experience
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SEARCH BOX
        ========================================= */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-400 focus-within:bg-white">
                <Search className="h-5 w-5 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search by location, city or area..."
                  className="w-full bg-transparent py-4 text-sm text-slate-800 outline-none sm:text-base"
                />
              </div>

              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1.5">
                Dhaka
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5">
                Chattogram
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5">
                Apartment
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5">
                Family Home
              </span>
            </div>
          </div>
        </section>

        {/* =========================================
            FEATURED CATEGORIES
        ========================================= */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Find what fits you
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600">
                Explore different property types and discover a
                place that matches your lifestyle.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <CategoryCard
              icon={
                <Building2 className="h-7 w-7 text-blue-600" />
              }
              title="Apartments"
              subtitle="Modern city living"
              bg="bg-blue-50"
            />

            <CategoryCard
              icon={
                <Home className="h-7 w-7 text-emerald-600" />
              }
              title="Family Homes"
              subtitle="Comfort for everyone"
              bg="bg-emerald-50"
            />

            <CategoryCard
              icon={
                <KeyRound className="h-7 w-7 text-violet-600" />
              }
              title="Studios"
              subtitle="Simple & practical"
              bg="bg-violet-50"
            />

            <CategoryCard
              icon={
                <MapPin className="h-7 w-7 text-orange-600" />
              }
              title="Prime Locations"
              subtitle="Live where it matters"
              bg="bg-orange-50"
            />
          </div>
        </section>

        {/* =========================================
            WHY RENTNEST
        ========================================= */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                Why RentNest
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                Everything you need to rent smarter
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                One platform for finding properties, managing
                requests and handling your rental journey.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={
                  <Search className="h-6 w-6 text-blue-600" />
                }
                iconBg="bg-blue-50"
                title="Easy Property Discovery"
                description="Search properties using location, price, property type and amenities."
              />

              <FeatureCard
                icon={
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                }
                iconBg="bg-emerald-50"
                title="Simple & Secure"
                description="Manage rental requests and interactions through a clean and reliable experience."
              />

              <FeatureCard
                icon={
                  <CreditCard className="h-6 w-6 text-violet-600" />
                }
                iconBg="bg-violet-50"
                title="Secure Payments"
                description="Complete approved rental payments through an integrated payment flow."
              />
            </div>
          </div>
        </section>

        {/* =========================================
            BOTTOM CTA
        ========================================= */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-16 text-center text-white shadow-2xl shadow-blue-200 sm:px-10">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                Start your journey
              </p>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Ready to find your next home?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-blue-100">
                Explore available rental properties and discover
                your next place to live.
              </p>

              <Link
                href="/properties"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bg: string;
}

function CategoryCard({
  icon,
  title,
  subtitle,
  bg,
}: CategoryCardProps) {
  return (
    <Link
      href="/properties"
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600">
        Explore
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}