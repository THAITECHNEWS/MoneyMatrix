import Link from 'next/link';
import StoreLocatorTool from '@/components/StoreLocatorTool';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Find Lenders Near You | Loan Locator Tool | MoneyMatrix.me',
    description: 'Find local lenders, loan stores, and financial service providers near you. Search by location, zip code, or address. Compare rates, read reviews, and get instant quotes from top-rated lenders in your area.',
    keywords: 'find lenders near me, loan locator, payday loans near me, personal loans, installment loans, title loans, check cashing, pawn loans, cash for gold, local lenders, financial services',
    openGraph: {
      title: 'Find Lenders Near You | Loan Locator Tool',
      description: 'Compare rates, read reviews, and get instant quotes from top-rated lenders in your area.',
      type: 'website',
    },
  };
}

export default async function StoreLocatorPage() {
  const heroTitle = 'Find Lenders Near You';
  const heroDescription = 'Search for local lenders, loan stores, and financial service providers in your area.';

  return (
    <>
      <section className="store-locator-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <span>Loan Locator</span>
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
        {/* Store Locator Tool - Client Component */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <StoreLocatorTool />
        </div>

        {/* SEO Content Sections */}
        <div style={{ background: 'white', padding: '5rem 0' }}>
          <div className="container">
            
            {/* Introduction Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Find Local Lenders Near You: Your Complete Guide to Finding Financial Services
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 500 }}>
                  Use our advanced loan locator tool above to instantly find lenders, compare rates, and get quotes from verified financial service providers in your area. Whether you need payday loans, personal loans, installment loans, title loans, check cashing services, pawn loans, or cash for gold services, our comprehensive search tool helps you find the best options near you.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Finding the right lender in your area can be challenging, especially when you need quick access to financial services. 
                  With over 12 million Americans using payday loans annually and thousands of lending locations across the United States, 
                  having a reliable way to locate nearby financial services is essential. Our advanced search tool allows you to find lenders 
                  by zip code, city, or address, making it easy to compare options in your neighborhood. You can filter results by loan type, 
                  distance, loan amount, and read real customer reviews to make informed decisions.
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  This comprehensive guide will help you understand how to use our locator effectively and what to look for when choosing 
                  a local lender. Learn about different loan types, state regulations, and best practices for finding reputable financial 
                  service providers in your area.
                </p>
              </div>
            </section>

            {/* Why Use a Store Locator Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Why Use a Store Locator to Find Lenders?
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Searching for lenders online can be overwhelming, with hundreds of options and varying terms. A store locator simplifies 
                  this process by showing you exactly where lenders are located relative to your position. Here are the key benefits:
                </p>
                <ul style={{ marginLeft: '2rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Convenience:</strong> Find lenders within walking distance or a short drive from your home or workplace, 
                    saving you time and transportation costs.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Compare Options:</strong> See multiple lenders side-by-side with their rates, fees, and customer ratings 
                    to make the best choice for your needs.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Verify Legitimacy:</strong> Check if lenders are properly licensed and registered in your state before 
                    visiting their location.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Read Reviews:</strong> Access real customer feedback to understand the lender's reputation and service quality.
                  </li>
                  <li style={{ marginBottom: '0.75rem' }}>
                    <strong>Check Hours:</strong> View operating hours and contact information to plan your visit accordingly.
                  </li>
                </ul>
              </div>
            </section>

            {/* Types of Financial Services Available Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Types of Financial Services You Can Find
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Our store locator helps you find various types of financial services, each designed for different needs and situations:
                </p>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Payday Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Payday loans are short-term loans typically due on your next payday, usually within 2-4 weeks. These loans are 
                    designed for emergency expenses and typically range from $100 to $1,000. According to the Consumer Financial Protection 
                    Bureau (CFPB), approximately 12 million Americans use payday loans each year. When searching for payday loan locations, 
                    look for lenders with transparent fee structures and state-licensed operations.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Personal Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Personal loans offer larger amounts (typically $1,000 to $50,000) with longer repayment terms, usually 12-60 months. 
                    These loans are ideal for debt consolidation, major purchases, or significant expenses. Interest rates vary based on 
                    credit score, with average APRs ranging from 6% to 36%. Use our locator to find personal loan providers that offer 
                    competitive rates and flexible terms.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Installment Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Installment loans allow you to borrow a fixed amount and repay it in regular monthly payments over a set period. 
                    These loans are popular for their predictable payment schedules and typically offer better terms than payday loans. 
                    Loan amounts can range from $500 to $25,000, with repayment terms from 6 months to 5 years.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Title Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Title loans use your vehicle as collateral, allowing you to borrow money based on your car's value. These loans 
                    typically range from $100 to $50,000 and can be processed quickly. However, it's crucial to understand that defaulting 
                    could result in losing your vehicle. Always compare multiple title loan providers to find the best terms.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Check Cashing Services
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Check cashing services allow you to cash checks immediately without a bank account. Fees typically range from 1% to 
                    5% of the check amount. These services are convenient for those who need immediate access to funds but don't have 
                    traditional banking relationships.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Pawn Loans
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Pawn loans allow you to use valuable items (jewelry, electronics, etc.) as collateral for a loan. You receive cash 
                    immediately and can reclaim your items by repaying the loan plus interest. Loan amounts typically range from 25% to 
                    60% of the item's appraised value.
                  </p>
                </div>
              </div>
            </section>

            {/* How to Use the Store Locator Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                How to Use Our Store Locator Tool
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Our store locator is designed to be intuitive and user-friendly. Follow these steps to find the best lenders near you:
                </p>
                
                <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Step 1: Enter Your Location
                  </h3>
                  <p>
                    You can search by entering your zip code, city name, or full address. The tool will automatically detect your location 
                    if you allow browser geolocation access. This ensures you see the most relevant results based on your current position.
                  </p>
                </div>

                <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Step 2: Select Loan Type
                  </h3>
                  <p>
                    Choose the type of financial service you need from our dropdown menu. Options include payday loans, personal loans, 
                    installment loans, title loans, check cashing, pawn loans, and cash for gold services. Selecting a specific loan type 
                    filters results to show only relevant lenders.
                  </p>
                </div>

                <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Step 3: Set Search Radius
                  </h3>
                  <p>
                    Adjust the distance slider to specify how far you're willing to travel. Options typically range from 5 to 50 miles. 
                    A smaller radius shows only nearby locations, while a larger radius provides more options but may require more travel time.
                  </p>
                </div>

                <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Step 4: Review Results
                  </h3>
                  <p>
                    Browse through the list of lenders displayed on the map and in the results grid. Each listing shows the lender's name, 
                    address, distance from your location, customer ratings, and key information. Click on any listing to see detailed 
                    information including hours, contact details, and customer reviews.
                  </p>
                </div>

                <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Step 5: Compare and Choose
                  </h3>
                  <p>
                    Compare multiple lenders based on their rates, fees, customer ratings, and proximity to your location. Use the 
                    comparison features to evaluate which lender offers the best terms for your specific needs. Once you've made your 
                    decision, you can get directions or contact the lender directly.
                  </p>
                </div>
              </div>
            </section>

            {/* What to Look for in a Lender Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                What to Look for When Choosing a Lender
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Not all lenders are created equal. Here are essential factors to consider when selecting a financial service provider:
                </p>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    State Licensing and Registration
                  </h3>
                  <p>
                    Always verify that the lender is properly licensed in your state. Each state has different regulations governing 
                    payday loans and other financial services. Licensed lenders must comply with state laws regarding interest rates, 
                    fees, and loan terms. You can check a lender's license status through your state's Department of Financial 
                    Institutions or similar regulatory body.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Transparent Fee Structure
                  </h3>
                  <p>
                    Reputable lenders clearly disclose all fees upfront, including origination fees, late payment fees, and any other 
                    charges. Be wary of lenders who are vague about costs or try to hide fees in fine print. The annual percentage rate 
                    (APR) should be clearly displayed, allowing you to compare the true cost of borrowing.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Customer Reviews and Ratings
                  </h3>
                  <p>
                    Read customer reviews to understand others' experiences with the lender. Look for patterns in reviews - multiple 
                    complaints about hidden fees, poor customer service, or aggressive collection practices are red flags. Positive 
                    reviews should mention transparency, helpful staff, and fair terms.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Loan Terms and Conditions
                  </h3>
                  <p>
                    Carefully review the loan terms before signing any agreement. Understand the repayment schedule, interest rates, 
                    and consequences of late or missed payments. Avoid lenders who pressure you to sign quickly without giving you time 
                    to read and understand the contract.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Customer Service Quality
                  </h3>
                  <p>
                    Good customer service is crucial, especially if you encounter issues during repayment. Visit the lender's location 
                    or call to assess their responsiveness and professionalism. Staff should be knowledgeable, patient, and willing to 
                    answer your questions clearly.
                  </p>
                </div>
              </div>
            </section>

            {/* Understanding Loan Regulations Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Understanding Loan Regulations and Your Rights
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Financial regulations vary significantly by state, and understanding your rights as a borrower is essential. Here's 
                  what you need to know:
                </p>
                
                <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    State-Specific Regulations
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Each state sets its own rules for payday loans and other financial services. Some states cap interest rates, limit 
                    loan amounts, or restrict rollovers. For example:
                  </p>
                  <ul style={{ marginLeft: '2rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>California allows payday loans up to $300 with a maximum fee of 15%</li>
                    <li style={{ marginBottom: '0.5rem' }}>Texas has fewer restrictions, allowing loans up to the greater of $500 or 20% of gross monthly income</li>
                    <li style={{ marginBottom: '0.5rem' }}>Some states like New York and Connecticut prohibit payday lending entirely</li>
                  </ul>
                </div>

                <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Your Rights as a Borrower
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Federal and state laws protect borrowers. You have the right to:
                  </p>
                  <ul style={{ marginLeft: '2rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Receive clear disclosure of all fees and interest rates before signing</li>
                    <li style={{ marginBottom: '0.5rem' }}>Cancel the loan within a specified period (usually 1-3 business days) without penalty</li>
                    <li style={{ marginBottom: '0.5rem' }}>File complaints with state regulators if you believe a lender violated regulations</li>
                    <li style={{ marginBottom: '0.5rem' }}>Protection from harassment or abusive collection practices</li>
                    <li style={{ marginBottom: '0.5rem' }}>Access to your loan documents and payment history</li>
                  </ul>
                </div>

                <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Red Flags to Avoid
                  </h3>
                  <p style={{ marginBottom: '1rem' }}>
                    Watch out for these warning signs that indicate a potentially problematic lender:
                  </p>
                  <ul style={{ marginLeft: '2rem', listStyleType: 'disc' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Lenders who don't check your ability to repay</li>
                    <li style={{ marginBottom: '0.5rem' }}>Pressure to borrow more than you need</li>
                    <li style={{ marginBottom: '0.5rem' }}>Unclear or confusing loan terms</li>
                    <li style={{ marginBottom: '0.5rem' }}>Requests for upfront fees before loan approval</li>
                    <li style={{ marginBottom: '0.5rem' }}>Lenders not registered or licensed in your state</li>
                    <li style={{ marginBottom: '0.5rem' }}>Threats or aggressive collection tactics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Tips for First-Time Borrowers Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
                Tips for First-Time Borrowers
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  If you're new to borrowing from alternative lenders, these tips will help you navigate the process safely and effectively:
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Borrow Only What You Need
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      It's tempting to borrow more than necessary, but remember you'll need to repay everything plus interest and fees. 
                      Calculate exactly how much you need and stick to that amount.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Read Everything Carefully
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Don't rush through loan documents. Take time to read and understand all terms, fees, and repayment requirements. 
                      Ask questions if anything is unclear.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Have a Repayment Plan
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Before borrowing, ensure you have a clear plan for repaying the loan. Consider your income, expenses, and other 
                      financial obligations to avoid default.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Compare Multiple Options
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Don't accept the first offer you receive. Use our locator to compare rates, fees, and terms from multiple lenders 
                      to find the best deal.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Keep Records
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Save all loan documents, payment receipts, and correspondence with the lender. These records are essential if 
                      disputes arise later.
                    </p>
                  </div>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>
                      Know Your Alternatives
                    </h4>
                    <p style={{ fontSize: '1rem' }}>
                      Before taking out a high-interest loan, explore alternatives like credit union loans, payment plans with creditors, 
                      or assistance programs that might offer better terms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs Section */}
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
                Frequently Asked Questions About Finding Local Lenders
              </h2>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
                
                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How accurate is the store locator?
                  </h3>
                  <p>
                    Our store locator uses real-time data from multiple sources to provide accurate location information. However, 
                    we recommend calling ahead to verify hours, availability, and current loan terms, as these can change frequently.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Can I apply for a loan online through the locator?
                  </h3>
                  <p>
                    While our locator helps you find physical locations, many lenders also offer online applications. Check individual 
                    lender listings for online application options. Some lenders allow you to start the process online and complete 
                    it in-store, which can save time.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    What documents do I need to bring to a lender?
                  </h3>
                  <p>
                    Requirements vary by lender and loan type, but typically you'll need: a valid government-issued ID, proof of income 
                    (pay stubs, bank statements), proof of address (utility bill, lease), and a checking account statement. Some lenders 
                    may require additional documentation, so call ahead to confirm.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    How do I know if a lender is legitimate?
                  </h3>
                  <p>
                    Verify the lender is licensed in your state through your state's Department of Financial Institutions. Check online 
                    reviews, Better Business Bureau ratings, and look for red flags like requests for upfront fees or pressure to sign 
                    immediately. Legitimate lenders will provide clear information about rates, fees, and terms.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    What's the difference between online and in-person lenders?
                  </h3>
                  <p>
                    Online lenders offer convenience and often faster processing, while in-person lenders provide face-to-face service 
                    and immediate cash access. Online lenders may have lower overhead costs, potentially offering better rates, while 
                    in-person lenders allow you to ask questions directly and receive funds immediately.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                    Can I use the locator on my mobile device?
                  </h3>
                  <p>
                    Yes! Our store locator is fully optimized for mobile devices. You can search for lenders while on the go, get 
                    directions to locations, and even call lenders directly from your phone. The mobile interface makes it easy to 
                    find nearby lenders when you need them most.
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion Section */}
            <section className="cta-section" style={{ marginTop: '2rem' }}>
              <h2 className="cta-title">
                Start Your Search Today
              </h2>
              <p className="cta-description">
                Finding the right lender doesn't have to be complicated. Our comprehensive store locator tool makes it easy to 
                compare options, read reviews, and find trusted financial service providers in your area. Whether you need a payday 
                loan, personal loan, or other financial services, start your search above to find the best options near you.
              </p>
              <p style={{ fontSize: '1rem', opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>
                Remember to always borrow responsibly, read all terms carefully, and only work with licensed, reputable lenders. 
                If you have questions or concerns about a lender, contact your state's financial regulatory agency for assistance.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

