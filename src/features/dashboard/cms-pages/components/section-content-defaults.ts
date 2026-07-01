/**
 * Default content and settings values for each section type.
 * Ensures sections start with the correct structure expected by storefront renderers.
 */

export function defaultContentFor(type: string): {
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
} {
  switch (type) {
    case 'hero':
      return {
        content: {
          items: [
            {
              headline: { en: '', ar: '' },
              subheadline: { en: '', ar: '' },
              eyebrow: { en: '', ar: '' },
              ctaText: { en: '', ar: '' },
              ctaUrl: '',
              visualType: 'gradient',
              imageUrl: null,
              gradientFrom: '#4F46E5',
              gradientTo: '#7C3AED',
            },
          ],
          eyebrow: { en: '', ar: '' },
          headline: { en: '', ar: '' },
          subheadline: { en: '', ar: '' },
        },
        settings: {},
      };

    case 'features':
      return {
        content: {
          items: [],
        },
        settings: {},
      };

    case 'products':
      return {
        content: {
          product_ids: [],
        },
        settings: {
          columns: 4,
          style: 'grid',
          show_prices: true,
          show_add_to_cart: true,
        },
      };

    case 'pricing':
      return {
        content: {
          plans: [],
        },
        settings: {},
      };

    case 'testimonials':
      return {
        content: {
          testimonials: [],
        },
        settings: {
          show_rating: true,
        },
      };

    case 'cta':
      return {
        content: {
          ctas: [],
          trust_badges: [],
        },
        settings: {},
      };

    case 'faq':
      return {
        content: {
          items: [],
        },
        settings: {},
      };

    case 'gallery':
      return {
        content: {
          members: [],
        },
        settings: {
          show_bio: true,
        },
      };

    case 'category_grid':
      return {
        content: {
          categories: [],
        },
        settings: {
          layout: 'grid',
          columns: 3,
        },
      };

    case 'video':
      return {
        content: {
          video_url: '',
          poster_url: '',
          description: { en: '', ar: '' },
        },
        settings: {},
      };

    case 'content':
      return {
        content: {
          body: { en: '', ar: '' },
          stats: [],
          promises: [],
          metrics: [],
          disclosure: { en: '', ar: '' },
        },
        settings: {},
      };

    case 'announcement_bar':
      return {
        content: {},
        settings: {
          enabled: true,
          text: 'Free shipping on orders over $50!',
          phone: '+001234567890',
          offer_text: 'Free shipping on orders over $50!',
          shop_now_text: 'Shop Now',
          shop_now_link: '/en/shop',
          show_language_switcher: true,
          dismissible: true,
          bg_color: '#1F2937',
          text_color: '#FFFFFF',
        },
      };

    case 'custom':
    default:
      return {
        content: {},
        settings: {},
      };
  }
}
