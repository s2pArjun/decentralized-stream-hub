import { motion } from 'framer-motion';
import { Play, Info, Clock, Tag } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface MediaCardProps {
  item: MediaItem;
  index?: number;
}

export const MediaCard = ({ item, index = 0 }: MediaCardProps) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/player/${item.id}`);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer"
      onClick={handlePlay}
    >
      {/* Thumbnail */}
      <div className="absolute inset-0 bg-muted">
        {item.thumbnailURL ? (
          <img
            src={item.thumbnailURL}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Duration badge */}
      {item.duration && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(item.duration)}
        </div>
      )}

      {/* Type badge */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary/80 backdrop-blur-sm text-xs font-medium uppercase">
        {item.type}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {item.title}
        </h3>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {item.category && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Tag className="w-3 h-3" />
            {item.category}
          </div>
        )}

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors text-primary-foreground text-sm font-medium"
          >
            <Play className="w-4 h-4 fill-current" />
            Play
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Info className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};
