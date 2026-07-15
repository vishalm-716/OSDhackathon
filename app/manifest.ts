import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aura Local AI Workspace',
    short_name: 'Aura AI',
    description: 'Privacy-first multimodal AI workspace running directly on your device.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
