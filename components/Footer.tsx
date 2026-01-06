import Link from 'next/link';
import { getCategories } from '@/lib/data';

export default function Footer() {
  const categories = getCategories();
  
  const loanCategories = categories.filter(cat => 
    ['personal-loans', 'auto-loans', 'business-loans', 'student-loans'].includes(cat.slug)
  );
  
  const otherCategories = categories.filter(cat => 
    ['credit-cards', 'credit-score'].includes(cat.slug)
  );

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">MoneyMatrix</h3>
            <p style={{ color: 'var(--gray-400)', marginTop: '1rem' }}>
              Compare financial products and make smart money decisions.
            </p>
          </div>
          
          <div>
            <h3 className="footer-title">Loans</h3>
            <ul className="footer-links">
              {loanCategories.map(category => (
                <li key={category.id}>
                  <Link href={`/${category.slug}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="footer-title">Products</h3>
            <ul className="footer-links">
              {otherCategories.map(category => (
                <li key={category.id}>
                  <Link href={`/${category.slug}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li><Link href="/guides">Financial Guides</Link></li>
              <li><Link href="/loan-locator">Loan Locator</Link></li>
              <li><Link href="/mortgages">AI Tools</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MoneyMatrix.me. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

