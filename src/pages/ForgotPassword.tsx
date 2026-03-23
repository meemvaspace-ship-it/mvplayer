import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/mv-player-logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(
    () => searchParams.get("email") || sessionStorage.getItem("mv_recovery_email") || "",
    [searchParams],
  );

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/verify-code`,
      });

      if (error) throw error;

      sessionStorage.setItem("mv_recovery_email", normalizedEmail);
      sessionStorage.removeItem("mv_recovery_verified");
      toast.success("Recovery code sent to your email");
      navigate("/verify-code");
    } catch (err: any) {
      toast.error(err.message || "Failed to send recovery code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="MV Player" className="h-16 w-16" />
          <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a 6-digit recovery code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Recovery Code"}
          </Button>
        </form>

        <Button variant="ghost" className="w-full" onClick={() => navigate("/login")}>Back to Login</Button>
      </div>
    </div>
  );
};

export default ForgotPassword;