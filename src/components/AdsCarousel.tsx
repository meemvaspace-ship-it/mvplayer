import { useState, useEffect } from "react";
import { Ad } from "@/types/video";

interface Props {
  ads: Ad[];
}

const AdsCarousel = ({ ads }: Props) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-card border border-border mb-6">
      <div className="relative aspect-[21/9] sm:aspect-[3/1]">
        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-sm font-bold text-foreground">{ad.title}</h3>
          {ad.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{ad.subtitle}</p>}
        </div>
      </div>
      {ads.length > 1 && (
        <div className="absolute bottom-1 right-3 flex gap-1">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsCarousel;
