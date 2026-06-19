import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { getToken, getUser } from "../utils/auth";
import SEO from "../utils/seo";
import { OrderListSkeleton, StatCardSkeletonRow } from "../components/skeletons/CardSkeletons";

const statusClass = {
  initiated: "text-gray-300 border-gray-300/40",
  pending: "text-yellow-300 border-yellow-300/40",
  paid: "text-green-300 border-green-300/40",
  failed: "text-red-300 border-red-300/40",
  cancelled: "text-orange-300 border-orange-300/40",
};

const ClientDashboard = () => {
  const token = useMemo(() => getToken(), []);
  const user = useMemo(() => getUser(), []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const firstName = String(user?.username || "Client").split(" ")[0];
  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "initiated");
  const failedOrders = orders.filter((o) => o.status === "failed");
  const totalSpend = paidOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await instance.get("/payments/my/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (e) {
        setError("Unable to load your client dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const downloadInvoice = async (orderId, txRef) => {
    try {
      const res = await instance.get(`/payments/my/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/html;charset=utf-8" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `invoice-${txRef || orderId}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to download invoice.");
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-20 py-24 bg-gradient-to-b from-bgcolor2 via-bgcolor2 to-bgcolor text-textcolor2">
      <SEO
        title="Client Dashboard | Lasglowtech"
        description="Track your service orders and payments."
        url="https://www.lasglowtech.com.ng/client/dashboard"
      />

      <section className="max-w-6xl mx-auto">
        <div className="brand-card p-5 md:py-16">
          <h1 className="text-textcolor2">Welcome, {firstName}</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your service orders and payment status.</p>
          {!loading && (
            <div className="brand-card mt-4 p-3 text-sm">
              {pendingOrders.length > 0 && (
                <p className="text-yellow-300">You have {pendingOrders.length} order(s) awaiting processing.</p>
              )}
              {pendingOrders.length === 0 && failedOrders.length === 0 && (
                <p className="text-green-300">All clear. No pending order notifications right now.</p>
              )}
              {failedOrders.length > 0 && (
                <p className="text-red-300 mt-1">
                  {failedOrders.length} order(s) need payment retry or support follow-up.
                </p>
              )}
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <StatCardSkeletonRow count={3} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <article className="brand-card p-4">
                  <p className="text-xs uppercase text-gray-400">Total Orders</p>
                  <p className="text-2xl font-semibold mt-1 text-textcolor2 tabular-nums">{orders.length}</p>
                </article>
                <article className="brand-card p-4">
                  <p className="text-xs uppercase text-gray-400">Paid Orders</p>
                  <p className="text-2xl font-semibold mt-1 text-textcolor2 tabular-nums">{paidOrders.length}</p>
                </article>
                <article className="brand-card p-4">
                  <p className="text-xs uppercase text-gray-400">Total Spend</p>
                  <p className="text-2xl font-semibold mt-1 text-Secondarycolor tabular-nums">NGN {totalSpend.toLocaleString()}</p>
                </article>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Link
              to="/catalogues"
              className="inline-block px-4 py-2 rounded-lg border border-Primarycolor/40 text-textcolor2 hover:bg-Primarycolor hover:text-white hover:border-Primarycolor transition-all text-sm font-medium"
            >
              Browse Catalogues
            </Link>
          </div>
        </div>

        <div className="brand-card p-5 md:p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3 text-textcolor2">My Orders</h2>
          {loading && <OrderListSkeleton rows={4} />}
          {!loading && error && <p className="text-red-300">{error}</p>}

          {!loading && !error && (
            <>
              {orders.length === 0 && <p className="text-gray-400">No orders yet.</p>}
              {orders.length > 0 && (
                <div className="space-y-3">
                  {orders.map((item) => (
                    <article key={item.id} className="brand-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-textcolor2">{item.service_name}</p>
                        <span
                          className={`px-3 py-1 rounded-full border text-xs uppercase ${
                            statusClass[item.status] || "text-gray-300 border-gray-300/40"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">
                        {item.currency} {Number(item.amount || 0).toLocaleString()} - {item.payment_type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleDateString()} - {item.tx_ref}
                      </p>
                      {item.status === "paid" && (
                        <button
                          type="button"
                          onClick={() => downloadInvoice(item.id, item.tx_ref)}
                          className="mt-3 px-3 py-1.5 rounded-lg border border-Primarycolor/40 text-textcolor2 hover:bg-Primarycolor/25 text-xs font-medium transition-colors"
                        >
                          Download Invoice
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;
