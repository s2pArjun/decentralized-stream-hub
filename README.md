# P2P Stream - Decentralized Media Platform

A cutting-edge fully decentralized peer-to-peer media streaming platform built with React, WebTorrent, IPFS, and Gun.js. Stream videos and audio directly between browsers with a shared, real-time catalog that syncs across all users—no central server required!

## 🌟 Features

- 🌐 **True Decentralization**: No central server—catalog syncs via Gun.js P2P database
- 📡 **Real-time Sync**: Content added by anyone appears for everyone instantly
- 🔗 **P2P Streaming**: Direct browser-to-browser streaming using WebTorrent
- 📦 **IPFS Fallback**: Automatic fallback to IPFS gateways when no peers available
- 📺 **HLS Support**: Adaptive streaming for smooth playback
- 📊 **Live Stats**: Real-time peer count, download/upload speeds, Gun.js connection status
- ⚙️ **Admin Panel**: Easy content management—add once, visible to all users
- 💾 **Offline Support**: Works offline with locally cached catalog
- 🎨 **Netflix-Style UI**: Beautiful dark theme with smooth animations
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components, Framer Motion
- **P2P Streaming**: WebTorrent (browser build)
- **Decentralized Database**: Gun.js with public relay peers
- **IPFS**: Public gateway integration
- **Video**: HLS.js for adaptive streaming
- **State**: React hooks + Gun.js reactive updates

## 🔥 What Makes This Different?

Unlike traditional platforms (YouTube, Netflix) or semi-decentralized apps, P2P Stream has NO central catalog server:

| Feature | Traditional | Semi-Decentralized | P2P Stream |
|---------|-------------|-------------------|------------|
| Content Storage | Central servers | P2P (IPFS/Torrent) | ✅ P2P (IPFS/Torrent) |
| Catalog/Metadata | Central database | Central database | ✅ Decentralized (Gun.js) |
| Real-time Updates | Server push | Server push | ✅ P2P sync (no server) |
| Offline Support | ❌ | Limited | ✅ Full caching |

**Key Innovation**: When User A adds a video, User B sees it automatically via Gun.js—no API calls, no servers, pure peer-to-peer magic!

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd p2p-stream

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:8080

## 🎯 Usage

### Browsing the Catalog

1. Open the app—Gun.js connects to relay peers automatically
2. See the connection status indicator (top-right corner)
3. Browse content added by users worldwide in real-time
4. Use search bar to filter by title/description
5. Filter by media type (video/audio)
6. Click "Play" to start streaming

### How Gun.js Works

```
┌──────────────┐         Gun.js Relay Peers          ┌──────────────┐
│   User A     │◄──────────────────────────────────►│   User B     │
│  (Browser)   │         (Public servers)            │  (Browser)   │
└──────┬───────┘                                     └──────┬───────┘
       │                                                    │
       │  Adds "My Video"                                  │
       └───────────────►  Gun.js syncs data  ─────────────►│
                         Real-time update!          Sees "My Video"
```

**When you open the app:**
1. Gun.js connects to multiple public relay peers for redundancy
2. Downloads the shared catalog from the P2P network
3. Caches everything locally for offline access
4. Subscribes to real-time updates from other users

**When someone adds content:**
1. New item saved to Gun.js (syncs to all relay peers)
2. All connected users receive the update instantly
3. Your browser updates the catalog automatically
4. Works even if the person who added it goes offline!

### Streaming Media

1. Click any media item to open the player
2. The app attempts WebTorrent P2P streaming first
3. Watch real-time stats:
   - **Peers**: Number of WebTorrent peers
   - **Speed**: Download/upload rates
   - **Source**: WebTorrent or IPFS indicator
   - **Gun.js**: Connection status and peer count
4. If no WebTorrent peers available, auto-fallback to IPFS (8s timeout)
5. Continue watching while seeding to help others!

### Adding Content (Admin Panel)

1. Navigate to Admin panel via the header
2. Check Gun.js connection status (green = ready)
3. Fill out the form:
   - **Title** (required): Display name
   - **Description**: Brief summary
   - **Magnet URI** (required): WebTorrent magnet link
   - **IPFS CID** (required): Content identifier
   - **Type**: Video or Audio
   - **Thumbnail**: Image URL (optional)
   - **Duration**: e.g., "2:30" (optional)
4. Click "Add Content"
5. **Magic happens**: Content syncs to Gun.js relay peers
6. All users see it instantly in their catalog!
7. Manage your content (view, copy magnet/CID, delete)

### Testing Multi-User Sync

To see Gun.js in action:

```bash
# Open two browser windows side-by-side
Window 1: http://localhost:8080
Window 2: http://localhost:8080/admin

# In Window 2 (Admin):
1. Add a new video
2. Click "Add Content"

# In Window 1 (Home):
👀 Watch it appear in the catalog automatically!
⚡ No refresh needed—real-time sync!
```

## 🔑 Getting Magnet URIs and IPFS CIDs

### Creating Magnet Links

**Option 1: WebTorrent Desktop**
1. Download WebTorrent Desktop
2. Drag & drop your video file
3. Copy the magnet URI
4. ⚠️ Make sure it includes WSS trackers!

**Option 2: Command Line**
```bash
npm install -g webtorrent-cli
webtorrent seed path/to/video.mp4
# Copy the generated magnet URI
```

### Getting IPFS CIDs

**Option 1: Pinata (Easiest)**
1. Sign up at pinata.cloud (free tier)
2. Upload your file via dashboard
3. Copy the CID (starts with "Qm..." or "bafy...")

**Option 2: IPFS Desktop**
1. Download IPFS Desktop
2. Add file via "Import"
3. Copy the CID from file info

**Option 3: Web3.Storage**
1. Sign up at web3.storage
2. Upload file
3. Copy the CID

### Important: WSS Trackers

For browser compatibility, ensure magnet URIs include WebSocket trackers:
- `wss://tracker.btorrent.xyz`
- `wss://tracker.openwebtorrent.com`
- `wss://tracker.webtorrent.dev`
- `wss://tracker.fastcast.nz`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React)                       │
└───────────┬─────────────────────────────────────┬───────────┘
            │                                     │
            │                                     │
    ┌───────▼────────┐                   ┌───────▼────────┐
    │  Gun.js Client │                   │ WebTorrent      │
    │  (Catalog DB)  │                   │ (P2P Streaming) │
    └───────┬────────┘                   └───────┬─────────┘
            │                                    │
            │                                    │
    ┌───────▼─────────────────┐          ┌──────▼──────────┐
    │  Gun.js Relay Peers     │          │  WSS Trackers   │
    │  (Public servers)       │          │  (Peer discover)│
    │  ├─ gun-manhattan       │          │  ├─ btorrent    │
    │  ├─ gun-us              │          │  ├─ openwebtorr │
    │  └─ gunjs.herokuapp     │          │  └─ webtorrent  │
    └─────────────────────────┘          └─────────────────┘
            │                                    │
            │                                    │
       Real-time sync                      Data exchange
       between all users                   between browsers
            │                                    │
            │                                    │
    ┌───────▼─────────────────┐          ┌──────▼──────────┐
    │  Other Users' Browsers  │◄─────────┤  IPFS Gateway   │
    │  (Auto-update catalog)  │  Fallback│  (ipfs.io, etc) │
    └─────────────────────────┘          └─────────────────┘
```

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation with connection status
│   │   └── ConnectionStatus.tsx # Gun.js + WebTorrent status
│   ├── catalog/
│   │   ├── CatalogGrid.tsx     # Media grid with real-time updates
│   │   ├── MediaCard.tsx       # Netflix-style hover cards
│   │   └── SearchBar.tsx       # Search/filter
│   ├── player/
│   │   ├── VideoPlayer.tsx     # P2P player with stats
│   │   └── StreamStats.tsx     # WebTorrent + Gun.js stats
│   └── admin/
│       ├── AdminForm.tsx       # Add content to Gun.js
│       └── ContentList.tsx     # Manage added content
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── gun.ts                  # 🔥 Gun.js setup & helpers
│   ├── webtorrent.ts           # WebTorrent utilities
│   ├── ipfs.ts                 # IPFS gateway helpers
│   └── storage.ts              # LocalStorage caching
├── hooks/
│   ├── useGunCatalog.ts        # 🔥 Real-time catalog hook
│   └── useWebTorrent.ts        # P2P streaming hook
└── pages/
    ├── Home.tsx                # Catalog page
    ├── Player.tsx              # Player page
    └── Admin.tsx               # Admin panel
```

## 🧪 Testing Gun.js Sync

### Test 1: Real-time Sync
1. Open app in two browser tabs/windows
2. Tab 1: Go to Admin → Add new content
3. Tab 2: Watch homepage—new content appears automatically!
4. No refresh needed—Gun.js syncs in real-time

### Test 2: Offline Resilience
1. Open app and load catalog
2. Go offline (disable network)
3. App still works—shows cached content
4. Go back online—syncs any missed updates

### Test 3: Multi-Device Sync
1. Open app on your phone
2. Open app on your laptop
3. Add content on phone
4. Watch it appear on laptop instantly!

### Test 4: Persistence
1. Add content via Admin panel
2. Close browser completely
3. Reopen app next day
4. Content is still there (Gun.js + localStorage)

## 🚀 Deployment

### Static Hosting (Recommended)

```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or Cloudflare Pages
# No server needed—100% static files!
```

### Environment Variables (Optional)

```env
# .env
VITE_APP_NAME=P2P Stream
VITE_GUN_NAMESPACE=p2p-media-catalog-v1
VITE_GUN_RELAY_PEERS=https://gun-manhattan.herokuapp.com/gun,...
VITE_ENABLE_ANALYTICS=false
```

### Custom Gun.js Relay (Production)

For production use, run your own Gun.js relay:

```bash
npm install gun
node relay.js # See Gun.js docs for setup
```

## 🤝 Contributing

Contributions welcome! Priority areas:

**Gun.js Features**:
- Content moderation system
- User reputation/voting
- Private catalogs with Gun.js SEA
- Custom relay server setup guide

**P2P Improvements**:
- Additional IPFS gateways
- Torrent creation tools
- Performance optimizations

- Better error handling

## 📝 License

This project is open source and available under the MIT License.
