import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRoleHomePath, saveSession } from "../utils/auth";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const session = searchParams.get("session");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!session) {
      toast.error("Missing sign-in data.");
      navigate("/auth/login", { replace: true });
      return;
    }

    try {
      const { token, user } = JSON.parse(session);
      if (!token || !user) throw new Error("bad payload");
      saveSession({ token, user });
      toast.success(`Welcome${user.username ? `, ${user.username}` : ""}!`);
      navigate(getRoleHomePath(user.role), { replace: true });
    } catch {
      toast.error("Unable to complete sign-in.");
      navigate("/auth/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#120b1f] text-white">
      <p className="text-sm text-[#c4b3d8]">Signing you in…</p>
    </div>
  );
}
