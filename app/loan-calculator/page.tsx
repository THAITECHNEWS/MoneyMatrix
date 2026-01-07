import Link from 'next/link';
import LoanCalculatorTool from '@/components/LoanCalculatorTool';
import LoanFinder from '@/components/LoanFinder';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Loan Calculator | Calculate Monthly Payments & Interest | MoneyMatrix.me',
    description: 'Free loan calculator to estimate monthly payments, total interest, and total amount paid. Calculate payments for personal loans, auto loans, mortgages, and more. Compare loan options and make informed financial decisions.',
    keywords: 'loan calculator, monthly payment calculator, loan payment calculator, interest calculator, personal loan calculator, auto loan calculator, mortgage calculator, loan amortization, loan payment estimate',
    openGraph: {
      title: 'Loan Calculator | Calculate Monthly Payments & Interest',
      description: 'Free loan calculator to estimate monthly payments, total interest, and total amount paid.',
      type: 'website',
    },
  };
}

export default async function LoanCalculatorPage() {
  const heroTitle = 'Loan Calculator';
  const heroDescription = 'Calculate your monthly loan payments, total interest, and total amount paid. Compare different loan scenarios to make the best financial decision.';

  return (
    <>
      <section className="store-locator-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <span>Loan Calculator</span>
          </nav>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '1rem' }}>
            {heroTitle}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'white', marginBottom: '2rem' }}>
            {heroDescription}
          </p>
        </div>
      </section>

      <main className="main-content" style={{ padding: 0 }}>
        {/* Loan Calculator Tool - Client Component */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <LoanCalculatorTool />
        </div>

        {/* Loan Finder Section */}
        <div style={{ background: 'white', padding: '3rem 0' }}>
          <LoanFinder />
        </div>

        {/* SEO Content Sections */}
        <div style={{ background: 'white', padding: '5rem 0' }}>
          <div className="container">
            
            {/* Loan Types Comparison Table Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#111827' }}>
                Compare Loan Types: Which Loan is Right for You?
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#374151', marginBottom: '2.5rem', lineHeight: 1.8 }}>
                Different loan types serve different purposes and come with varying terms, rates, and requirements. Use our comparison table below to understand the key differences between popular loan options and find the best fit for your financial needs.
              </p>
              
              <div className="loan-comparison-table-container">
                <table className="loan-comparison-table">
                  <thead>
                    <tr>
                      <th>Loan Type</th>
                      <th>Typical APR Range</th>
                      <th>Loan Amount</th>
                      <th>Repayment Term</th>
                      <th>Credit Check</th>
                      <th>Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Personal Loans</strong></td>
                      <td>6% - 36%</td>
                      <td>$1,000 - $50,000</td>
                      <td>12 - 60 months</td>
                      <td>Yes, credit score matters</td>
                      <td>Debt consolidation, major purchases, home improvement</td>
                    </tr>
                    <tr>
                      <td><strong>Auto Loans</strong></td>
                      <td>3% - 10%</td>
                      <td>$5,000 - $100,000</td>
                      <td>24 - 84 months</td>
                      <td>Yes, credit score matters</td>
                      <td>Vehicle purchases, refinancing car loans</td>
                    </tr>
                    <tr>
                      <td><strong>Mortgages</strong></td>
                      <td>3% - 7%</td>
                      <td>$50,000 - $2M+</td>
                      <td>15 - 30 years</td>
                      <td>Yes, extensive credit check</td>
                      <td>Home purchases, refinancing mortgages</td>
                    </tr>
                    <tr>
                      <td><strong>Student Loans</strong></td>
                      <td>3% - 13%</td>
                      <td>$1,000 - $200,000</td>
                      <td>10 - 25 years</td>
                      <td>Yes, but more lenient</td>
                      <td>Education expenses, tuition, living costs</td>
                    </tr>
                    <tr>
                      <td><strong>Payday Loans</strong></td>
                      <td>300% - 600%+</td>
                      <td>$100 - $1,000</td>
                      <td>2 - 4 weeks</td>
                      <td>Minimal, income-based</td>
                      <td>Emergency expenses, short-term cash needs</td>
                    </tr>
                    <tr>
                      <td><strong>Title Loans</strong></td>
                      <td>25% - 300%</td>
                      <td>$100 - $50,000</td>
                      <td>15 - 30 days (or longer)</td>
                      <td>Minimal, vehicle value-based</td>
                      <td>Quick cash with vehicle as collateral</td>
                    </tr>
                    <tr>
                      <td><strong>Installment Loans</strong></td>
                      <td>6% - 36%</td>
                      <td>$500 - $25,000</td>
                      <td>6 - 60 months</td>
                      <td>Yes, varies by lender</td>
                      <td>Predictable monthly payments, flexible terms</td>
                    </tr>
                    <tr>
                      <td><strong>Home Equity Loans</strong></td>
                      <td>5% - 10%</td>
                      <td>$10,000 - $500,000</td>
                      <td>5 - 30 years</td>
                      <td>Yes, home equity required</td>
                      <td>Large expenses, home improvements, debt consolidation</td>
                    </tr>
                    <tr>
                      <td><strong>Business Loans</strong></td>
                      <td>4% - 30%</td>
                      <td>$5,000 - $5M+</td>
                      <td>1 - 25 years</td>
                      <td>Yes, business credit matters</td>
                      <td>Business expansion, equipment, working capital</td>
                    </tr>
                    <tr>
                      <td><strong>Credit Union Loans</strong></td>
                      <td>6% - 18%</td>
                      <td>$500 - $50,000</td>
                      <td>12 - 84 months</td>
                      <td>Yes, membership required</td>
                      <td>Lower rates for members, community-focused</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            {/* Introduction Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                How to Use Our Free Loan Calculator
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 500 }}>
                  Our loan calculator helps you understand the true cost of borrowing money. Simply enter your loan amount, interest rate, and loan term to instantly see your monthly payment, total interest paid, and total amount you'll repay over the life of the loan.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Whether you're considering a personal loan, auto loan, mortgage, or any other type of installment loan, our calculator provides accurate estimates based on standard amortization formulas. Use it to compare different loan offers, understand how interest rates affect your payments, and plan your budget accordingly.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  The calculator uses the standard loan amortization formula to calculate your monthly payment, ensuring accuracy for fixed-rate loans. Adjust any of the three main inputs (loan amount, interest rate, or loan term) to see how changes affect your monthly payment and total cost.
                </p>
              </div>
            </section>

            {/* Understanding Loan Payments Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Understanding Your Loan Payment Breakdown
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  When you take out a loan, your monthly payment consists of two main components: principal and interest. Understanding how these work together helps you make smarter borrowing decisions.
                </p>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Principal
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    The principal is the original amount you borrowed. Each monthly payment includes a portion that goes toward reducing your principal balance. Early in the loan term, a smaller portion of your payment goes toward principal, while later payments include more principal repayment.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Interest
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Interest is the cost of borrowing money, expressed as a percentage of the loan amount. The interest rate determines how much extra you'll pay on top of the principal. Higher interest rates mean higher monthly payments and more total interest paid over the life of the loan.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Total Interest Paid
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    This is the total amount of interest you'll pay over the entire loan term. It's calculated by subtracting your original loan amount from the total amount you'll repay. Understanding total interest helps you compare loan offers and see the true cost of borrowing.
                  </p>
                </div>
              </div>
            </section>

            {/* Factors Affecting Loan Payments Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Factors That Affect Your Loan Payment
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Three main factors determine your monthly loan payment: the loan amount, interest rate, and loan term. Understanding how each affects your payment helps you make better borrowing decisions.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Loan Amount
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      The larger the loan amount, the higher your monthly payment. Borrow only what you need to keep payments manageable and minimize total interest paid.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Interest Rate
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Interest rates significantly impact your payment. A 1% difference in rate can add hundreds or thousands of dollars to your total loan cost. Shop around for the best rates.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Loan Term
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Longer loan terms mean lower monthly payments but more total interest paid. Shorter terms have higher payments but save money overall. Find the right balance for your budget.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Types of Loans Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Types of Loans You Can Calculate
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Our loan calculator works for various types of installment loans. Here's how to use it for different loan types:
                </p>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Personal Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Personal loans typically range from $1,000 to $50,000 with terms of 12 to 60 months. Interest rates vary based on credit score, typically ranging from 6% to 36% APR. Use the calculator to compare different personal loan offers and see how term length affects your payment.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Auto Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Auto loans usually range from $5,000 to $100,000 with terms of 24 to 84 months. Interest rates are typically lower than personal loans, often ranging from 3% to 10% APR for borrowers with good credit. Calculate payments before visiting the dealership to negotiate better terms.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Mortgages
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Mortgage loans are typically 15 or 30 years, with loan amounts ranging from $50,000 to several million dollars. Interest rates vary based on market conditions and credit score. Use the calculator to compare 15-year vs. 30-year mortgages and see how much interest you'll save with a shorter term.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Student Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Student loans can range from a few thousand to over $100,000, with repayment terms typically ranging from 10 to 25 years. Federal student loans often have fixed interest rates, while private loans may have variable rates. Calculate payments to plan your post-graduation budget.
                  </p>
                </div>
              </div>
            </section>

            {/* Tips for Using Calculator Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Tips for Using the Loan Calculator
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Get the most out of our loan calculator with these helpful tips:
                </p>
                
                <ul style={{ marginLeft: '2rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Compare Multiple Scenarios:</strong> Try different loan amounts, interest rates, and terms to see how each affects your payment and total cost.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Use Realistic Interest Rates:</strong> Research current interest rates for your credit score and loan type to get accurate estimates.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Consider Your Budget:</strong> Make sure your calculated monthly payment fits comfortably within your monthly budget, leaving room for other expenses.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Factor in Additional Costs:</strong> Remember that some loans include origination fees, closing costs, or other fees that aren't included in the monthly payment calculation.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Compare Total Cost:</strong> Look at the total amount paid, not just the monthly payment. A lower monthly payment with a longer term may cost more overall.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Plan for Prepayment:</strong> If you plan to make extra payments, remember that this will reduce your total interest paid and shorten your loan term.
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQs Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
                Frequently Asked Questions About Loan Calculators
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                
                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How accurate is the loan calculator?
                  </h3>
                  <p>
                    Our calculator uses the standard amortization formula for fixed-rate loans, providing accurate estimates for most installment loans. However, actual payments may vary slightly due to rounding, and some loans may include additional fees not reflected in the calculation.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Does the calculator work for variable-rate loans?
                  </h3>
                  <p>
                    The calculator is designed for fixed-rate loans. For variable-rate loans, your payment will change when the interest rate adjusts. Use the calculator with your initial interest rate to estimate your starting payment, but remember it may change over time.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    What's the difference between APR and interest rate?
                  </h3>
                  <p>
                    The interest rate is the cost of borrowing the principal amount. APR (Annual Percentage Rate) includes the interest rate plus any fees or additional costs. For accurate comparisons, use the APR when available, as it reflects the true cost of the loan.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Can I calculate loans with extra payments?
                  </h3>
                  <p>
                    The calculator shows standard amortization payments. If you make extra payments, your loan will be paid off faster and you'll pay less total interest. To see the impact of extra payments, you'd need to recalculate with a shorter loan term.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How do I know what interest rate I'll qualify for?
                  </h3>
                  <p>
                    Interest rates depend on your credit score, income, debt-to-income ratio, and the type of loan. Check with multiple lenders to get pre-qualified offers, or use average rates for your credit score range as a starting point for calculations.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Should I choose a longer or shorter loan term?
                  </h3>
                  <p>
                    Shorter loan terms mean higher monthly payments but less total interest paid. Longer terms have lower monthly payments but cost more overall. Choose based on what fits your budget while minimizing total cost when possible.
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion Section */}
            <section className="cta-section-compact" style={{ marginTop: '2rem' }}>
              <h2 className="cta-title-compact">
                Ready to Calculate Your Loan Payments?
              </h2>
              <p className="cta-description-compact">
                Use our free loan calculator above to estimate your monthly payments, compare loan options, and make informed financial decisions. Always borrow responsibly and only take on debt you can afford to repay.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

