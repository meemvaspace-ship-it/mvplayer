import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Clock, LogIn, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      // Verify current password by re-signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user!.email,
        password: currentPassword,
      });
      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Settings</h1>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Account */}
        {user ? (
          <div className="p-4 bg-card border border-border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="gap-1">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Change Password</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogIn className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Sign In</p>
                <p className="text-xs text-muted-foreground">Sign in to save favorites & history</p>
              </div>
            </div>
          </button>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>

        {/* Watch History */}
        <button
          onClick={() => navigate("/history")}
          className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Watch History</p>
              <p className="text-xs text-muted-foreground">View your watching timeline</p>
            </div>
          </div>
        </button>

        <Separator />

        {/* Terms */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="font-semibold mb-3 text-foreground">Terms and Conditions</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Welcome to MV Player. By accessing or using this application, you agree to the following terms:</p>
            <p><strong>1. Content Ownership:</strong> All videos, images, and media content available on MV Player are owned by their respective creators and rights holders.</p>
            <p><strong>2. Access Codes:</strong> Each video requires a unique access code for viewing. These codes are personal and non-transferable.</p>
            <p><strong>3. Payments & Refunds:</strong> All payments made for access codes are final and non-refundable once activated.</p>
            <p><strong>4. User Conduct:</strong> Users agree not to use MV Player for any unlawful purposes.</p>
            <p><strong>5. Service Availability:</strong> MV Player reserves the right to modify or suspend service at any time.</p>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="font-semibold mb-3 text-foreground">Privacy Policy</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>MV Player is committed to protecting your privacy.</p>
            <p><strong>1. Information We Collect:</strong> Name, email, and authentication data when you sign in.</p>
            <p><strong>2. How We Use Your Information:</strong> For processing bookings and improving services. We do not sell your data.</p>
            <p><strong>3. Data Security:</strong> All data is stored securely with industry-standard encryption.</p>
            <p><strong>4. Your Rights:</strong> You may request deletion of your data at any time.</p>
          </div>
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                minLength={6}
                className="pr-10"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button className="w-full" onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
