import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Settings</h1>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
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

        <Separator />

        {/* Terms */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="font-semibold mb-3 text-foreground">Terms and Conditions</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>By using MV Player, you agree to these terms:</p>
            <p>1. All content is owned by the respective creators. Unauthorized reproduction is prohibited.</p>
            <p>2. Access codes are personal and non-transferable. Sharing codes may result in account suspension.</p>
            <p>3. Payments made for codes are non-refundable once the code has been used.</p>
            <p>4. MV Player reserves the right to modify or remove content at any time.</p>
            <p>5. Users must be 13 years or older to use this service.</p>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-4 bg-card border border-border rounded-lg">
          <h2 className="font-semibold mb-3 text-foreground">Privacy Policy</h2>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>MV Player respects your privacy:</p>
            <p>1. We collect your name, email, and location only for booking purposes.</p>
            <p>2. Your personal data is never shared with third parties without consent.</p>
            <p>3. We use Google Authentication for secure sign-in.</p>
            <p>4. Viewing history and preferences are stored locally on your device.</p>
            <p>5. You may request deletion of your data by contacting support.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
