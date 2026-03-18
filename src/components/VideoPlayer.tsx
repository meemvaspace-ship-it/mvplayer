import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video } from "@/types/video";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  video: Video | null;
}

const VideoPlayer = ({ open, onOpenChange, video }: Props) => {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{video.name}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-black">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
