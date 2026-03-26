import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Video } from "@/types/video";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  video: Video | null;
}

const VideoPlayer = ({ open, onOpenChange, video }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
  }, [video?.id, open]);

  const handleDownload = async () => {
    if (!video) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      const response = await fetch(video.videoUrl);
      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body || !total) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${video.name}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Download complete!");
        return;
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        setDownloadProgress(Math.round((received / total) * 100));
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${video.name}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download complete!");
    } catch {
      toast.error("Failed to download video");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

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
        <div className="flex justify-end p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
