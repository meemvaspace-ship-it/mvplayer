import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

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
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-1">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
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
            <p><strong>1. Content Ownership:</strong> All videos, images, and media content available on MV Player are owned by their respective creators and rights holders. Unauthorized copying, distribution, or reproduction of any content is strictly prohibited and may result in legal action.</p>
            <p><strong>2. Access Codes:</strong> Each video requires a unique access code for viewing. These codes are personal, non-transferable, and intended for single-user use only. Sharing, reselling, or distributing access codes to third parties is a violation of these terms and may result in permanent suspension of your account.</p>
            <p><strong>3. Payments & Refunds:</strong> All payments made for access codes are final and non-refundable once the code has been activated or used. Pricing is subject to change without prior notice. Users are responsible for verifying prices before making a purchase.</p>
            <p><strong>4. User Conduct:</strong> Users agree not to use MV Player for any unlawful purposes, including but not limited to piracy, harassment, or unauthorized data collection. Any misuse of the platform may result in immediate termination of access.</p>
            <p><strong>5. Service Availability:</strong> MV Player reserves the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We do not guarantee uninterrupted access to our services.</p>
            <p><strong>6. Age Requirement:</strong> You must be at least 13 years of age to use MV Player. By using this application, you confirm that you meet this age requirement.</p>
            <p><strong>7. Limitation of Liability:</strong> MV Player shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid by you for the specific service in question.</p>
            <p><strong>8. Modifications to Terms:</strong> We reserve the right to update these terms at any time. Continued use of MV Player after any changes constitutes acceptance of the updated terms.</p>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="font-semibold mb-3 text-foreground">Privacy Policy</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>MV Player is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
            <p><strong>1. Information We Collect:</strong> When you use MV Player, we may collect your name, email address, and location information through our booking system. We also collect authentication data when you sign in, including your profile name and email address.</p>
            <p><strong>2. How We Use Your Information:</strong> Your personal data is used solely for the purpose of processing code bookings, delivering access codes, and improving our services. We do not sell, rent, or trade your personal information to any third parties.</p>
            <p><strong>3. Data Storage & Security:</strong> All user data is stored securely using industry-standard encryption and cloud infrastructure. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or deletion.</p>
            <p><strong>4. Cookies & Local Storage:</strong> We use local storage on your device to save your theme preferences and enhance your browsing experience. No tracking cookies are used for advertising purposes.</p>
            <p><strong>5. Data Retention:</strong> We retain your booking information for as long as it is necessary to provide our services. You may request deletion of your data at any time by contacting our support team.</p>
            <p><strong>6. Children's Privacy:</strong> MV Player does not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will take immediate steps to delete it.</p>
            <p><strong>7. Your Rights:</strong> You have the right to access, correct, or delete your personal data at any time. You may also withdraw your consent to data processing, though this may affect your ability to use certain features of the application.</p>
            <p><strong>8. Contact Us:</strong> If you have any questions or concerns about this Privacy Policy, please reach out through our booking system or contact the application administrator.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
