import React, { useEffect, useState } from "react";
import instance from "../../config/axios.config";
import {
  adminCardBody,
  adminEmptyState,
  adminEmptyText,
  adminNestedCard,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
} from "../../utils/adminUi";

const Subscriptions = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    instance
      .get("/subscribe")
      .then((res) => setData(res.data))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <section className="brand-card overflow-hidden">
      <div className={adminSectionHead}>
        <h2 className={adminSectionTitle}>Newsletter subscribers</h2>
        <p className={adminSectionDesc}>People who opted in for updates and offers.</p>
      </div>
      <div className={adminCardBody}>
        {data.length === 0 ? (
          <div className={adminEmptyState}>
            <p className={adminEmptyText}>No subscribers yet.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((sub) => (
              <li key={sub.id} className={`${adminNestedCard} px-4 py-3.5 text-sm font-medium text-slate-800 bg-white`}>
                {sub.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Subscriptions;
