import Link from 'next/link';
import { Article } from '@/lib/data';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const cleanUrl = article.url.replace(/\.html$/, '');
  const featuredImage = article.images && article.images.length > 0 
    ? article.images[0] 
    : null;
  
  return (
    <article className="article-card-grid">
      <Link href={cleanUrl} className="article-card-link">
        {featuredImage && (
          <div className="article-card-image">
            <img 
              src={featuredImage} 
              alt={article.title}
              loading="lazy"
            />
          </div>
        )}
        <div className="article-card-content">
          <h3 className="article-card-title">{article.title}</h3>
          <p className="article-card-excerpt">
            {article.excerpt || article.meta_description}
          </p>
          <div className="article-card-meta">
            <time dateTime={article.date_published}>
              {article.date_published_formatted}
            </time>
            <span className="article-card-read-time">
              {article.read_time} min read
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
