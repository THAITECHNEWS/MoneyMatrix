import * as fs from 'fs';
import * as path from 'path';
import { generateArticleFeaturedImage } from './generate-featured-image';

interface GeneratedArticle {
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  keywords: string[];
  category: string;
  content: string;
  cluster: string;
  primaryQuestion: string;
  relatedQuestions: string[];
  targetVolume: number;
  model: string;
  reasoningEffort: string;
  verbosity: string;
  generatedAt: string;
}

interface PublishedArticle {
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
  excerpt: string;
  word_count: number;
  images: string[];
}

function calculateReadTime(wordCount: number): number {
  // Average reading speed: 200-250 words per minute
  // Using 225 words per minute
  return Math.max(1, Math.ceil(wordCount / 225));
}

function countWords(html: string): number {
  // Remove HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function formatDate(date: Date): string {
  return date.toISOString();
}

function formatDateReadable(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function createExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Get first paragraph or first maxLength characters
  const firstParagraph = text.split('.')[0];
  if (firstParagraph.length <= maxLength) {
    return firstParagraph + '.';
  }
  
  return text.substring(0, maxLength).trim() + '...';
}

function convertToPublishedArticle(
  generated: GeneratedArticle,
  categoryId: number
): PublishedArticle {
  const wordCount = countWords(generated.content);
  const readTime = calculateReadTime(wordCount);
  const now = new Date();
  
  // Wrap content in article tag if not already wrapped
  let articleContent = generated.content.trim();
  if (!articleContent.startsWith('<article>')) {
    articleContent = `<article>${articleContent}</article>`;
  }
  
  // Create tags from keywords and category
  const tags = [
    'Payday Loans',
    ...generated.keywords.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1))
  ];

  // Use excerpt from generated article if available, otherwise create one
  const excerpt = (generated as any).excerpt 
    ? (generated as any).excerpt 
    : createExcerpt(generated.content);

  return {
    title: generated.title,
    slug: generated.slug,
    content: articleContent,
    category_id: categoryId,
    category_slug: generated.category,
    category_name: 'Payday Loans',
    meta_description: generated.description,
    keywords: generated.keywords,
    tags: tags,
    url: `/${generated.category}/${generated.slug}`,
    read_time: readTime,
    date_published: formatDate(now),
    date_modified: formatDate(now),
    date_published_formatted: formatDateReadable(now),
    date_modified_formatted: formatDateReadable(now),
    excerpt: excerpt,
    word_count: wordCount,
    images: []
  };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run publish:payday-article <slug>');
    console.log('\nExample: npm run publish:payday-article what-are-payday-loans');
    process.exit(0);
  }

  const slug = args[0];
  const generatedPath = path.join(process.cwd(), 'data/generated-articles', `${slug}.json`);
  
  if (!fs.existsSync(generatedPath)) {
    console.error(`❌ Generated article not found: ${generatedPath}`);
    console.error('   Generate the article first using: npm run generate:payday-article');
    process.exit(1);
  }

  const generated: GeneratedArticle = JSON.parse(fs.readFileSync(generatedPath, 'utf-8'));
  
  // Get category ID
  const categoriesPath = path.join(process.cwd(), 'data/categories.json');
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  const paydayCategory = categoriesData.categories.find((c: any) => c.slug === 'payday-loans');
  
  if (!paydayCategory) {
    console.error('❌ Payday Loans category not found in categories.json');
    process.exit(1);
  }

  // Generate featured image
  const baseImagePath = path.join(process.cwd(), 'ChatGPT Image Jan 5, 2026, 04_10_36 PM.jpg');
  let featuredImagePath = '';
  
  try {
    console.log('\n🎨 Generating featured image...');
    featuredImagePath = await generateArticleFeaturedImage(
      slug,
      generated.title,
      baseImagePath
    );
    console.log(`✅ Featured image created: ${featuredImagePath}`);
  } catch (error: any) {
    console.warn(`⚠️  Featured image generation failed: ${error.message}`);
    console.warn('   Continuing without featured image...');
  }

  // Convert to published format
  const published = convertToPublishedArticle(generated, paydayCategory.id);
  
  // Add featured image if generated
  if (featuredImagePath) {
    published.images = [featuredImagePath];
  }

  // Load existing articles
  const publishedPath = path.join(process.cwd(), 'data/published_articles.json');
  const publishedData = JSON.parse(fs.readFileSync(publishedPath, 'utf-8'));
  
  // Check if article already exists
  const existingIndex = publishedData.articles.findIndex((a: PublishedArticle) => a.slug === slug);
  
  if (existingIndex >= 0) {
    // Update existing article
    publishedData.articles[existingIndex] = published;
    console.log(`✅ Updated existing article: ${slug}`);
  } else {
    // Add new article at the beginning (most recent first)
    publishedData.articles.unshift(published);
    console.log(`✅ Added new article: ${slug}`);
  }

  // Save updated articles
  fs.writeFileSync(publishedPath, JSON.stringify(publishedData, null, 2));

  console.log(`\n📄 Article published successfully!`);
  console.log(`\n📊 Article Details:`);
  console.log(`   Title: ${published.title}`);
  console.log(`   Category: ${published.category_name}`);
  console.log(`   Word Count: ${published.word_count}`);
  console.log(`   Read Time: ${published.read_time} min`);
  console.log(`   URL: ${published.url}`);
  console.log(`\n🌐 View at: https://mm-w3b-production.up.railway.app${published.url}`);
}

if (require.main === module) {
  main();
}

