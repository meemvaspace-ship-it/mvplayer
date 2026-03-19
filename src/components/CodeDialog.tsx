import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  video: Video | null;
  onSuccess: () => void;
  onBookCode: () => void;
}

const CodeDialog = ({ open, onOpenChange, video, onSuccess, onBookCode }: Props) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (code === video?.watchCode) {
      setCode("");
      setError(false);
      onSuccess();
      onOpenChange(false);
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setCode(""); setError(false); } }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Enter Watch Code</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Enter the code for <span className="font-semibold text-foreground">{video?.name}</span>
        </p>
        <div className="space-y-3">
          <Input
            placeholder="Enter code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <p className="text-sm text-destructive">Invalid code. Need a code? Book one below.</p>}
          <Button className="w-full" onClick={handleSubmit}>Submit</Button>
          <Button variant="outline" className="w-full" onClick={onBookCode}>
            Book a Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDialog;
