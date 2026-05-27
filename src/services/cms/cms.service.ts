import { serverFetch } from '@/lib/api/server';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import {
  MarketingPage,
  BlogPost,
  DocumentationPage,
  DocumentationSidebar,
  SitemapEntry,
} from '@/types/cms';

/**
 * CMS Service (Platform-level)
 * Handles all CMS-related API calls.
 */
export const cmsService = {
  /**
   * Fetch a marketing page by slug
   */
  async getPage(slug: string): Promise<MarketingPage> {
    const response = await serverFetch<ApiResponse<MarketingPage>>(
      API_ROUTES.public.cms.pages(slug),
      {
        cache: 'force-cache',
        tags: [`cms-page-${slug}`],
      }
    );
    return response.data;
  },

  /**
   * Fetch blog posts (paginated)
   */
  async getBlogPosts(params: { page?: number; per_page?: number } = {}): Promise<PaginatedResponse<BlogPost>> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.per_page) searchParams.set('per_page', String(params.per_page));

    const query = searchParams.toString();
    const endpoint = `${API_ROUTES.public.cms.blog()}${query ? `?${query}` : ''}`;

    const response = await serverFetch<ApiResponse<PaginatedResponse<BlogPost>>>(endpoint, {
      cache: 'force-cache',
      tags: ['cms-blog-posts'],
    });
    return response.data;
  },

  /**
   * Fetch a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogPost> {
    const response = await serverFetch<ApiResponse<BlogPost>>(
      API_ROUTES.public.cms.blogPost(slug),
      {
        cache: 'force-cache',
        tags: [`cms-blog-post-${slug}`],
      }
    );
    return response.data;
  },

  /**
   * Fetch documentation sidebar
   */
  async getDocsSidebar(): Promise<DocumentationSidebar> {
    const response = await serverFetch<ApiResponse<DocumentationSidebar>>(
      API_ROUTES.public.cms.docsSidebar(),
      {
        cache: 'force-cache',
        tags: ['cms-docs-sidebar'],
      }
    );
    return response.data;
  },

  /**
   * Fetch a documentation page by slug path
   */
  async getDocsPage(slugPath: string): Promise<DocumentationPage> {
    const response = await serverFetch<ApiResponse<DocumentationPage>>(
      API_ROUTES.public.cms.docs(slugPath),
      {
        cache: 'force-cache',
        tags: [`cms-docs-page-${slugPath}`],
      }
    );
    return response.data;
  },

  /**
   * Fetch sitemap for a domain
   */
  async getSitemap(domain: string): Promise<SitemapEntry[]> {
    const response = await serverFetch<ApiResponse<SitemapEntry[]>>(
      API_ROUTES.public.cms.sitemap(domain),
      {
        cache: 'no-store', // Sitemap should be relatively fresh
      }
    );
    return response.data;
  },

  /**
   * Fetch robots.txt content
   */
  async getRobots(): Promise<string> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.public.cms.robots()}`, {
        next: { tags: ['cms-seo-robots'] },
        cache: 'force-cache',
      });
      if (!response.ok) return 'User-agent: *\nDisallow: /';
      return response.text();
    } catch (error) {
      console.error('Failed to fetch robots.txt', error);
      return 'User-agent: *\nDisallow: /';
    }
  },
};
