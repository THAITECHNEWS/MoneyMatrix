import Link from 'next/link';
import { Category } from '@/lib/data';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="category-card">
      <h3>
        <Link href={`/${category.slug}`}>{category.name}</Link>
      </h3>
      <p>{category.description}</p>
      <div className="card-actions">
        <Link href={category.compare_url} className="btn-link">Compare Now</Link>
        <Link href={category.best_url} className="btn-link">Best Options</Link>
      </div>
    </div>
  );
}
