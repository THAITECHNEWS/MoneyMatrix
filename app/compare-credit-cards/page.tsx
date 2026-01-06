import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Credit Cards 2025 | Best Rewards & Rates | MoneyMatrix.me',
  description: 'Compare credit cards from top issuers. Find the best rewards, cashback, travel benefits, and low APR offers. Compare annual fees, sign-up bonuses, and features.',
};

interface CreditCardOption {
  card: string;
  issuer: string;
  annualFee: string;
  aprRange: string;
  rewardsRate: string;
  signUpBonus: string;
  creditScore: string;
  bestFor: string;
  highlights: string[];
}

const creditCards: CreditCardOption[] = [
  {
    card: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    annualFee: '$95',
    aprRange: '21.49% - 28.49%',
    rewardsRate: '2x points on travel & dining, 1x on all else',
    signUpBonus: '60,000 points ($750 value)',
    creditScore: '690+',
    bestFor: 'Travel rewards',
    highlights: ['Transfer partners', 'Travel insurance', 'No foreign transaction fees', '25% point redemption bonus'],
  },
  {
    card: 'Capital One Venture Rewards',
    issuer: 'Capital One',
    annualFee: '$95',
    aprRange: '19.99% - 29.99%',
    rewardsRate: '2x miles on every purchase',
    signUpBonus: '75,000 miles ($750 value)',
    creditScore: '670+',
    bestFor: 'Simple travel rewards',
    highlights: ['Flexible redemption', 'No foreign transaction fees', 'Travel benefits', 'Global acceptance'],
  },
  {
    card: 'Citi Double Cash',
    issuer: 'Citi',
    annualFee: '$0',
    aprRange: '19.24% - 29.24%',
    rewardsRate: '2% cash back (1% when you buy, 1% when you pay)',
    signUpBonus: 'None',
    creditScore: '670+',
    bestFor: 'Cashback simplicity',
    highlights: ['No annual fee', 'Unlimited 2% cashback', 'No categories to track', 'Citi ThankYou points option'],
  },
  {
    card: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    annualFee: '$0',
    aprRange: '20.49% - 29.24%',
    rewardsRate: '5% on travel, 3% on dining & drugstores, 1.5% on all else',
    signUpBonus: '$200 after $500 spend',
    creditScore: '670+',
    bestFor: 'Everyday spending',
    highlights: ['No annual fee', 'Flexible rewards', 'Chase Ultimate Rewards', 'Intro APR available'],
  },
  {
    card: 'American Express Gold Card',
    issuer: 'American Express',
    annualFee: '$250',
    aprRange: '19.24% - 28.24%',
    rewardsRate: '4x points on dining & groceries, 3x on flights, 1x on all else',
    signUpBonus: '60,000 points ($600 value)',
    creditScore: '700+',
    bestFor: 'Dining & groceries',
    highlights: ['Dining credits', 'Uber credits', 'Transfer partners', 'Premium benefits'],
  },
  {
    card: 'Wells Fargo Active Cash',
    issuer: 'Wells Fargo',
    annualFee: '$0',
    aprRange: '20.24% - 29.99%',
    rewardsRate: '2% cash back on all purchases',
    signUpBonus: '$200 after $500 spend',
    creditScore: '670+',
    bestFor: 'Flat-rate cashback',
    highlights: ['No annual fee', 'Unlimited 2% cashback', 'Cell phone protection', 'No categories'],
  },
  {
    card: 'Discover it Cash Back',
    issuer: 'Discover',
    annualFee: '$0',
    aprRange: '17.24% - 28.24%',
    rewardsRate: '5% rotating categories, 1% on all else',
    signUpBonus: 'Cashback match first year',
    creditScore: '670+',
    bestFor: 'Rotating categories',
    highlights: ['No annual fee', 'First-year cashback match', 'No foreign transaction fees', 'Free FICO score'],
  },
  {
    card: 'Bank of America Customized Cash Rewards',
    issuer: 'Bank of America',
    annualFee: '$0',
    aprRange: '18.24% - 28.24%',
    rewardsRate: '3% in chosen category, 2% groceries/wholesale, 1% on all else',
    signUpBonus: '$200 after $1,000 spend',
    creditScore: '670+',
    bestFor: 'Category flexibility',
    highlights: ['No annual fee', 'Choose your 3% category', 'Preferred Rewards bonus', 'Online shopping bonus'],
  },
];

export default function CompareCreditCardsPage() {
  return (
    <>
      <section className="category-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link> → <span>Compare Credit Cards</span>
          </nav>
          <h1>Compare Credit Cards: Find the Best Rewards & Rates</h1>
          <p style={{ fontSize: '1.25rem', marginTop: '1rem', maxWidth: '800px' }}>
            Compare credit cards from top issuers. Find the best rewards programs, cashback rates, travel benefits, and low APR offers to maximize your spending power.
          </p>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          
          {/* Introduction Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
              Credit Card Comparison Guide
            </h2>
            <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Choosing the right credit card can save you hundreds or even thousands of dollars annually through rewards, 
                cashback, and sign-up bonuses. With hundreds of options available, comparing features, fees, and benefits 
                is essential to find the card that matches your spending habits and financial goals.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>Key factors to consider:</strong> Annual fee, rewards rate, sign-up bonus value, APR, credit score 
                requirements, and card benefits. The best credit card for you depends on how you spend, whether you carry a 
                balance, and what benefits matter most to your lifestyle.
              </p>
            </div>
          </section>

          {/* Comparison Table */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
              Credit Card Comparison Table
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Card</th>
                    <th>Issuer</th>
                    <th>Annual Fee</th>
                    <th>APR Range</th>
                    <th>Rewards Rate</th>
                    <th>Sign-Up Bonus</th>
                    <th>Credit Score</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {creditCards.map((card, index) => (
                    <tr key={index}>
                      <td className="feature-name" style={{ fontWeight: 700 }}>{card.card}</td>
                      <td>{card.issuer}</td>
                      <td style={{ color: card.annualFee === '$0' ? 'var(--success-color)' : '#111827', fontWeight: 600 }}>
                        {card.annualFee}
                      </td>
                      <td>{card.aprRange}</td>
                      <td style={{ fontSize: '0.9375rem' }}>{card.rewardsRate}</td>
                      <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{card.signUpBonus}</td>
                      <td>{card.creditScore}</td>
                      <td>{card.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detailed Card Information */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>
              Detailed Card Information
            </h2>
            <div style={{ display: 'grid', gap: '2rem' }}>
              {creditCards.map((card, index) => (
                <div key={index} style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
                        {card.card}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '1rem' }}>{card.issuer}</p>
                    </div>
                    <div style={{ 
                      background: card.annualFee === '$0' ? '#f0fdf4' : '#fef3c7', 
                      color: card.annualFee === '$0' ? '#166534' : '#92400e',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}>
                      {card.annualFee} Annual Fee
                    </div>
                  </div>
                  <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '1rem' }}>
                    <strong>Best For:</strong> {card.bestFor}
                  </p>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#111827' }}>Key Highlights:</strong>
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: '#374151' }}>
                      {card.highlights.map((highlight, i) => (
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
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Rewards Rate</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{card.rewardsRate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Sign-Up Bonus</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-color)' }}>{card.signUpBonus}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>APR Range</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600 }}>{card.aprRange}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card Types Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
              Types of Credit Cards
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Cashback Cards
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Earn cash back on purchases, typically ranging from 1% to 5% depending on spending categories. 
                  Best for those who want simple, straightforward rewards without tracking points or miles.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                  <strong>Best Options:</strong> Citi Double Cash, Wells Fargo Active Cash, Chase Freedom Unlimited
                </p>
              </div>

              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Travel Rewards Cards
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Earn points or miles that can be redeemed for flights, hotels, and travel expenses. Often include 
                  travel insurance, airport lounge access, and no foreign transaction fees.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                  <strong>Best Options:</strong> Chase Sapphire Preferred, Capital One Venture, American Express Gold
                </p>
              </div>

              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Balance Transfer Cards
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Offer 0% APR introductory periods (typically 12-21 months) to help you pay down existing credit card debt. 
                  Usually charge a balance transfer fee of 3% to 5% of the transferred amount.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                  <strong>Best Options:</strong> Citi Diamond Preferred, Discover it Balance Transfer, BankAmericard
                </p>
              </div>

              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Low APR Cards
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Feature lower interest rates for those who carry a balance. Ideal for borrowers who need to finance 
                  purchases over time and want to minimize interest charges.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                  <strong>Best Options:</strong> U.S. Bank Visa Platinum, Citi Diamond Preferred, Wells Fargo Reflect
                </p>
              </div>

              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Secured Cards
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Require a security deposit that becomes your credit limit. Perfect for building or rebuilding credit. 
                  Many secured cards offer rewards and can be upgraded to unsecured cards after responsible use.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                  <strong>Best Options:</strong> Discover it Secured, Capital One Platinum Secured, Citi Secured
                </p>
              </div>

              <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Business Cards
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Designed for business expenses with higher credit limits, expense tracking tools, and rewards on 
                  business categories like office supplies, internet, and travel.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
                  <strong>Best Options:</strong> Chase Ink Business Preferred, American Express Business Gold, Capital One Spark Cash
                </p>
              </div>

            </div>
          </section>

          {/* How to Choose Section */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>
              How to Choose the Right Credit Card
            </h2>
            <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  1. Assess Your Spending Habits
                </h3>
                <p>
                  Analyze where you spend the most money. If you spend heavily on groceries and dining, a card with bonus 
                  rewards in those categories makes sense. If your spending is spread evenly, a flat-rate cashback card 
                  may be better. Track your spending for a month to identify patterns.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  2. Consider the Annual Fee
                </h3>
                <p>
                  Annual fees range from $0 to $700+. Calculate whether the rewards and benefits justify the fee. For example, 
                  a $95 annual fee card that earns $500+ in value annually is worth it, while a $0 fee card might be better 
                  if you don't spend enough to offset the fee. Many premium cards offer credits that effectively reduce or 
                  eliminate the annual fee.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  3. Evaluate Sign-Up Bonuses
                </h3>
                <p>
                  Sign-up bonuses can be worth $200 to $1,000+ in value. However, they typically require spending $1,000 
                  to $15,000 within the first 3-6 months. Only pursue bonuses you can naturally meet through regular spending. 
                  Don't overspend just to earn a bonus, as that defeats the purpose.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  4. Check Your Credit Score
                </h3>
                <p>
                  Your credit score determines which cards you qualify for. Premium travel cards typically require scores of 
                  700+, while basic cashback cards may accept scores as low as 670. Check your credit score before applying 
                  to avoid unnecessary hard inquiries that can temporarily lower your score.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  5. Understand APR vs. Rewards
                </h3>
                <p>
                  If you carry a balance, prioritize low APR over rewards. Paying 20%+ APR negates any rewards earned. If you 
                  pay in full monthly, focus on maximizing rewards. The best strategy is to use rewards cards but always pay 
                  the full balance to avoid interest charges.
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
                  How many credit cards should I have?
                </h3>
                <p>
                  There's no magic number, but having 2-5 credit cards can help build credit and maximize rewards. More cards 
                  mean more available credit (which improves credit utilization) and access to different rewards categories. 
                  However, only open cards you can manage responsibly and avoid opening too many accounts quickly, as this can 
                  temporarily lower your credit score.
                </p>
              </div>

              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Should I pay an annual fee for a credit card?
                </h3>
                <p>
                  Pay an annual fee only if the card's benefits and rewards exceed the fee cost. For example, a $95 annual fee 
                  card that earns you $300+ in value annually is worth it. Calculate your expected rewards value based on your 
                  spending patterns. If you're unsure, start with a no-annual-fee card and upgrade later if needed.
                </p>
              </div>

              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  What's the difference between cashback and points?
                </h3>
                <p>
                  Cashback cards provide straightforward cash rewards (typically 1-5% back) that can be redeemed as statement 
                  credits or direct deposits. Points cards offer more flexibility - points can be redeemed for cash, travel, 
                  gift cards, or transferred to airline/hotel partners for potentially higher value. Points often provide better 
                  value when transferred to travel partners, while cashback is simpler and more predictable.
                </p>
              </div>

              <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  How do I maximize credit card rewards?
                </h3>
                <p>
                  Use cards strategically: use category bonus cards for specific spending (dining, groceries, gas), flat-rate 
                  cards for everything else, and travel cards for travel expenses. Pay balances in full monthly to avoid interest, 
                  which negates rewards. Take advantage of sign-up bonuses, but only if you can meet spending requirements 
                  naturally. Consider combining multiple cards to maximize different categories.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                  Will applying for a credit card hurt my credit score?
                </h3>
                <p>
                  Applying for a credit card causes a hard inquiry, which may temporarily lower your score by 5-10 points. 
                  However, if approved, the new credit line can improve your credit utilization ratio and payment history, 
                  potentially increasing your score over time. The impact is usually minimal and temporary. Avoid applying for 
                  multiple cards within a short period.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section" style={{ marginTop: '4rem' }}>
            <div className="container">
              <h2>Ready to Compare Credit Cards?</h2>
              <p>Find the perfect credit card for your spending habits and financial goals. Compare rewards, fees, and benefits to maximize your value.</p>
              <div className="hero-buttons">
                <Link href="/credit-cards" className="btn btn-primary">View All Cards</Link>
                <Link href="/" className="btn btn-secondary">Back to Home</Link>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}



