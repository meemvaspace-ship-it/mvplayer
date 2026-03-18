import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/mv-player-logo.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [clickCount, setClickCount] = useState(0);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout } = useAuth();

  const handleLogoClick = () => {
    const next = clickCount + 1;
    if (next >= 11) {
      setShowPinDialog(true);
      setClickCount(0);
    } else {
      setClickCount(next);
    }
  };

  const handlePinSubmit = () => {
    if (pin === "74159") {
      setShowPinDialog(false);
      setPin("");
      setPinError(false);
      navigate("/admin");
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="MV Player" className="h-9 w-9" />
          <span className="text-lg font-bold text-primary">MV Player</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={login} className="gap-2">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          )}
        </div>
      </header>

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Admin Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
            />
            {pinError && <p className="text-sm text-destructive">Incorrect PIN</p>}
            <Button className="w-full" onClick={handlePinSubmit}>Enter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
