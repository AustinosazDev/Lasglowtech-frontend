import React, { useEffect, useMemo, useState } from "react";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import {
  adminCardBody,
  adminDetailLabel,
  adminEmptyText,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
  adminTable,
  adminTableHead,
  adminTableRow,
  adminTableTd,
  adminTableTdMuted,
  adminTableTh,
  adminTableWrap,
} from "../../utils/adminUi";

const statLabel = "text-xs font-semibold text-slate-500 uppercase tracking-widest";
const statValue = "text-3xl font-bold text-slate-900 mt-2 tabular-nums";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    posts: 0,
    subscribers: 0,
    catalogues: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    revenueThisMonth: 0,
  });
  const [latestOrders, setLatestOrders] = useState([]);

  const headers = useMemo(() => ({ Authorization: `Bearer ${getAdminToken()}` }), []);

  useEffect(() => {
    const load = async () => {
      const [postsRes, subRes, catRes, revenueRes] = await Promise.allSettled([
        instance.get("/posts"),
        instance.get("/subscribe"),
        instance.get("/catalogues/admin/all", { headers }),
        instance.get("/payments/admin/revenue", { headers }),
      ]);
      const revenueStats = revenueRes.status === "fulfilled" ? revenueRes.value.data?.stats : null;
      const recent = revenueRes.status === "fulfilled" ? revenueRes.value.data?.latestPayments || [] : [];

      setStats({
        posts: postsRes.status === "fulfilled" ? postsRes.value.data.length : 0,
        subscribers: subRes.status === "fulfilled" ? subRes.value.data.length : 0,
        catalogues: catRes.status === "fulfilled" ? catRes.value.data.length : 0,
        totalRevenue: Number(revenueStats?.totalRevenue || 0),
        pendingOrders: Number(revenueStats?.pendingOrders || 0),
        revenueThisMonth: Number(revenueStats?.revenueThisMonth || 0),
      });
      setLatestOrders(recent);
    };

    load();
  }, [headers]);

  return (
    <div className="space-y-8">
      <div>
        <p className={adminSectionDesc}>Monitor platform activity, revenue, and content at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <article className="brand-card p-6">
          <p className={statLabel}>Published blogs</p>
          <p className={statValue}>{stats.posts}</p>
        </article>
        <article className="brand-card p-6">
          <p className={statLabel}>Newsletter subscribers</p>
          <p className={statValue}>{stats.subscribers}</p>
        </article>
        <article className="brand-card p-6">
          <p className={statLabel}>Catalogue items</p>
          <p className={statValue}>{stats.catalogues}</p>
        </article>
        <article className="brand-card p-6">
          <p className={statLabel}>Total revenue</p>
          <p className="text-2xl font-bold text-[#8700ff] mt-2 tabular-nums">NGN {stats.totalRevenue.toLocaleString()}</p>
        </article>
        <article className="brand-card p-6">
          <p className={statLabel}>Revenue this month</p>
          <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">NGN {stats.revenueThisMonth.toLocaleString()}</p>
        </article>
        <article className="brand-card p-6">
          <p className={statLabel}>Pending orders</p>
          <p className={statValue}>{stats.pendingOrders}</p>
        </article>
      </div>

      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h2 className={adminSectionTitle}>Recent orders</h2>
          <p className={adminSectionDesc}>Latest payment activity across the catalogue.</p>
        </div>
        <div className={adminTableWrap}>
          <table className={adminTable}>
            <thead>
              <tr className={adminTableHead}>
                <th className={adminTableTh}>Service</th>
                <th className={adminTableTh}>Customer</th>
                <th className={adminTableTh}>Amount</th>
                <th className={adminTableTh}>Status</th>
                <th className={adminTableTh}>Date</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((item) => (
                <tr key={item.id} className={adminTableRow}>
                  <td className={adminTableTd}>{item.service_name}</td>
                  <td className={adminTableTd}>{item.customer_name}</td>
                  <td className={`${adminTableTd} font-semibold text-slate-900`}>
                    {item.currency} {Number(item.amount || 0).toLocaleString()}
                  </td>
                  <td className={adminTableTdMuted}>
                    <span className="uppercase text-xs font-semibold">{item.status}</span>
                  </td>
                  <td className={adminTableTdMuted}>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!latestOrders.length && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
