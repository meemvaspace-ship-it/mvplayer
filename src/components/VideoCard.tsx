import { Video } from "@/types/video";
import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  video: Video;
  onWatch: (v: Video) => void;
  onDownload: (v: Video) => void;
}

const VideoCard = ({ video, onWatch, onDownload }: Props) => {
  return (
    <div className="group rounded-lg overflow-hidden bg-card border border-border transition-colors hover:border-primary/40">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {video.coverImage ? (
          <img src={video.coverImage} alt={video.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">No Cover</div>
        )}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button size="sm" onClick={() => onWatch(video)} className="gap-1">
            <Play className="h-4 w-4" /> Watch
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDownload(video)} className="gap-1">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate text-foreground">{video.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {video.playlist && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{video.playlist}</span>
          )}
          {video.category && (
            <span className="text-xs text-muted-foreground">{video.category}</span>
          )}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
          <span>Watch: ₹{video.watchPrice}</span>
          <span>Download: ₹{video.downloadPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
