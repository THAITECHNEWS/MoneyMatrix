import Link from 'next/link';
import { getCategories, getRecentArticles } from '@/lib/data';
import CategoryCard from '@/components/CategoryCard';
import ArticleCard from '@/components/ArticleCard';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Compare Financial Products & Make Smart Money Decisions | MoneyMatrix.me',
    description: 'Find the best loans, credit cards, and financial products tailored to your needs. Compare rates, terms, and features from top lenders nationwide. Save time and money with our comprehensive comparison tools.',
  };
}

export default async function HomePage() {
  const categories = getCategories();
  const featuredCategories = categories.filter(cat => 
    ['credit-cards', 'personal-loans', 'auto-loans'].includes(cat.slug)
  );
  const recentArticles = getRecentArticles(6);
  const allCategories = categories.slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Compare Financial Products & Make Smart Money Decisions</h1>
            <p className="hero-description">
              Find the best loans, credit cards, and financial products tailored to your needs. 
              Compare rates, terms, and features from top lenders nationwide. Save time and money 
              with our comprehensive comparison tools.
            </p>
            <div className="hero-buttons">
              <Link href="/compare-personal-loans" className="btn btn-primary">Compare Loans</Link>
              <Link href="/compare-credit-cards" className="btn btn-secondary">Compare Cards</Link>
              <Link href="/loan-locator" className="btn btn-secondary">Find Local Lenders</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Financial Products</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Top Lenders</p>
            </div>
            <div className="stat-item">
              <h3>1M+</h3>
              <p>Monthly Visitors</p>
            </div>
            <div className="stat-item">
              <h3>4.8/5</h3>
              <p>User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="main-content" style={{ background: 'white', padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>
            How MoneyMatrix Works
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.25rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
            Our simple three-step process helps you find the perfect financial product in minutes, not hours.
          </p>
          <div className="feature-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="feature-card">
              <div className="feature-card-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>1️⃣</div>
              <h3>Compare Products</h3>
              <p>Browse hundreds of financial products from trusted lenders. Compare interest rates, fees, terms, and features side-by-side to find the best match for your needs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>2️⃣</div>
              <h3>Get Matched</h3>
              <p>Our intelligent matching system analyzes your financial profile and preferences to recommend the best products. See personalized rates and offers instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>3️⃣</div>
              <h3>Apply & Save</h3>
              <p>Apply directly through our platform or get connected with top lenders. Save thousands on interest rates and fees with our exclusive offers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>
            Popular Financial Products
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.125rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Explore our most popular categories and find the perfect financial solution for your needs
          </p>
          <div className="categories-grid">
            {featuredCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MoneyMatrix Section */}
      <section className="main-content" style={{ background: 'var(--gray-50)', padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>
            Why Choose MoneyMatrix?
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.125rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
            We're committed to helping you make smarter financial decisions with transparency, security, and expert guidance.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-card-icon">✓</div>
              <h3>100% Free Comparison</h3>
              <p>Compare hundreds of financial products side-by-side with absolutely no fees or hidden costs. Get the best rates instantly without any commitment. Our service is completely free to use.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🔒</div>
              <h3>Bank-Level Security</h3>
              <p>Your information is protected with industry-leading encryption and security protocols. We never sell your data to third parties. Your privacy and security are our top priorities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>Get matched with the best lenders in minutes, not days. No lengthy applications or waiting periods required. See personalized rates and offers in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">💰</div>
              <h3>Save Thousands</h3>
              <p>Find better rates and save thousands on interest payments. Our comparison tools help you make smarter financial decisions that save you money over time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📊</div>
              <h3>Comprehensive Data</h3>
              <p>Access detailed information on rates, fees, terms, and lender reviews. Make informed decisions with our comprehensive database of financial products.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🎯</div>
              <h3>Expert Guidance</h3>
              <p>Get personalized recommendations based on your financial profile. Our intelligent matching system helps you find products tailored to your specific needs and goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="recent-articles" style={{ background: 'white', padding: '5rem 0' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>
              Latest Financial Guides & Tips
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.125rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
              Stay informed with expert advice, tips, and comprehensive guides to help you make better financial decisions
            </p>
            <div className="articles-grid">
              {recentArticles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Categories Grid */}
      <section className="featured-categories" style={{ background: 'var(--gray-50)', padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 800 }}>
            Explore All Financial Categories
          </h2>
          <p style={{ textAlign: 'center', fontSize: '1.125rem', color: '#6b7280', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Browse our complete selection of financial products and services to find exactly what you need
          </p>
          <div className="categories-grid">
            {allCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="main-content" style={{ background: 'white', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2.5rem', fontWeight: 800 }}>
              Trusted by Millions of Americans
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem', lineHeight: 1.8 }}>
              MoneyMatrix has helped over 1 million people find the perfect financial products. 
              We partner with trusted lenders and financial institutions to bring you the best rates 
              and most competitive offers available in the market.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '3rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>1M+</div>
                <div style={{ color: '#6b7280' }}>Users Helped</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>$500M+</div>
                <div style={{ color: '#6b7280' }}>In Loans Matched</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>4.8/5</div>
                <div style={{ color: '#6b7280' }}>Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Find Your Perfect Financial Product?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Start comparing today and save money on loans, credit cards, and more. 
            It's free, fast, and secure.
          </p>
          <div className="hero-buttons">
            <Link href="/compare-personal-loans" className="btn btn-primary">Get Started Now</Link>
            <Link href="/loan-locator" className="btn btn-secondary">Find Local Lenders</Link>
            <Link href="/guides" className="btn btn-secondary">Read Guides</Link>
          </div>
        </div>
      </section>
    </>
  );
}
