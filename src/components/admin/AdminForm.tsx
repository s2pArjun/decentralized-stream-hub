import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import { validateMediaItem, generateId } from '@/lib/validation';
import { MediaItem } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Loader2, Film, Music, Link2, Hash, Image, FileText } from 'lucide-react';

export const AdminForm = () => {
  const { addContent } = useGunCatalog();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    magnetURI: '',
    ipfsCID: '',
    type: 'video' as 'video' | 'audio',
    thumbnailURL: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const item: Partial<MediaItem> = {
      id: generateId(),
      ...formData,
      addedAt: Date.now(),
    };

    const error = validateMediaItem(item);
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      await addContent(item as MediaItem);
      toast.success('Content added to decentralized catalog!');

      setFormData({
        title: '',
        description: '',
        magnetURI: '',
        ipfsCID: '',
        type: 'video',
        thumbnailURL: '',
        category: '',
      });
    } catch (err) {
      toast.error('Failed to add content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 glass rounded-xl"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Add New Content</h2>
          <p className="text-sm text-muted-foreground">Share media on the P2P network</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClass}
            placeholder="Enter content title"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={inputClass}
            rows={3}
            placeholder="Describe your content"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            Magnet URI *
          </label>
          <input
            type="text"
            value={formData.magnetURI}
            onChange={(e) => setFormData({ ...formData, magnetURI: e.target.value })}
            className={`${inputClass} font-mono text-sm`}
            placeholder="magnet:?xt=urn:btih:..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            IPFS CID *
          </label>
          <input
            type="text"
            value={formData.ipfsCID}
            onChange={(e) => setFormData({ ...formData, ipfsCID: e.target.value })}
            className={`${inputClass} font-mono text-sm`}
            placeholder="Qm... or bafy..."
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            Thumbnail URL
          </label>
          <input
            type="url"
            value={formData.thumbnailURL}
            onChange={(e) => setFormData({ ...formData, thumbnailURL: e.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={inputClass}
            placeholder="e.g., Movies, Music, Documentary"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium mb-3">
            Type *
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'video' })}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                formData.type === 'video'
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-surface border-border hover:border-primary/50'
              }`}
            >
              <Film className="w-5 h-5" />
              Video
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'audio' })}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                formData.type === 'audio'
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-surface border-border hover:border-primary/50'
              }`}
            >
              <Music className="w-5 h-5" />
              Audio
            </button>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-primary-foreground flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding to Network...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add to Catalog
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
