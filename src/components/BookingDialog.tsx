import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, Booking } from "@/types/video";
import { store } from "@/store/appStore";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  video: Video | null;
  type: "watch" | "download";
}

const BookingDialog = ({ open, onOpenChange, video, type }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [place, setPlace] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !place.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (!video) return;

    const booking: Booking = {
      id: crypto.randomUUID(),
      videoId: video.id,
      videoName: video.name,
      type,
      name: name.trim(),
      email: email.trim(),
      place: place.trim(),
      createdAt: new Date().toISOString(),
      notified: false,
    };
    store.addBooking(booking);
    toast.success("Booking submitted! You will receive code information via email.");
    setName("");
    setEmail("");
    setPlace("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Book {type === "watch" ? "Watch" : "Download"} Code</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-2">
          Book a code for <span className="font-semibold text-foreground">{video?.name}</span>
        </p>
        <div className="space-y-3">
          <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Place" value={place} onChange={(e) => setPlace(e.target.value)} />
          <Button className="w-full" onClick={handleSubmit}>Submit Booking</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
