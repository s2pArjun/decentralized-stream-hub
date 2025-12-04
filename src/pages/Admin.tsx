import { motion } from 'framer-motion';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import { AdminForm } from '@/components/admin/AdminForm';
import { Layout } from '@/components/layout/Layout';
import { Trash2, ExternalLink, Film, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { catalog, connected, removeContent } = useGunCatalog();
  const navigate = useNavigate();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

    try {
      await removeContent(id);
      toast.success('Content removed from catalog');
    } catch (err) {
      toast.error('Failed to remove content');
    }
  };

  return (
    <Layout connected={connected}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Add and manage content on the decentralized network
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add form */}
          <div>
            <AdminForm />
          </div>

          {/* Content list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold">Current Catalog</h2>
              <span className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                {catalog.length} items
              </span>
            </div>

            {catalog.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <Film className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No content in the catalog yet. Add your first item!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {catalog.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                      {item.thumbnailURL ? (
                        <img
                          src={item.thumbnailURL}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {item.type === 'video' ? (
                            <Film className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Music className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.type} • Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/player/${item.id}`)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="View"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
