import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { Layout } from '@/components/layout/Layout';
import { ArrowLeft, Tag, Clock, Calendar, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const Player = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { catalog, connected, getItemById } = useGunCatalog();

  const item = id ? getItemById(id) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!item) {
    return (
      <Layout connected={connected}>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This content may have been removed or the link is invalid.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary rounded-lg text-primary-foreground font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout connected={connected}>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Catalog
        </motion.button>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <VideoPlayer item={item} />
        </motion.div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {item.category && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {item.category}
                  </span>
                )}
                {item.addedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.addedAt)}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs uppercase font-medium">
                  {item.type}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>

          {item.description && (
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Technical info */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Technical Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="glass-elevated rounded-lg p-3">
                <span className="text-muted-foreground">Magnet URI</span>
                <p className="font-mono text-xs text-foreground truncate mt-1">
                  {item.magnetURI}
                </p>
              </div>
              <div className="glass-elevated rounded-lg p-3">
                <span className="text-muted-foreground">IPFS CID</span>
                <p className="font-mono text-xs text-foreground mt-1">
                  {item.ipfsCID}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Player;
