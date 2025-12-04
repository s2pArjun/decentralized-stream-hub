import { motion } from 'framer-motion';
import { MediaItem } from '@/lib/types';
import { MediaCard } from './MediaCard';

interface CatalogGridProps {
  items: MediaItem[];
}

export const CatalogGrid = ({ items }: CatalogGridProps) => {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">📺</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No content yet</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Be the first to add content to the decentralized catalog! 
          Go to the Admin panel to add your first video.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {items.map((item, index) => (
        <MediaCard key={item.id} item={item} index={index} />
      ))}
    </motion.div>
  );
};
