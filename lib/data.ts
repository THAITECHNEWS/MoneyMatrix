import fs from 'fs';
import path from 'path';

export interface Category {
  id: number;
  name: string;
  slug: string;
  compare_url: string;
  best_url: string;
  description: string;
}

export interface Article {
  title: string;
  slug: string;
  content: string;
  category_id: number;
  category_slug: string;
  category_name: string;
  meta_description: string;
  keywords: string[];
  tags: string[];
  url: string;
  read_time: number;
  date_published: string;
  date_modified: string;
  date_published_formatted: string;
  date_modified_formatted: string;
  related_articles?: Article[];
  excerpt: string;
  word_count: number;
  images: string[];
}

function loadJSON<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}

// Clean URL - remove .html extension
function cleanUrl(url: string): string {
  if (!url) return url;
  return url.replace(/\.html$/, '').replace(/\/$/, '');
}

export function getCategories(): Category[] {
  const data = loadJSON<{ categories: Category[] }>('categories.json');
  return data.categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories();
  return categories.find(cat => cat.slug === slug);
}

export function getPublishedArticles(): Article[] {
  try {
    const data = loadJSON<{ articles: Article[] }>('published_articles.json');
    const articles = data.articles || [];
    // Clean URLs in articles
    return articles.map(article => ({
      ...article,
      url: cleanUrl(article.url),
    }));
  } catch (error) {
    console.warn('No published articles found, returning empty array');
    return [];
  }
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  const articles = getPublishedArticles();
  return articles.filter(article => article.category_slug === categorySlug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getPublishedArticles();
  // Remove .html from slug if present
  const cleanSlug = slug.replace(/\.html$/, '');
  return articles.find(article => article.slug === cleanSlug || article.slug.replace(/\.html$/, '') === cleanSlug);
}

export function getRecentArticles(limit: number = 6): Article[] {
  const articles = getPublishedArticles();
  return articles
    .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime())
    .slice(0, limit);
}
