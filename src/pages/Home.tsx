import { motion } from 'framer-motion';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import { CatalogGrid } from '@/components/catalog/CatalogGrid';
import { FeaturedHero } from '@/components/catalog/FeaturedHero';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Layout } from '@/components/layout/Layout';
import { Sparkles, Zap, Globe, Shield } from 'lucide-react';
import { addSampleContent } from '@/lib/gun';

const Home = () => {
  const { catalog, loading, connected } = useGunCatalog();
  const featuredItem = catalog[0];
    const handleAddSamples = async () => {
    try {
      await addSampleContent();
      toast.success('Sample content added!');
    } catch (err) {
      toast.error('Failed to add samples');
    }
  };


  return (
    <Layout connected={connected}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section when no content */}
        {!loading && catalog.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 glow-primary"
              >
                <Zap className="w-12 h-12 text-primary-foreground" />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                Welcome to{' '}
                <span className="text-gradient">StreamPeer</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
              >
                A fully decentralized peer-to-peer media streaming platform. 
                Share and discover content without any central server.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                <div className="glass p-6 rounded-xl">
                  <Globe className="w-8 h-8 text-primary mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">P2P Streaming</h3>
                  <p className="text-sm text-muted-foreground">
                    Stream directly from peers using WebTorrent technology
                  </p>
                </div>
                <div className="glass p-6 rounded-xl">
                  <Shield className="w-8 h-8 text-secondary mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">Decentralized</h3>
                  <p className="text-sm text-muted-foreground">
                    No central server - catalog syncs via Gun.js
                  </p>
                </div>
                <div className="glass p-6 rounded-xl">
                  <Sparkles className="w-8 h-8 text-status-warning mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">IPFS Fallback</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic fallback to IPFS when no peers available
                  </p>
                </div>
              </motion.div>

              <motion.button
  onClick={handleAddSamples}
  whileHover={{ scale: 1.05 }}
  className="mt-4 px-6 py-3 bg-muted rounded-lg hover:bg-muted/80"
>
  Restore Sample Videos
</motion.button>

              <motion.a
                href="/admin"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-primary-foreground font-semibold text-lg glow-primary"
              >
                <Sparkles className="w-5 h-5" />
                Add First Content
              </motion.a>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="py-8">
            <LoadingSkeleton />
          </div>
        )}

        {/* Content catalog */}
        {!loading && catalog.length > 0 && (
          <>
            {/* Featured hero */}
            {featuredItem && <FeaturedHero item={featuredItem} />}

            {/* Section title */}
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">All Content</h2>
              <span className="px-2 py-0.5 rounded-full bg-muted text-sm text-muted-foreground">
                {catalog.length} items
              </span>
            </div>

            {/* Grid */}
            <CatalogGrid items={catalog} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
