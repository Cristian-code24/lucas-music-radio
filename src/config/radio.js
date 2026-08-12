/**
 * Central radio configuration
 * All radio-specific data in one place for easy customization
 */

const radioConfig = {
  // Station identity
  name: import.meta.env.VITE_RADIO_NAME || 'Lucas Music',
  tagline: 'Tu frecuencia digital',
  description: import.meta.env.VITE_RADIO_DESCRIPTION || 'Tu emisora online de música y entretenimiento',
  genre: 'Variada',
  location: 'Online',
  frequency: 'Web — Streaming 24/7',

  // Stream configuration
  streamUrl: import.meta.env.VITE_RADIO_STREAM_URL || 'http://uk21freenew.listen2myradio.com:30266/;',

  // Listener links (alternative access points)
  listenerLinks: [
    'lucasmusic.radio12345.com',
    'lucasmusic.radiostream321.com',
    'lucasmusic.radiostream123.com',
  ],

  // Social media links (empty = not shown)
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
  },

  // Contact
  contact: {
    email: '',
    phone: '',
  },

  // SEO
  seo: {
    title: null, // defaults to radio name
    description: null, // defaults to radio description
    ogImage: '/og-image.png',
    url: '',
  },

  // Reconnection settings
  reconnect: {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  },
};

export default radioConfig;
