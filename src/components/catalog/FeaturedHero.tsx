import { motion } from 'framer-motion';
import { Play, Info, Star } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface FeaturedHeroProps {
  item: MediaItem;
}

export const FeaturedHero = ({ item }: FeaturedHeroProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[70vh] min-h-[500px] rounded-2xl overflow-hidden mb-8"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {item.thumbnailURL ? (
          <img
            src={item.thumbnailURL}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-secondary/40" />
        )}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase">
              Featured
            </span>
            <span className="flex items-center gap-1 text-status-warning text-sm">
              <Star className="w-4 h-4 fill-current" />
              P2P Streaming
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            {item.title}
          </h1>

          {/* Description */}
          {item.description && (
            <p className="text-lg text-muted-foreground mb-6 line-clamp-3 max-w-xl">
              {item.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/player/${item.id}`)}
              className="flex items-center gap-2 px-8 py-4 bg-primary rounded-xl hover:bg-primary/90 transition-colors text-primary-foreground font-semibold text-lg glow-primary"
            >
              <Play className="w-6 h-6 fill-current" />
              Play Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-4 glass rounded-xl hover:bg-muted transition-colors font-medium"
            >
              <Info className="w-5 h-5" />
              More Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
