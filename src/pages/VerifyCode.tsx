import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import logo from "@/assets/mv-player-logo.png";

const getHashParams = () => new URLSearchParams(window.location.hash.replace(/^#/, ""));

const VerifyCode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(true);

  const hashParams = useMemo(() => getHashParams(), []);
  const email = searchParams.get("email") || sessionStorage.getItem("mv_recovery_email") || "";
  const tokenHash = searchParams.get("token_hash") || hashParams.get("token_hash") || "";
  const recoveryType = searchParams.get("type") || hashParams.get("type") || "";

  const finishSuccess = () => {
    sessionStorage.setItem("mv_recovery_verified", "true");
    if (email) sessionStorage.setItem("mv_recovery_email", email);
    toast.success("Code verified successfully");
    navigate("/reset-password");
  };

  useEffect(() => {
    const verifyTokenHash = async () => {
      if (!tokenHash || recoveryType !== "recovery") {
        setAutoVerifying(false);
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        });

        if (error) throw error;
        finishSuccess();
      } catch (err: any) {
        toast.error(err.message || "Recovery link is invalid or expired");
      } finally {
        setAutoVerifying(false);
      }
    };

    verifyTokenHash();
  }, [tokenHash, recoveryType]);

  const handleVerify = async () => {
    if (!email) {
      toast.error("Please restart recovery and enter your email again");
      navigate("/forgot-password");
      return;
    }

    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }

    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "recovery",
      });

      if (error) throw error;
      finishSuccess();
    } catch (err: any) {
      toast.error(err.message || "Invalid recovery code");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email again");
      navigate("/forgot-password");
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/verify-code`,
      });

      if (error) throw error;
      setCode("");
      toast.success("A new recovery code was sent");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  if (autoVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <img src={logo} alt="MV Player" className="h-16 w-16 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">Verifying Code</h1>
          <p className="text-sm text-muted-foreground">Please wait while we verify your recovery request.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="MV Player" className="h-16 w-16" />
          <h1 className="text-2xl font-bold text-primary">Verify Code</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to {email || "your email"}.
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={handleVerify} disabled={verifying || code.length !== 6}>
            {verifying ? "Verifying..." : "Verify Code"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleResend} disabled={resending}>
            {resending ? "Resending..." : "Resend Code"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate("/forgot-password")}>Use another email</Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;