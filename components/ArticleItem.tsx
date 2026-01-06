import Link from 'next/link';
import { Article } from '@/lib/data';

interface ArticleItemProps {
  article: Article;
}

export default function ArticleItem({ article }: ArticleItemProps) {
  // Ensure URL doesn't have .html
  const cleanUrl = article.url.replace(/\.html$/, '');
  
  return (
    <div className="article-item">
      <h3>
        <Link href={cleanUrl}>{article.title}</Link>
      </h3>
      <p>{article.excerpt || article.meta_description}</p>
      <div className="article-meta">
        <span>{article.category_name}</span>
        <span>{article.read_time} min read</span>
      </div>
    </div>
  );
}
