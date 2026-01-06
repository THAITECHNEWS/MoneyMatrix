import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getArticlesByCategory } from '@/lib/data';
import ArticleCard from '@/components/ArticleCard';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  
  // Block access to removed categories
  if (categorySlug === 'ai' || categorySlug === 'news') {
    return {
      title: 'Page Not Found',
    };
  }
  
  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  // Don't call AI during build - use static fallback for metadata
  // AI content will be generated at runtime in the page component
  return {
    title: `${category.name} - MoneyMatrix.me`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  
  // Block access to removed categories
  if (categorySlug === 'ai' || categorySlug === 'news') {
    notFound();
  }
  
  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(categorySlug);

  // Category-specific content
  const getCategoryContent = () => {
    if (categorySlug === 'payday-loans') {
      return {
        heroTitle: 'Payday Loans: Complete Guide & Expert Advice',
        heroDescription: 'Understand payday loans, their risks, alternatives, and how to make informed financial decisions. Get expert answers to your questions and learn how to avoid debt traps.',
        introSection: {
          title: 'Understanding Payday Loans',
          content: `Payday loans are short-term, small-dollar loans designed to cover expenses until your next paycheck. While they can provide quick access to cash, they often come with high fees and interest rates that can trap borrowers in a cycle of debt. This comprehensive guide covers everything you need to know about payday loans, including how they work, their risks, legal considerations, and safer alternatives.`
        },
        keyPoints: [
          {
            title: 'How Payday Loans Work',
            description: 'Payday loans typically require repayment in a single payment by your next payday, often through automatic withdrawal from your bank account.'
          },
          {
            title: 'Understanding the Costs',
            description: 'Payday loans can have APRs of 400% or higher when fees are calculated annually. Always understand the total cost before borrowing.'
          },
          {
            title: 'State Regulations Vary',
            description: 'Payday loan laws differ significantly by state. Some states cap rates, require extended payment plans, or effectively ban payday lending.'
          },
          {
            title: 'Safer Alternatives Exist',
            description: 'Consider credit union loans, payment plans with creditors, or cash advance apps before turning to payday loans.'
          }
        ]
      };
    }
    
    // Default content for other categories
    return {
      heroTitle: category.name,
      heroDescription: category.description,
      introSection: {
        title: `About ${category.name}`,
        content: category.description
      },
      keyPoints: []
    };
  };

  const categoryContent = getCategoryContent();

  return (
    <>
      <section className="category-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <span>{category.name}</span>
          </nav>
          
          <h1>{categoryContent.heroTitle}</h1>
          <p>{categoryContent.heroDescription}</p>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          {/* Introduction Section */}
          {categoryContent.introSection && (
            <section className="category-intro">
              <h2>{categoryContent.introSection.title}</h2>
              <p className="category-intro-text">{categoryContent.introSection.content}</p>
            </section>
          )}

          {/* Key Points Section (for payday loans) */}
          {categoryContent.keyPoints && categoryContent.keyPoints.length > 0 && (
            <section className="category-key-points">
              <div className="key-points-grid">
                {categoryContent.keyPoints.map((point, index) => (
                  <div key={index} className="key-point-card">
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Articles Section */}
          <section className="articles-section">
            <h2>Expert Guides & Articles</h2>
            <p className="articles-section-description">
              Comprehensive guides answering your questions about {category.name.toLowerCase()}, 
              including how they work, risks, alternatives, and practical advice.
            </p>
            
            {articles.length > 0 ? (
              <div className="article-grid">
                {articles.map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
              </div>
            ) : (
              <div className="no-articles">
                <h3>Coming Soon</h3>
                <p>We're working on comprehensive guides for {category.name}. Check back soon for expert advice, tips, and detailed comparisons.</p>
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/" className="btn btn-primary">Browse Other Categories</Link>
                </div>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2>Need Help Finding Financial Solutions?</h2>
            <p>Explore our comparison tools and guides to make informed financial decisions.</p>
            <div className="hero-buttons">
              <Link href="/loan-locator" className="btn btn-primary">Find Local Options</Link>
              <Link href="/" className="btn btn-secondary">Browse All Categories</Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
