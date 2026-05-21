import { MetadataRoute } from 'next';
import { cmsService } from '@/services/cms/cms.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'laratenant.com';
  
  try {
    const entries = await cmsService.getSitemap(domain);
    
    return entries.map((entry) => ({
      url: entry.url,
      lastModified: new Date(entry.lastmod),
      changeFrequency: entry.changefreq as any,
      priority: entry.priority,
    }));
  } catch (error) {
    // Fallback sitemap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laratenant.com';
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
