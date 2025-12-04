import { motion } from 'framer-motion';

export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="aspect-video rounded-lg skeleton"
        />
      ))}
    </div>
  );
};

export const PlayerSkeleton = () => {
  return (
    <div className="w-full aspect-video rounded-lg skeleton" />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="aspect-video rounded-lg skeleton" />
      <div className="h-4 w-3/4 rounded skeleton" />
      <div className="h-3 w-1/2 rounded skeleton" />
    </div>
  );
};
