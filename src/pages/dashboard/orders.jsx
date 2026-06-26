import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../config/axios.config";
import { getAdminToken } from "../../utils/adminAuth";
import {
  adminBtnSoft,
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
import { OrdersTableSkeleton } from "../../components/skeletons/CardSkeletons";
import { paymentTypeLabel } from "../../utils/catalogue";
import { humanizeToken } from "../../utils/displayText";

const OrdersAdmin = () => {
  const headers = useMemo(() => ({ Authorization: `Bearer ${getAdminToken()}` }), []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await instance.get("/payments/admin/orders", { headers });
        setOrders(res.data || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [headers]);

  const reverifyOrder = async (orderId) => {
    try {
      const res = await instance.post(`/payments/admin/orders/${orderId}/reverify`, {}, { headers });
      const newStatus = res.data?.order?.status;
      toast.success(newStatus ? `Reverified. Current status: ${newStatus}` : "Reverification requested.");
      const refreshed = await instance.get("/payments/admin/orders", { headers });
      setOrders(refreshed.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to reverify this order.");
    }
  };

  return (
    <div className="space-y-6">
      <p className={adminSectionDesc}>Review catalogue transactions, payment status, and email delivery.</p>

      <section className="brand-card overflow-hidden">
        <div className={adminSectionHead}>
          <h2 className={adminSectionTitle}>All orders</h2>
          <p className={adminSectionDesc}>{orders.length} order{orders.length === 1 ? "" : "s"} recorded</p>
        </div>
        <div className={adminTableWrap}>
          {loading ? (
            <OrdersTableSkeleton rows={8} />
          ) : (
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className={adminTableHead}>
                  <th className={adminTableTh}>Date</th>
                  <th className={adminTableTh}>Service</th>
                  <th className={adminTableTh}>Customer</th>
                  <th className={adminTableTh}>Email</th>
                  <th className={adminTableTh}>Amount</th>
                  <th className={adminTableTh}>Type</th>
                  <th className={adminTableTh}>Status</th>
                  <th className={adminTableTh}>Client alert</th>
                  <th className={adminTableTh}>Invoice mail</th>
                  <th className={adminTableTh}>Reference</th>
                  <th className={adminTableTh}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr key={item.id} className={adminTableRow}>
                    <td className={adminTableTdMuted}>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className={adminTableTd}>{item.service_name}</td>
                    <td className={`${adminTableTd} font-medium`}>{item.customer_name}</td>
                    <td className={adminTableTdMuted}>{item.email}</td>
                    <td className={`${adminTableTd} font-semibold text-slate-900`}>
                      {item.currency} {Number(item.amount || 0).toLocaleString()}
                    </td>
                    <td className={adminTableTdMuted}>
                      <span className="text-xs font-semibold">{paymentTypeLabel(item)}</span>
                    </td>
                    <td className={adminTableTdMuted}>
                      <span className="text-xs font-semibold">{humanizeToken(item.status)}</span>
                    </td>
                    <td className={adminTableTdMuted}>
                      <span className="uppercase text-xs font-semibold">{item.email_notification_status || "pending"}</span>
                      {item.email_notification_error && (
                        <p className="text-xs text-red-600 mt-0.5 max-w-[200px] truncate" title={item.email_notification_error}>
                          {item.email_notification_error}
                        </p>
                      )}
                    </td>
                    <td className={adminTableTdMuted}>
                      <span className="uppercase text-xs font-semibold">{item.invoice_email_status || "pending"}</span>
                      {item.invoice_email_error && (
                        <p className="text-xs text-red-600 mt-0.5 max-w-[200px] truncate" title={item.invoice_email_error}>
                          {item.invoice_email_error}
                        </p>
                      )}
                    </td>
                    <td className={`${adminTableTdMuted} font-mono text-xs`}>{item.tx_ref}</td>
                    <td className={adminTableTd}>
                      <button type="button" onClick={() => reverifyOrder(item.id)} className={adminBtnSoft}>
                        Re-verify
                      </button>
                    </td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-500">
                      No orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrdersAdmin;
