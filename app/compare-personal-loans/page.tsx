import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Personal Loans 2025 | Best Rates & Terms | MoneyMatrix.me',
  description: 'Compare personal loans from top lenders. Find the best rates, terms, and features. Get loan amounts from $1,000 to $100,000 with competitive APRs starting at 5.99%.',
};

interface LoanOption {
  lender: string;
  minAmount: string;
  maxAmount: string;
  aprRange: string;
  minCreditScore: string;
  termLength: string;
  originationFee: string;
  fundingTime: string;
  bestFor: string;
  highlights: string[];
}

const personalLoans: LoanOption[] = [
  {
    lender: 'SoFi',
    minAmount: '$5,000',
    maxAmount: '$100,000',
    aprRange: '8.99% - 25.81%',
    minCreditScore: '680+',
    termLength: '2-7 years',
    originationFee: 'None',
    fundingTime: 'Same day',
    bestFor: 'Excellent credit, large loans',
    highlights: ['No origination fees', 'Unemployment protection', 'Member benefits', 'Rate discounts available'],
  },
  {
    lender: 'LightStream',
    minAmount: '$5,000',
    maxAmount: '$100,000',
    aprRange: '7.49% - 25.99%',
    minCreditScore: '660+',
    termLength: '2-7 years',
    originationFee: 'None',
    fundingTime: 'Same day',
    bestFor: 'Low rates, fast funding',
    highlights: ['Rate Beat Program', 'No fees', 'Same-day funding', 'Loan satisfaction guarantee'],
  },
  {
    lender: 'Upstart',
    minAmount: '$1,000',
    maxAmount: '$50,000',
    aprRange: '6.40% - 35.99%',
    minCreditScore: '300+',
    termLength: '3-5 years',
    originationFee: '0% - 12%',
    fundingTime: '1-3 days',
    bestFor: 'Fair to good credit',
    highlights: ['AI-powered approval', 'Fast application', 'Flexible credit requirements', 'Quick funding'],
  },
  {
    lender: 'Best Egg',
    minAmount: '$2,000',
    maxAmount: '$50,000',
    aprRange: '8.99% - 35.99%',
    minCreditScore: '600+',
    termLength: '3-5 years',
    originationFee: '0.99% - 5.99%',
    fundingTime: '1-3 days',
    bestFor: 'Debt consolidation',
    highlights: ['Debt consolidation focus', 'Competitive rates', 'Fast approval', 'Direct payment to creditors'],
  },
  {
    lender: 'Marcus by Goldman Sachs',
    minAmount: '$3,500',
    maxAmount: '$40,000',
    aprRange: '6.99% - 24.99%',
    minCreditScore: '660+',
    termLength: '3-6 years',
    originationFee: 'None',
    fundingTime: '1-4 days',
    bestFor: 'No fees, flexible terms',
    highlights: ['No fees', 'On-time payment reward', 'Flexible payment dates', 'No prepayment penalty'],
  },
  {
    lender: 'Discover Personal Loans',
    minAmount: '$2,500',
    maxAmount: '$40,000',
    aprRange: '7.99% - 24.99%',
    minCreditScore: '660+',
    termLength: '3-7 years',
    originationFee: 'None',
    fundingTime: 'Next business day',
    bestFor: 'Debt consolidation',
    highlights: ['No origination fees', 'Direct creditor payment', 'Fixed rates', 'Rate reduction available'],
  },
  {
    lender: 'Wells Fargo',
    minAmount: '$3,000',
    maxAmount: '$100,000',
    aprRange: '7.49% - 23.24%',
    minCreditScore: '600+',
    termLength: '1-7 years',
    originationFee: 'None',
    fundingTime: '1-3 days',
    bestFor: 'Existing customers',
    highlights: ['Relationship discounts', 'No origination fees', 'Flexible terms', 'Customer benefits'],
  },
  {
    lender: 'Avant',
    minAmount: '$2,000',
    maxAmount: '$35,000',
    aprRange: '9.95% - 35.99%',
    minCreditScore: '580+',
    termLength: '2-5 years',
    originationFee: 'Up to 4.75%',
    fundingTime: 'Next business day',
    bestFor: 'Fair credit borrowers',
    highlights: ['Fair credit accepted', 'Fast approval', 'Quick funding', 'Mobile app available'],
  },
];

export default function ComparePersonalLoansPage() {
  return (
    <>
      <section className="category-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <span>Compare Personal Loans</span>
          </nav>
          <h1>Compare Personal Loans: Find the Best Rates & Terms</h1>
          <p style={{ fontSize: '1.25rem', marginTop: '1rem', maxWidth: '800px' }}>
            Compare personal loans from top lenders nationwide. Find competitive rates, flexible terms, and fast funding options tailored to your financial needs.
          </p>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          
          {/* Introduction Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
              Personal Loan Comparison Guide
            </h2>
            <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Personal loans offer flexible financing for various needs, from debt consolidation to major purchases. 
                With interest rates ranging from 6% to 36% APR depending on your credit profile, comparing options is 
                essential to find the best deal. Our comprehensive comparison table below shows rates, fees, terms, 
                and features from leading lenders to help you make an informed decision.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>Key factors to consider:</strong> Annual Percentage Rate (APR), origination fees, loan amounts, 
                repayment terms, funding speed, and credit requirements. The best personal loan for you depends on your 
                credit score, loan amount needed, and how quickly you need funds.
              </p>
            </div>
          </section>

          {/* Comparison Table */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
              Personal Loan Comparison Table
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Lender</th>
                    <th>Loan Amount</th>
                    <th>APR Range</th>
                    <th>Credit Score</th>
                    <th>Term Length</th>
                    <th>Origination Fee</th>
                    <th>Funding Time</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {personalLoans.map((loan, index) => (
                    <tr key={index}>
                      <td className="feature-name" style={{ fontWeight: 700 }}>{loan.lender}</td>
                      <td>{loan.minAmount} - {loan.maxAmount}</td>
                      <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{loan.aprRange}</td>
                      <td>{loan.minCreditScore}</td>
                      <td>{loan.termLength}</td>
                      <td>{loan.originationFee}</td>
                      <td>{loan.fundingTime}</td>
                      <td>{loan.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detailed Lender Information */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
              Detailed Lender Information
            </h2>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {personalLoans.map((loan, index) => (
                <div key={index} style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    {loan.lender}
                  </h3>
                  <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '1rem' }}>
                    <strong>Best For:</strong> {loan.bestFor}
                  </p>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#111827' }}>Key Highlights:</strong>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: '#374151' }}>
                      {loan.highlights.map((highlight, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem',
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>APR Range</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-color)' }}>{loan.aprRange}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Loan Amount</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{loan.minAmount} - {loan.maxAmount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Funding Time</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{loan.fundingTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How to Choose Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
              How to Choose the Right Personal Loan
            </h2>
            <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  1. Check Your Credit Score
                </h3>
                <p>
                  Your credit score significantly impacts the interest rate you'll receive. Lenders typically offer the best 
                  rates to borrowers with credit scores of 720 or higher. Check your credit score before applying to understand 
                  which lenders are most likely to approve you and offer competitive rates.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  2. Compare APRs, Not Just Interest Rates
                </h3>
                <p>
                  The Annual Percentage Rate (APR) includes both the interest rate and any fees, giving you the true cost of 
                  borrowing. Always compare APRs when evaluating loan offers. A loan with a lower interest rate but high fees 
                  may cost more than a loan with a slightly higher rate but no fees.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  3. Consider Origination Fees
                </h3>
                <p>
                  Some lenders charge origination fees (typically 1% to 8% of the loan amount), which are deducted from your 
                  loan proceeds. For example, a $10,000 loan with a 5% origination fee means you'll receive $9,500 but still 
                  repay the full $10,000. Factor these fees into your total cost comparison.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  4. Evaluate Repayment Terms
                </h3>
                <p>
                  Longer repayment terms mean lower monthly payments but higher total interest costs. Shorter terms save money 
                  on interest but require higher monthly payments. Choose a term length that balances affordable monthly payments 
                  with minimizing total interest paid.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  5. Check Funding Speed
                </h3>
                <p>
                  If you need funds quickly, prioritize lenders offering same-day or next-day funding. Some lenders can deposit 
                  funds within hours of approval, while others may take several business days. Consider your timeline when choosing 
                  a lender.
                </p>
              </div>
            </div>
          </section>

          {/* Common Uses Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
              Common Uses for Personal Loans
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                  Debt Consolidation
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  Combine multiple debts into a single loan with a lower interest rate, simplifying payments and potentially saving money.
                </p>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                  Home Improvement
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  Finance renovations, repairs, or upgrades to increase your home's value and improve your living space.
                </p>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                  Major Purchases
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  Finance large expenses like appliances, furniture, or electronics with fixed monthly payments.
                </p>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                  Medical Expenses
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  Cover unexpected medical bills or elective procedures with manageable monthly payments.
                </p>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                  Wedding Expenses
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  Finance your special day with flexible repayment terms and competitive interest rates.
                </p>
              </div>
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                  Moving Costs
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.7 }}>
                  Cover relocation expenses, moving services, and initial setup costs in your new location.
                </p>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
              
              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  What credit score do I need for a personal loan?
                </h3>
                <p>
                  Most lenders require a credit score of at least 600, though scores of 660+ typically qualify for better rates. 
                  Some lenders like Upstart accept borrowers with scores as low as 300, but rates will be significantly higher. 
                  The best rates are usually reserved for borrowers with scores of 720 or higher.
                </p>
              </div>

              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  How long does it take to get approved for a personal loan?
                </h3>
                <p>
                  Approval times vary by lender. Some online lenders provide instant pre-approval decisions, while others may take 
                  a few hours to review your application. Once approved, funding typically occurs within 1-3 business days, though 
                  some lenders offer same-day funding for qualified borrowers.
                </p>
              </div>

              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Can I get a personal loan with bad credit?
                </h3>
                <p>
                  Yes, some lenders specialize in loans for borrowers with fair or poor credit. However, you'll likely face higher 
                  interest rates and may need to accept lower loan amounts or shorter repayment terms. Consider improving your credit 
                  score first or exploring secured loan options if you have collateral.
                </p>
              </div>

              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Are there fees associated with personal loans?
                </h3>
                <p>
                  Some lenders charge origination fees (typically 1% to 8% of the loan amount), while others charge no fees at all. 
                  Always check for origination fees, late payment fees, prepayment penalties, and any other charges before accepting 
                  a loan offer. Lenders like SoFi, LightStream, and Marcus by Goldman Sachs charge no origination fees.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Can I pay off my personal loan early?
                </h3>
                <p>
                  Most personal loans allow early repayment without penalties, which can save you money on interest. However, some 
                  lenders charge prepayment penalties, so always review the loan terms carefully. Paying off your loan early can 
                  improve your credit score and free up your monthly budget.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section" style={{ marginTop: '4rem' }}>
            <div className="container">
              <h2>Ready to Compare Personal Loans?</h2>
              <p>Use our store locator to find local lenders or compare online options to get the best rates and terms for your needs.</p>
              <div className="hero-buttons">
                <Link href="/loan-locator" className="btn btn-primary">Find Local Lenders</Link>
                <Link href="/personal-loans" className="btn btn-secondary">Learn More</Link>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

