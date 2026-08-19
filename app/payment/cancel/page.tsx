import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-red-600">
          Payment Cancelled
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Payment was not completed
        </h1>

        <p className="mt-4 leading-7 text-slate-500">
          Your checkout was cancelled. You can
          return to your dashboard and try again
          when the payment is available.
        </p>

        <Link
          href="/dashboard/tenant"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}