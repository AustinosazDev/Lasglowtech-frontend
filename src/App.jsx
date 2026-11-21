import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SkipLink from "./components/SkipLink";
import ProjectsPage from "./pages/projects";
import About from "./pages/about";
import Services from "./pages/services";
import Contact from "./pages/contact";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import SingleService from "./pages/singleservice";
import BrandingPrint from "./pages/branding-print";
import Digital from "./pages/services/digital";
import BrandSystems from "./pages/services/brand-systems";
import PrintProduction from "./pages/services/print-production";
import ScrollTop from "./components/scroll";
import WhatsAppFloat from "./components/WhatsAppFloat";
import SiteLoader from "./components/loader";
import Blogs from "./pages/blogs";
import BlogDetails from "./pages/blog-details";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const Create = lazy(() => import("./pages/dashboard/createblog"));
const Subscriptions = lazy(() => import("./pages/dashboard/subscriptions"));
const BlogList = lazy(() => import("./pages/dashboard/bloglist"));
const Update = lazy(() => import("./pages/dashboard/updateblog"));
const AdminLayout = lazy(() => import("./pages/dashboard"));
const ServicesAdmin = lazy(() => import("./pages/dashboard/services"));
import Links from "./pages/bio";
import Checkout from "./pages/checkout";
import PaymentSuccess from "./pages/payment-success";
import Catalogues from "./pages/catalogues";
import CatalogueDetail from "./pages/catalogue-detail";
import CartPage from "./pages/cart";
import LoginPage from "./pages/auth-login";
import RegisterPage from "./pages/auth-register";
import ForgotPasswordPage from "./pages/auth-forgot-password";
import ResetPasswordPage from "./pages/auth-reset-password";
import AuthCallbackPage from "./pages/auth-callback";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin-login";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
const CataloguesAdmin = lazy(() => import("./pages/dashboard/catalogues"));
const ProjectsAdmin = lazy(() => import("./pages/dashboard/projects"));
const ContactsAdmin = lazy(() => import("./pages/dashboard/contacts"));
import Careers from "./pages/careers";
import CareersAcademy from "./pages/careers-academy";
import CareerCourseDetail from "./pages/career-course-detail";
const CareersAdmin = lazy(() => import("./pages/dashboard/careers"));
import CareersDashboard from "./pages/careers-dashboard";
const OrdersAdmin = lazy(() => import("./pages/dashboard/orders"));
const BlogCommentsAdmin = lazy(() => import("./pages/dashboard/blogcomments"));
import MyOrders from "./pages/my-orders";
import ClientDashboard from "./pages/client-dashboard";
const LmsAdmin = lazy(() => import("./pages/dashboard/lms"));
const BulkEmailAdmin = lazy(() => import("./pages/dashboard/bulk-email"));
const NewslettersAdmin = lazy(() => import("./pages/dashboard/newsletters"));
import TermsOfServicePage from "./pages/terms-of-service";
import PrivacyPolicyPage from "./pages/privacy-policy";
import VerifyCertificatePage from "./pages/verify-certificate";
import DownloadPage from "./pages/download";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const done = () => setLoading(false);
    if (document.readyState === "complete") done();
    else { window.addEventListener("load", done); return () => window.removeEventListener("load", done); }
  }, []);

  if (loading) return <SiteLoader />;

  const hideNavbar =
    location.pathname === "/bio" ||
    location.pathname === "/catalogues" ||
    location.pathname.startsWith("/catalogues/") ||
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||
    location.pathname.startsWith("/checkout/") ||
    location.pathname === "/payment/success" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/careers") ||
    location.pathname === "/admin/login" ||
    location.pathname.startsWith("/auth/") ||
    location.pathname.startsWith("/download/") ||
    location.pathname.startsWith("/legal/");

  const hideFooter =
    location.pathname === "/bio" ||
    location.pathname === "/catalogues" ||
    location.pathname.startsWith("/catalogues/") ||
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||
    location.pathname.startsWith("/checkout/") ||
    location.pathname === "/payment/success" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/careers/dashboard") ||
    location.pathname === "/admin/login" ||
    location.pathname.startsWith("/auth/") ||
    location.pathname.startsWith("/download/");

  const dashFallback = (
    <div className="min-h-screen bg-[#120b1f] flex items-center justify-center" role="status" aria-live="polite">
      <span className="text-[#9b8cb5] text-sm">Loading…</span>
    </div>
  );

  return (
    <>
      {!hideNavbar && <SkipLink />}
      {!hideNavbar && <Navbar />}

      <main id="main-content" tabIndex={-1} className={hideNavbar ? undefined : "outline-none"}>
      <Suspense fallback={location.pathname.startsWith("/dashboard") ? dashFallback : null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/digital" element={<Digital />} />
        <Route path="/services/brand-systems" element={<BrandSystems />} />
        <Route path="/services/print-production" element={<PrintProduction />} />
        <Route path="/branding-print" element={<BrandingPrint />} />
        <Route path="/services/:slug" element={<SingleService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<CareersAcademy />} />
        <Route path="/careers/browse" element={<Navigate to="/careers" replace />} />
        <Route path="/careers/courses" element={<Navigate to="/careers" replace />} />
        <Route path="/careers/courses/:slug" element={<CareerCourseDetail />} />
        <Route path="/careers/apply" element={<ProtectedRoute allowedRoles={["learner","student","talent"]}><Careers /></ProtectedRoute>} />
        <Route
          path="/careers/dashboard/browse"
          element={<Navigate to="/careers/dashboard?section=browse" replace />}
        />
        <Route path="/careers/dashboard" element={<ProtectedRoute allowedRoles={["learner","student","talent"]}><CareersDashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
        <Route path="/checkout/:slug" element={<Checkout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/download/:token" element={<DownloadPage />} />
        <Route path="/catalogues" element={<Catalogues />} />
        <Route path="/catalogues/:slug" element={<CatalogueDetail />} />
        <Route path="/products/:slug" element={<CatalogueDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/my/orders" element={<ProtectedRoute allowedRoles={["client"]}><MyOrders /></ProtectedRoute>} />
        <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={["client"]}><ClientDashboard /></ProtectedRoute>} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/legal/terms" element={<TermsOfServicePage />} />
        <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
        <Route path="/dashboard" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="catalogues" element={<CataloguesAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="updateblog" element={<Update />} />
          <Route path="createblog" element={<Create />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="contacts" element={<ContactsAdmin />} />
          <Route path="careers" element={<CareersAdmin />} />
          <Route path="lms" element={<LmsAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="bulk-email" element={<BulkEmailAdmin />} />
          <Route path="bloglist" element={<BlogList />} />
          <Route path="blog-comments" element={<BlogCommentsAdmin />} />
          <Route path="newsletters" element={<NewslettersAdmin />} />
          <Route path="newsletters/:id" element={<NewslettersAdmin />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/bio" element={<Links />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </main>

      {!hideFooter && <Footer />}
      {!hideNavbar && <WhatsAppFloat />}

      <ScrollTop />
      <ToastContainer
        position="bottom-right"
        toastStyle={{ background:"#1a1030", color:"#e8ddf8", border:"1px solid rgba(135,0,255,0.25)", borderRadius:"12px" }}
        progressStyle={{ background:"#8700ff" }}
      />
    </>
  );
}

export default App;

