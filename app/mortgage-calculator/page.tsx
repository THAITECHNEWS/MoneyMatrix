import Link from 'next/link';
import MortgageCalculatorTool from '@/components/MortgageCalculatorTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mortgage Calculator | Calculate Monthly Mortgage Payments | MoneyMatrix.me',
    description: 'Free mortgage calculator to estimate monthly payments, total interest, and total cost. Calculate payments for 15-year and 30-year mortgages with property taxes, insurance, and PMI.',
    keywords: 'mortgage calculator, home loan calculator, mortgage payment calculator, monthly mortgage payment, mortgage interest calculator, home affordability calculator, mortgage amortization, PMI calculator',
    openGraph: {
      title: 'Mortgage Calculator | Calculate Monthly Mortgage Payments',
      description: 'Free mortgage calculator to estimate monthly payments, total interest, and total cost.',
      type: 'website',
    },
  };
}

export default async function MortgageCalculatorPage() {
  const heroTitle = 'Mortgage Calculator';
  const heroDescription = 'Calculate your monthly mortgage payment, total interest, and total cost. Compare 15-year vs 30-year mortgages and see how down payment, interest rate, and other factors affect your payment.';

  return (
    <>
      <section className="store-locator-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <span>Mortgage Calculator</span>
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
        {/* Mortgage Calculator Tool - Client Component */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <MortgageCalculatorTool />
        </div>

        {/* SEO Content Sections */}
        <div style={{ background: '#f9fafb', padding: '6rem 0' }}>
          <div className="container mortgage-seo-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            {/* Introduction Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827', lineHeight: 1.2 }}>
                How to Use Our Free Mortgage Calculator
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 500, color: '#111827' }}>
                  Our mortgage calculator helps you understand the true cost of homeownership. Enter your home price, down payment, interest rate, and loan term to instantly see your monthly payment breakdown, including principal, interest, property taxes, insurance, PMI, and HOA fees.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Whether you're buying your first home, refinancing an existing mortgage, or comparing different loan scenarios, our calculator provides accurate estimates based on standard mortgage amortization formulas. Use it to compare 15-year vs. 30-year mortgages, understand how down payment affects your payment, and plan your home buying budget.
                </p>
                <p style={{ marginBottom: 0 }}>
                  The calculator uses the standard mortgage amortization formula to calculate your principal and interest payment, ensuring accuracy for fixed-rate mortgages. Adjust any input to see how changes affect your monthly payment and total cost over the life of the loan.
                </p>
              </div>
            </section>

            {/* Understanding Mortgage Payments Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827', lineHeight: 1.2 }}>
                Understanding Your Mortgage Payment Breakdown
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '2.5rem' }}>
                Your monthly mortgage payment consists of several components. Understanding each part helps you make smarter home buying decisions and budget effectively.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Principal & Interest (P&I)
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    The principal is the amount you borrowed to buy the home. Each monthly payment includes a portion that goes toward reducing your principal balance. Interest is the cost of borrowing money, expressed as a percentage of your loan amount. Early in the loan term, most of your payment goes toward interest, while later payments include more principal repayment.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Property Taxes
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    Property taxes are assessed by your local government based on your home's value. These taxes are typically paid monthly through an escrow account managed by your lender. Property tax rates vary significantly by location, ranging from less than 0.5% to over 2% of your home's value annually.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Home Insurance
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    Homeowners insurance protects your property and belongings from damage or loss. Most lenders require insurance coverage equal to your loan amount or home value. Insurance premiums vary based on your home's location, value, age, and coverage level. Like property taxes, insurance is often paid monthly through an escrow account.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Private Mortgage Insurance (PMI)
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    PMI is required when your down payment is less than 20% of the home's purchase price. This insurance protects the lender if you default on your loan. PMI typically costs 0.5% to 1% of your loan amount annually, divided into monthly payments. Once you reach 20% equity in your home, you can request to have PMI removed.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    HOA Fees
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    If you're buying a home in a homeowners association (HOA), you'll pay monthly HOA fees. These fees cover maintenance of common areas, amenities, and sometimes utilities. HOA fees can range from $100 to over $1,000 per month, depending on the community and amenities offered.
                  </p>
                </div>
              </div>
            </section>

            {/* Factors Affecting Mortgage Payments Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827', lineHeight: 1.2 }}>
                Factors That Affect Your Mortgage Payment
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '2.5rem' }}>
                Several factors determine your monthly mortgage payment. Understanding how each affects your payment helps you make better home buying decisions.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(0, 102, 204, 0.02))', borderRadius: '0.75rem', border: '1px solid rgba(0, 102, 204, 0.1)' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    Home Price
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    The purchase price of your home directly affects your loan amount and monthly payment. A higher home price means a larger loan and higher monthly payments, assuming the same down payment percentage.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(0, 102, 204, 0.02))', borderRadius: '0.75rem', border: '1px solid rgba(0, 102, 204, 0.1)' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    Down Payment
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    A larger down payment reduces your loan amount and monthly payment. A 20% down payment also eliminates PMI, saving you hundreds of dollars per month. Even increasing your down payment from 10% to 15% can significantly reduce your payment.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(0, 102, 204, 0.02))', borderRadius: '0.75rem', border: '1px solid rgba(0, 102, 204, 0.1)' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    Interest Rate
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    Interest rates significantly impact your payment. A 1% difference in rate can add hundreds of dollars to your monthly payment and tens of thousands over the life of the loan. Shop around and improve your credit score to secure the best rate.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(0, 102, 204, 0.02))', borderRadius: '0.75rem', border: '1px solid rgba(0, 102, 204, 0.1)' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    Loan Term
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    A 15-year mortgage has higher monthly payments but saves significantly on interest compared to a 30-year mortgage. A 30-year term offers lower monthly payments, making homeownership more accessible, but costs more overall.
                  </p>
                </div>
              </div>
            </section>

            {/* 15-Year vs 30-Year Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827', lineHeight: 1.2 }}>
                15-Year vs. 30-Year Mortgages: Which is Right for You?
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '2.5rem' }}>
                Choosing between a 15-year and 30-year mortgage is one of the most important decisions when buying a home. Each option has distinct advantages depending on your financial situation and goals.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ padding: '2.5rem', background: '#f0f9ff', borderRadius: '0.75rem', border: '2px solid #0ea5e9' }}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    15-Year Mortgage
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', marginBottom: '1rem' }}>
                    A 15-year mortgage offers lower interest rates (typically 0.5% to 1% lower than 30-year mortgages) and allows you to build equity faster. You'll pay off your home in half the time and save tens of thousands of dollars in interest. However, monthly payments are significantly higher, which may limit your home buying budget or strain your monthly finances.
                  </p>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', margin: 0, padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <strong style={{ color: '#111827' }}>Best for:</strong> Borrowers with strong financial stability, higher income, or those who want to pay off their mortgage quickly and minimize total interest paid.
                  </p>
                </div>

                <div style={{ padding: '2.5rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '2px solid #22c55e' }}>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    30-Year Mortgage
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', marginBottom: '1rem' }}>
                    A 30-year mortgage offers lower monthly payments, making homeownership more accessible and providing more flexibility in your budget. While you'll pay more interest over the life of the loan, the lower monthly payment allows you to invest elsewhere, save for other goals, or handle unexpected expenses more easily.
                  </p>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', margin: 0, padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <strong style={{ color: '#111827' }}>Best for:</strong> First-time homebuyers, borrowers who want lower monthly payments, or those who prefer to invest extra money rather than pay down their mortgage faster.
                  </p>
                </div>
              </div>
            </section>

            {/* Down Payment Guide Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827', lineHeight: 1.2 }}>
                Down Payment Guide: How Much Should You Put Down?
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '2.5rem' }}>
                Your down payment significantly affects your mortgage payment, interest rate, and total loan cost. Here's what you need to know about different down payment options.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '2rem', background: '#fef3c7', borderRadius: '0.75rem', border: '1px solid #fbbf24' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    20% Down Payment (Conventional)
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    A 20% down payment is the traditional standard for conventional loans. This eliminates PMI, qualifies you for better interest rates, and reduces your loan amount. However, saving 20% can take years, delaying your home purchase.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#dbeafe', borderRadius: '0.75rem', border: '1px solid #3b82f6' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    3.5% Down Payment (FHA)
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    FHA loans allow down payments as low as 3.5% with credit scores of 580 or higher. This makes homeownership accessible sooner, but you'll pay PMI for the life of the loan (unless you refinance to a conventional loan) and may face higher interest rates.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#e0e7ff', borderRadius: '0.75rem', border: '1px solid #6366f1' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    10% Down Payment
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    A 10% down payment is a middle ground that reduces PMI costs compared to smaller down payments while still allowing you to buy a home without waiting years to save 20%. You'll still pay PMI until you reach 20% equity.
                  </p>
                </div>

                <div style={{ padding: '2rem', background: '#dcfce7', borderRadius: '0.75rem', border: '1px solid #22c55e' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                    Zero Down Payment (VA/USDA)
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280' }}>
                    VA loans (for veterans) and USDA loans (for rural areas) offer zero down payment options with competitive rates and no PMI. These programs make homeownership accessible to eligible borrowers who may not have saved a large down payment.
                  </p>
                </div>
              </div>
            </section>

            {/* Tips Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827', lineHeight: 1.2 }}>
                Tips for Using the Mortgage Calculator
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '2rem' }}>
                Get the most out of our mortgage calculator with these helpful tips:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Compare Multiple Scenarios:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    Try different home prices, down payments, interest rates, and loan terms to see how each affects your payment and total cost.
                  </p>
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Use Current Market Rates:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    Research current mortgage interest rates for your credit score and loan type to get accurate estimates.
                  </p>
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Factor in All Costs:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    Remember that your total monthly payment includes property taxes, insurance, PMI, and HOA fees, not just principal and interest.
                  </p>
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Consider Your Budget:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    Make sure your calculated monthly payment fits comfortably within your monthly budget, leaving room for maintenance, utilities, and other expenses.
                  </p>
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Compare Total Cost:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    Look at the total amount paid over the life of the loan, not just the monthly payment. A lower monthly payment with a longer term may cost more overall.
                  </p>
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Research Local Property Taxes:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    Property tax rates vary significantly by location. Research your area's tax rate to get accurate payment estimates.
                  </p>
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderRadius: '0.75rem', borderLeft: '4px solid #0066cc' }}>
                  <strong style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '0.5rem' }}>Plan for PMI Removal:</strong>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6b7280', margin: 0 }}>
                    If you put down less than 20%, calculate when you'll reach 20% equity and can request PMI removal to reduce your monthly payment.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQs Section */}
            <section style={{ marginBottom: '5rem', background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: '#111827', lineHeight: 1.2 }}>
                Frequently Asked Questions About Mortgage Calculators
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How accurate is the mortgage calculator?
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                    Our calculator uses the standard amortization formula for fixed-rate mortgages, providing accurate estimates for most conventional mortgages. However, actual payments may vary slightly due to rounding, and some loans may include additional fees not reflected in the calculation. Always get official quotes from lenders for exact payment amounts.
                  </p>
                </div>

                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Does the calculator work for adjustable-rate mortgages (ARMs)?
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                    The calculator is designed for fixed-rate mortgages. For ARMs, your payment will change when the interest rate adjusts after the initial fixed period. Use the calculator with your initial interest rate to estimate your starting payment, but remember it may change over time.
                  </p>
                </div>

                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How is PMI calculated?
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                    PMI typically costs 0.5% to 1% of your loan amount annually, divided into monthly payments. The exact rate depends on your credit score, loan amount, and down payment. Our calculator uses 0.5% as a standard estimate. Once you reach 20% equity, you can request PMI removal.
                  </p>
                </div>

                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Should I choose a 15-year or 30-year mortgage?
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                    A 15-year mortgage saves significant interest but requires higher monthly payments. A 30-year mortgage offers lower monthly payments but costs more overall. Choose based on what fits your budget while considering your long-term financial goals. Use the calculator to compare both options.
                  </p>
                </div>

                <div style={{ paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How much house can I afford?
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                    Most lenders recommend that your total monthly housing payment (including principal, interest, taxes, insurance, and PMI) should not exceed 28% of your gross monthly income. Use the calculator to work backwards: enter different home prices until your payment fits within this guideline.
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Can I calculate mortgages with extra payments?
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
                    The calculator shows standard amortization payments. If you make extra payments toward principal, your loan will be paid off faster and you'll pay less total interest. To see the impact of extra payments, recalculate with a shorter loan term or use a mortgage amortization calculator that supports extra payments.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section-compact mt-8">
              <h2 className="cta-title-compact">
                Ready to Calculate Your Mortgage Payment?
              </h2>
              <p className="cta-description-compact">
                Use our free mortgage calculator above to estimate your monthly payments, compare different loan scenarios, and make informed home buying decisions. Always consult with mortgage professionals and get pre-approved before making an offer on a home.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

