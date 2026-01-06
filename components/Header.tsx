import Link from 'next/link';
import { getCategories } from '@/lib/data';

export default function Header() {
  const categories = getCategories();

  return (
    <header className="header">
      <div className="nav">
        <div className="nav-brand">
          <Link href="/" className="logo">
            <span className="logo-text">MoneyMatrix</span>
          </Link>
        </div>
        
        <div className="nav-menu">
          <Link href="/compare-credit-cards" className="nav-link">
            Credit Cards
          </Link>
          
          <div className="nav-item">
            <Link href="/compare-personal-loans" className="nav-link">
              Loans <span className="dropdown-arrow">▼</span>
            </Link>
            <div className="dropdown-menu">
              <Link href="/personal-loans" className="dropdown-item">Personal Loans</Link>
              <Link href="/auto-loans" className="dropdown-item">Auto Loans</Link>
              <Link href="/business-loans" className="dropdown-item">Business Loans</Link>
              <Link href="/student-loans" className="dropdown-item">Student Loans</Link>
            </div>
          </div>
          
          <Link href="/mortgages" className="nav-link">AI</Link>
          
          <div className="nav-item">
            <Link href="/personal-finance" className="nav-link">
              Personal Finance <span className="dropdown-arrow">▼</span>
            </Link>
            <div className="dropdown-menu">
              <Link href="/guides" className="dropdown-item">Financial Guides</Link>
              <Link href="/budgeting" className="dropdown-item">Budgeting</Link>
              <Link href="/investing" className="dropdown-item">Investing</Link>
            </div>
          </div>
          
          <Link href="/loan-locator" className="nav-link">Loan Locator</Link>
        </div>
      </div>
    </header>
  );
}
