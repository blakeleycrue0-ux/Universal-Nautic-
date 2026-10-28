import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// Dominio definitivo pendiente: se define con la variable SITE_URL en Netlify.
const site = process.env.SITE_URL || 'https://universalnautic.netlify.app'

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/presupuesto/gracias/') && !page.includes('/contacto/gracias/'),
    }),
  ],
  build: { format: 'directory' },
})
