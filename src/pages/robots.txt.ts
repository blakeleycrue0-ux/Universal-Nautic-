import type { APIRoute } from 'astro'

// Se permite el rastreo siempre: mientras PUBLIC_INDEXABLE no sea "true",
// cada página lleva <meta name="robots" content="noindex">, que Google solo ve si puede rastrearla.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
