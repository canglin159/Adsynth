import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getCurrentUserId, getMyReferrals, createReferralLink } from "~/lib/api";

export const Route = createFileRoute("/dashboard/referrals")({
  loader: async () => {
    const user = await getCurrentUserId();
    if (!user) throw new Error("Not authenticated");
    const data = await getMyReferrals({ data: user.id });
    return { user, ...data };
  },
  component: ReferralsPage,
});

function ReferralsPage() {
  const { user, referrals, stats, credits } = Route.useLoaderData();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const referralLink = `${window.location.origin}?ref=${user.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setMessage({ type: "success", text: "Referral link copied!" });
    setTimeout(() => setMessage(null), 2000);
  };

  const sendInvite = async () => {
    if (!email) return;
    setSending(true);
    setMessage(null);
    try {
      const result = await createReferralLink({ data: { referrerId: user.id, referredEmail: email } });
      if (result.ok) {
        setMessage({ type: "success", text: "Invitation sent!" });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.error ?? "Failed to send invite" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    }
    setSending(false);
  };

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Referrals</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Refer friends and earn free months</p>
          </div>
        </div>
      </header>

      <div className="space-y-8 p-6">
        {/* Hero reward card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 p-8 text-white">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-white/5" />
          <h2 className="relative text-2xl font-bold">Refer & Earn</h2>
          <p className="relative mt-2 max-w-md text-brand-100">
            Get one month free ($199 value) for every friend who subscribes. Your friends get 20% off their first month.
          </p>
          <div className="relative mt-6 flex items-center gap-4">
            <div className="rounded-xl bg-white/15 px-6 py-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-brand-100">Total Referrals</div>
            </div>
            <div className="rounded-xl bg-white/15 px-6 py-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{stats.subscribed}</div>
              <div className="text-xs text-brand-100">Converted</div>
            </div>
            <div className="rounded-xl bg-white/15 px-6 py-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">${(credits / 100).toFixed(0)}</div>
              <div className="text-xs text-brand-100">Credits Earned</div>
            </div>
          </div>
        </div>

        {/* Share your link */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Your Referral Link</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Send this link to friends and colleagues</p>
          <div className="mt-4 flex gap-2">
            <input readOnly value={referralLink}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" />
            <button onClick={copyLink}
              className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600">
              Copy
            </button>
          </div>
          {message && (
            <div className={`mt-3 rounded-xl px-4 py-2 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Invite by email */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Invite via Email</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Send a referral invitation directly</p>
          <div className="mt-4 flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="friend@example.com"
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500" />
            <button onClick={sendInvite} disabled={sending || !email}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl disabled:opacity-50">
              {sending ? "Sending..." : "Invite"}
            </button>
          </div>
        </div>

        {/* Referral history */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Referral History</h3>
          {referrals.length === 0 ? (
            <p className="mt-4 py-8 text-center text-gray-500 dark:text-gray-400">No referrals yet. Share your link to get started!</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 text-sm transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-900/50">
                      <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{r.referred_email}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.status === "rewarded" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" :
                          r.status === "subscribed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400" :
                          r.status === "signed_up" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400" :
                          r.status === "expired" ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" :
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                        }`}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1).replace("_", " ")}
                        </span>
                      </td>
                      <td className="text-gray-600 dark:text-gray-400">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}