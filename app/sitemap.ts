import { MetadataRoute } from 'next';
import { getCategories, getPublishedArticles } from '@/lib/data';
import { getLocations, getLoanTypes } from '@/lib/locations';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://moneymatrix.me';
  const categories = getCategories();
  const articles = getPublishedArticles();
  const locations = getLocations();
  const loanTypes = getLoanTypes();

  const categoryUrls = categories.map(category => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map(article => ({
    url: `${baseUrl}${article.url}`,
    lastModified: new Date(article.date_modified || article.date_published),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Generate location page URLs
  const locationUrls: MetadataRoute.Sitemap = [];
  for (const location of locations) {
    for (const loanType of loanTypes) {
      const citySlug = location.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const stateSlug = location.stateAbbr.toLowerCase();
      const url = `${baseUrl}/locations/${loanType.slug}-in-${citySlug}-${stateSlug}`;
      
      locationUrls.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/loan-locator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...categoryUrls,
    ...articleUrls,
    ...locationUrls,
  ];
}
