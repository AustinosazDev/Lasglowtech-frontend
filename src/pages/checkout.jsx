import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaLock, FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../config/axios.config";
import { LOGO } from "../components/images";
import CircularBackButton from "../components/CircularBackButton";
import { getToken, getUser } from "../utils/auth";
import { formatNaira, paymentTypeLabel } from "../utils/catalogue";
import AgencyCallout from "../components/sections/AgencyCallout";

const fieldClass =
  "w-full px-4 py-3 rounded-xl bg-white border border-Primarycolor/25 text-gray-900 text-sm placeholder:text-gray-500 caret-Primarycolor focus:outline-none focus:ring-2 focus:ring-Primarycolor/40 focus:border-Primarycolor/50 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#ffffff] [&:-webkit-autofill]:[-webkit-text-fill-color:#111827]";

const isValidFlutterwaveLink = (link) =>
  typeof link === "string" && /^https:\/\/checkout\.flutterwave\.com\/v3\/hosted\/pay\/.+/i.test(link.trim());

const Checkout = () => {
  const { slug } = useParams();

  const [servicePackage, setServicePackage] = useState(null);
  const [loadingPackage, setLoadingPackage] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setFormData({
        customerName: user.username || user.name || "",
        email: user.email || "",
      });
    }
  }, []);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await instance.get(`/payments/packages/${slug}`);
        setServicePackage(res.data);
      } catch (error) {
        const msg =
          error.response?.data?.error ||
          (error.response?.status === 404
            ? "This service does not have an online payment package yet."
            : "Unable to load checkout. Please try again.");
        toast.error(msg);
      } finally {
        setLoadingPackage(false);
      }
    };

    fetchPackage();
  }, [slug]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoadingPay(true);

    try {
      const callbackUrl = `${window.location.origin}/payment/success`;
      const token = getToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await instance.post(
        "/payments/initialize",
        {
          serviceSlug: slug,
          customerName: formData.customerName,
          email: formData.email,
          callbackUrl,
        },
        config
      );

      const paymentLink = res.data?.data?.link;
      if (!isValidFlutterwaveLink(paymentLink)) {
        throw new Error(
          res.data?.error ||
            "Payment provider did not return a valid checkout link. Please try again or contact support."
        );
      }

      window.location.assign(paymentLink);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Unable to start payment. Check that Flutterwave keys are set on the server.";
      toast.error(message);
      setLoadingPay(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgcolor text-textcolor2 flex flex-col overflow-x-hidden">
      <header className="bg-bgcolor2/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <CircularBackButton fallback={`/catalogues/${slug}`} />
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <img src={LOGO} width={28} height={28} alt="Lasglowtech" className="rounded-md shrink-0" />
              <span className="font-semibold text-sm truncate">Lasglowtech</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {loadingPackage && (
          <div className="brand-card rounded-3xl p-8 w-full max-w-md animate-pulse">
            <div className="h-6 w-32 bg-bgcolor2/70 rounded mb-4" />
            <div className="h-20 bg-bgcolor2/70 rounded-2xl mb-6" />
            <div className="space-y-3">
              <div className="h-11 bg-bgcolor2/70 rounded-xl" />
              <div className="h-11 bg-bgcolor2/70 rounded-xl" />
              <div className="h-12 bg-bgcolor2/70 rounded-full mt-4" />
            </div>
          </div>
        )}

        {!loadingPackage && !servicePackage && (
          <div className="text-center max-w-sm">
            <p className="text-gray-400 mb-4">This product is not available for checkout.</p>
            <Link to="/catalogues" className="text-Secondarycolor text-sm hover:underline">
              Browse catalogue
            </Link>
          </div>
        )}

        {!loadingPackage && servicePackage && (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-textcolor2">Checkout</h1>
              <p className="text-sm text-gray-500 mt-1">No account needed — enter your details and pay securely</p>
            </div>

            <div className="brand-card rounded-3xl p-6 md:p-7">
              <div className="flex items-start gap-4 pb-5 mb-5 border-b border-white/10">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-Primarycolor/15 text-Primarycolor shrink-0">
                  <FaShoppingBag className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-textcolor2 truncate">{servicePackage.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{paymentTypeLabel(servicePackage)}</p>
                </div>
                <p className="text-lg font-bold text-Secondarycolor shrink-0">
                  {formatNaira(servicePackage.amount)}
                </p>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-xs text-gray-500 mb-1.5">
                    Full name
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={fieldClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs text-gray-500 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldClass}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingPay}
                  className="w-full mt-2 py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-Primarycolor to-Primarycolor1 text-white hover:opacity-95 transition-opacity disabled:opacity-60"
                >
                  {loadingPay ? "Redirecting to payment…" : "Pay with Flutterwave"}
                </button>
              </form>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.7rem] text-gray-500">
                <FaLock className="w-3 h-3" />
                Secured by Flutterwave
              </p>
            </div>

            {servicePackage?.assetFormat && (
              <div className="mt-6">
                <AgencyCallout />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
