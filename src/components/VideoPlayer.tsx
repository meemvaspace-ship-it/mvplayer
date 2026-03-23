import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video } from "@/types/video";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  video: Video | null;
}

const VideoPlayer = ({ open, onOpenChange, video }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [video?.id, open]);

  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{video.name}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm text-foreground z-10">
              Loading video...
            </div>
          )}
          <video
            src={video.videoUrl}
            controls
            autoPlay
            preload="auto"
            playsInline
            className="w-full h-full"
            onLoadStart={() => setIsLoading(true)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            onLoadedData={() => setIsLoading(false)}
            onError={(e) => console.error("Video load error:", e)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
