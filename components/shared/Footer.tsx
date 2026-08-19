import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Home className="h-5 w-5" />
              </div>

              <span className="text-xl font-black">
                Rent<span className="text-blue-400">Nest</span>
              </span>
            </Link>

            <p className="mt-5 max-w-md leading-7 text-slate-400">
              Discover rental properties, connect with landlords,
              manage rental requests and complete your rental
              journey with confidence.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-3">
              <SocialLink label="f" />
              <SocialLink label="ig" />
              <SocialLink label="X" />
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/properties"
                className="transition hover:text-white"
              >
                Properties
              </Link>

              <Link
                href="/auth/register"
                className="transition hover:text-white"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link
                href="/auth/login"
                className="transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="transition hover:text-white"
              >
                Register
              </Link>

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Support
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} RentNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  label,
}: {
  label: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-300 transition hover:bg-blue-600 hover:text-white"
    >
      {label}
    </a>
  );
}