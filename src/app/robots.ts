import { MetadataRoute } from 'next';
import { cmsService } from '@/services/cms/cms.service';

export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const robotsText = await cmsService.getRobots();
    // Simple parser for robots.txt if needed, but Next.js expects an object
    // For simplicity, we return a default if CMS fails, or we could use the CMS content
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    };
  } catch (error) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    };
  }
}
