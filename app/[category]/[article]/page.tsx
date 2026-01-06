import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getCategoryBySlug, getArticlesByCategory } from '@/lib/data';
import { addHeadingIds, extractHeadings } from '@/lib/article-utils';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: Promise<{
    category: string;
    article: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { article: articleSlug } = await params;
  const cleanSlug = articleSlug.replace(/\.html$/, '');
  const article = getArticleBySlug(cleanSlug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const baseUrl = 'https://moneymatrix.me';
  const articleUrl = `${baseUrl}${article.url}`;
  const category = getCategoryBySlug(article.category_slug);

  return {
    title: `${article.title} | ${article.category_name} | MoneyMatrix.me`,
    description: article.meta_description,
    keywords: article.keywords.join(', '),
    authors: [{ name: 'MoneyMatrix Editorial Team' }],
    openGraph: {
      title: article.title,
      description: article.meta_description,
      url: articleUrl,
      siteName: 'MoneyMatrix.me',
      type: 'article',
      publishedTime: article.date_published,
      modifiedTime: article.date_modified,
      authors: ['MoneyMatrix Editorial Team'],
      tags: article.tags,
      images: article.images.length > 0 ? article.images.map(img => ({
        url: img.startsWith('http') ? img : `${baseUrl}${img}`,
        alt: article.title,
      })) : [{
        url: `${baseUrl}/og-image.jpg`,
        alt: article.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description,
      images: article.images.length > 0 ? [article.images[0]] : [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate structured data for SEO
function generateStructuredData(article: any, category: any) {
  const baseUrl = 'https://moneymatrix.me';
  const articleUrl = `${baseUrl}${article.url}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description,
    image: article.images.length > 0 
      ? article.images.map((img: string) => img.startsWith('http') ? img : `${baseUrl}${img}`)
      : [`${baseUrl}/og-image.jpg`],
    datePublished: article.date_published,
    dateModified: article.date_modified,
    author: {
      '@type': 'Organization',
      name: 'MoneyMatrix',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MoneyMatrix',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: category?.name || article.category_name,
    keywords: article.keywords.join(', '),
    wordCount: article.word_count,
    timeRequired: `PT${article.read_time}M`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category?.name || article.category_name,
        item: `${baseUrl}/${article.category_slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return [articleSchema, breadcrumbSchema];
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, article: articleSlug } = await params;
  const cleanSlug = articleSlug.replace(/\.html$/, '');
  const article = getArticleBySlug(cleanSlug);
  
  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(categorySlug);
  const relatedArticles = getArticlesByCategory(categorySlug)
    .filter(a => a.slug !== cleanSlug)
    .slice(0, 6);

  const structuredData = generateStructuredData(article, category);
  const baseUrl = 'https://moneymatrix.me';
  const articleUrl = `${baseUrl}${article.url}`;

  // Process article content: add IDs to headings
  const processedContent = addHeadingIds(article.content);
  
  // Extract headings for table of contents
  const headings = extractHeadings(processedContent);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData[0]) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData[1]) }}
      />

      {/* Article Header */}
      <header className="article-header" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
        color: 'white',
        padding: '4rem 0 3rem'
      }}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap', gap: '0.5rem' }}>
              <li>
                <Link href="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.7)' }}>→</li>
              <li>
                <Link href={`/${categorySlug}`} style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                  {category?.name || article.category_name}
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.7)' }}>→</li>
              <li style={{ color: 'rgba(255,255,255,0.9)' }}>{article.title}</li>
            </ol>
          </nav>

          {/* Article Title */}
          <h1 className="article-title" style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 800, 
            marginBottom: '1rem',
            lineHeight: 1.2,
            maxWidth: '900px',
            color: 'white'
          }}>
            {article.title}
          </h1>

          {/* Meta Information */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.5rem', 
            fontSize: '0.9375rem',
            opacity: 0.95,
            marginTop: '1.5rem'
          }}>
            <time dateTime={article.date_published}>{article.date_published_formatted}</time>
            <span>{article.read_time} min read</span>
            <span>{article.word_count.toLocaleString()} words</span>
            {article.date_modified !== article.date_published && (
              <time dateTime={article.date_modified}>Updated {article.date_modified_formatted}</time>
            )}
          </div>

          {/* Category Badge */}
          <div style={{ marginTop: '1.5rem' }}>
            <Link 
              href={`/${article.category_slug}`}
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              {article.category_name}
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 300px', 
            gap: '3rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            
            {/* Main Article Content */}
            <article className="article-content" itemScope itemType="https://schema.org/Article">
              
              {/* Excerpt/Summary */}
              {article.excerpt && (
                <div className="article-excerpt">
                  <p>{article.excerpt}</p>
                </div>
              )}

              {/* Featured Image */}
              {article.images && article.images.length > 0 && (
                <div className="article-featured-image">
                  <img 
                    src={article.images[0]}
                    alt={article.title}
                    loading="eager"
                  />
                </div>
              )}

              {/* Table of Contents */}
              {headings.length > 0 && (
                <TableOfContents headings={headings} />
              )}

              {/* Article Body */}
              <div 
                className="article-body"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div style={{ 
                  marginTop: '3rem', 
                  paddingTop: '2rem', 
                  borderTop: '2px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tags
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <ShareButtons articleUrl={articleUrl} articleTitle={article.title} />

              {/* Author Box */}
              <div style={{
                marginTop: '3rem',
                padding: '2rem',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    MM
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
                      MoneyMatrix Editorial Team
                    </h3>
                    <p style={{ color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                      Our team of financial experts provides comprehensive guides and comparisons to help you make 
                      informed financial decisions. We research and analyze financial products to bring you accurate, 
                      up-to-date information.
                    </p>
                  </div>
                </div>
              </div>

            </article>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: '2rem', alignSelf: 'start' }}>
              
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Related Articles
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {relatedArticles.slice(0, 4).map((relatedArticle) => {
                      const cleanUrl = relatedArticle.url.replace(/\.html$/, '');
                      return (
                        <Link
                          key={relatedArticle.slug}
                          href={cleanUrl}
                          className="related-article-link"
                          style={{
                            display: 'block',
                            textDecoration: 'none',
                            color: '#111827',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            transition: 'background 0.2s, border-color 0.2s',
                            border: '1px solid transparent'
                          }}
                        >
                          <h4 style={{ 
                            fontSize: '0.9375rem', 
                            fontWeight: 600, 
                            marginBottom: '0.5rem',
                            lineHeight: 1.4
                          }}>
                            {relatedArticle.title}
                          </h4>
                          <p style={{ 
                            fontSize: '0.8125rem', 
                            color: '#6b7280', 
                            margin: 0,
                            lineHeight: 1.5
                          }}>
                            {relatedArticle.excerpt?.substring(0, 80) || relatedArticle.meta_description.substring(0, 80)}...
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            </aside>

          </div>

          {/* Related Articles Section (Full Width) */}
          {relatedArticles.length > 4 && (
            <section style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '2px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
                More Articles in {article.category_name}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {relatedArticles.slice(4).map((relatedArticle) => {
                  const cleanUrl = relatedArticle.url.replace(/\.html$/, '');
                  return (
                    <div key={relatedArticle.slug} className="related-article-card" style={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    >
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                        <Link href={cleanUrl} style={{ color: '#111827', textDecoration: 'none' }}>
                          {relatedArticle.title}
                        </Link>
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {relatedArticle.excerpt || relatedArticle.meta_description}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#9ca3af' }}>
                        <span>{relatedArticle.read_time} min read</span>
                        <span>•</span>
                        <span>{relatedArticle.date_published_formatted}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
