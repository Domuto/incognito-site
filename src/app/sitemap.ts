import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.incognito404.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const routes = ['', '/menu', '/about', '/contact', '/tour', '/drop', '/pool']

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
