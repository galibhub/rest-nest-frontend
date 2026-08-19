import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
          Payment Successful
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Your payment was completed
        </h1>

        <p className="mt-4 leading-7 text-slate-500">
          Your payment has been received. Your
          rental will be activated after the
          backend webhook completes the payment
          update.
        </p>

        <Link
          href="/dashboard/tenant"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}