import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'FotoOwl Headless Media SDK',
  description: 'Documentation for FotoOwl Headless Media SDK & Headless UI Primitives',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'SDK Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' },
      { text: 'GitHub', link: 'https://github.com/Technical-Siddhi/fotowl-headless-media-sdk' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'SDK',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Usage', link: '/guide/usage' },
            { text: 'Events', link: '/guide/events' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'MediaGrid', link: '/components/media-grid' },
            { text: 'MediaCard', link: '/components/media-card' },
            { text: 'MediaSearch', link: '/components/media-search' },
            { text: 'MediaPagination', link: '/components/media-pagination' },
            { text: 'MediaModal', link: '/components/media-modal' },
          ],
        },
      ],
    },
  },
});
