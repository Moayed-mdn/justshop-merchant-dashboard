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

/**
 * Generates Organization structured data.
 */
export function buildOrgJsonLd(): string {
  const SITE_NAME = 'LaraTenant Commerce';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    ...(SITE_URL ? { url: SITE_URL, logo: `${SITE_URL}/next.svg` } : {}),
  };

  return JSON.stringify(schema);
}

/**
 * Generates SoftwareApplication structured data.
 */
export function buildSoftwareJsonLd(): string {
  const SITE_NAME = 'LaraTenant Commerce';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    ...(SITE_URL ? { url: SITE_URL } : {}),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return JSON.stringify(schema);
}
