import { Metadata } from 'next';
import { SeoPayload } from '@/types/cms';

/**
 * Adapts CMS SEO payload to Next.js Metadata API
 */
export function buildMetadataFromSeo(seo: SeoPayload, locale: string): Metadata {
  if (!seo) return {};

  return {
    title: seo.meta_title,
    description: seo.meta_description,
    alternates: {
      canonical: seo.canonical_url,
      languages: seo.alternates,
    },
    robots: {
      index: seo.robots.index,
      follow: seo.robots.follow,
      googleBot: {
        index: seo.robots.index,
        follow: seo.robots.follow,
      },
    },
    openGraph: {
      title: seo.og.title,
      description: seo.og.description,
      images: seo.og.image ? [{ url: seo.og.image }] : [],
      type: seo.og.type as 'website' | 'article',
      locale: locale,
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: seo.twitter.image ? [seo.twitter.image] : [],
    },
  };
}

/**
 * Helper to build robots object for Next.js
 */
export function buildRobotsMetadata(seo: SeoPayload) {
  return {
    index: seo.robots.index,
    follow: seo.robots.follow,
    nocache: true,
    googleBot: {
      index: seo.robots.index,
      follow: seo.robots.follow,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}
