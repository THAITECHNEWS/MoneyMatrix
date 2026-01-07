'use client';

import { useState, useMemo } from 'react';
import EmailCaptureModal from './EmailCaptureModal';

interface PaymentBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function MortgageCalculatorTool() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(4800);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [hoaFees, setHoaFees] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate loan amount
  const loanAmount = useMemo(() => {
    return homePrice - downPayment;
  }, [homePrice, downPayment]);

  // Calculate PMI (0.5% to 1% annually if down payment < 20%)
  const pmiAnnual = useMemo(() => {
    if (downPaymentPercent >= 20) return 0;
    return loanAmount * 0.005; // 0.5% annual PMI
  }, [loanAmount, downPaymentPercent]);

  // Calculate monthly payment using standard amortization formula
  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number): number => {
    if (months === 0 || annualRate === 0) return principal;
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  // Calculate principal and interest payment
  const principalAndInterest = useMemo(() => {
    return calculateMonthlyPayment(loanAmount, interestRate, loanTerm * 12);
  }, [loanAmount, interestRate, loanTerm]);

  // Calculate total monthly payment (P&I + taxes + insurance + PMI + HOA)
  const totalMonthlyPayment = useMemo(() => {
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const monthlyPMI = pmiAnnual / 12;
    return principalAndInterest + monthlyTax + monthlyInsurance + monthlyPMI + hoaFees;
  }, [principalAndInterest, propertyTax, homeInsurance, pmiAnnual, hoaFees]);

  // Calculate payment breakdown
  const paymentBreakdown = useMemo((): PaymentBreakdown[] => {
    const monthlyRate = interestRate / 100 / 12;
    const breakdown: PaymentBreakdown[] = [];
    let balance = loanAmount;

    for (let month = 1; month <= loanTerm * 12; month++) {
      const interest = balance * monthlyRate;
      const principal = principalAndInterest - interest;
      balance = Math.max(0, balance - principal);

      breakdown.push({
        month,
        payment: principalAndInterest,
        principal,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return breakdown;
  }, [loanAmount, interestRate, loanTerm, principalAndInterest]);

  const totalInterest = useMemo(() => {
    return paymentBreakdown.reduce((sum, payment) => sum + payment.interest, 0);
  }, [paymentBreakdown]);

  const totalAmount = useMemo(() => {
    return loanAmount + totalInterest;
  }, [loanAmount, totalInterest]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Sync down payment amount and percentage
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercent((value / homePrice) * 100);
  };

  const handleDownPaymentPercentChange = (value: number) => {
    setDownPaymentPercent(value);
    setDownPayment((homePrice * value) / 100);
  };

  const handleHomePriceChange = (value: number) => {
    setHomePrice(value);
    // Adjust down payment to maintain percentage if possible
    const newDownPayment = (value * downPaymentPercent) / 100;
    if (newDownPayment <= value) {
      setDownPayment(newDownPayment);
    }
  };

  return (
    <div className="mortgage-calculator-tool">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Calculator Form */}
        <div className="calculator-form">
          <div className="calculator-inputs">
            {/* Home Price */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="home-price">
                Home Price
              </label>
              <div className="calculator-value-display">
                {formatCurrency(homePrice)}
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="home-price"
                  min="50000"
                  max="2000000"
                  step="5000"
                  value={homePrice}
                  onChange={(e) => handleHomePriceChange(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>$50K</span>
                  <span>$1M</span>
                  <span>$2M</span>
                </div>
              </div>
            </div>

            {/* Down Payment */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="down-payment">
                Down Payment
              </label>
              <div className="calculator-value-display">
                {formatCurrency(downPayment)} ({downPaymentPercent.toFixed(1)}%)
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="down-payment"
                  min="0"
                  max={homePrice}
                  step="1000"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>{formatCurrency(homePrice * 0.5)}</span>
                  <span>{formatCurrency(homePrice)}</span>
                </div>
              </div>
              <div className="down-payment-buttons">
                <button
                  type="button"
                  className={`down-payment-btn ${downPaymentPercent === 3.5 ? 'active' : ''}`}
                  onClick={() => handleDownPaymentPercentChange(3.5)}
                >
                  3.5%
                </button>
                <button
                  type="button"
                  className={`down-payment-btn ${downPaymentPercent === 10 ? 'active' : ''}`}
                  onClick={() => handleDownPaymentPercentChange(10)}
                >
                  10%
                </button>
                <button
                  type="button"
                  className={`down-payment-btn ${downPaymentPercent === 20 ? 'active' : ''}`}
                  onClick={() => handleDownPaymentPercentChange(20)}
                >
                  20%
                </button>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="interest-rate">
                Interest Rate (%)
              </label>
              <div className="calculator-value-display">
                {interestRate.toFixed(2)}%
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="interest-rate"
                  min="2"
                  max="12"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>2%</span>
                  <span>7%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>

            {/* Loan Term */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="loan-term">
                Loan Term
              </label>
              <div className="calculator-value-display">
                {loanTerm} years
              </div>
              <div className="loan-term-buttons">
                <button
                  type="button"
                  className={`loan-term-btn ${loanTerm === 15 ? 'active' : ''}`}
                  onClick={() => setLoanTerm(15)}
                >
                  15 years
                </button>
                <button
                  type="button"
                  className={`loan-term-btn ${loanTerm === 30 ? 'active' : ''}`}
                  onClick={() => setLoanTerm(30)}
                >
                  30 years
                </button>
              </div>
            </div>

            {/* Property Tax */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="property-tax">
                Annual Property Tax
              </label>
              <div className="calculator-value-display">
                {formatCurrency(propertyTax)}
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="property-tax"
                  min="0"
                  max="20000"
                  step="100"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$10K</span>
                  <span>$20K</span>
                </div>
              </div>
            </div>

            {/* Home Insurance */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="home-insurance">
                Annual Home Insurance
              </label>
              <div className="calculator-value-display">
                {formatCurrency(homeInsurance)}
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="home-insurance"
                  min="0"
                  max="5000"
                  step="100"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$2.5K</span>
                  <span>$5K</span>
                </div>
              </div>
            </div>

            {/* HOA Fees */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="hoa-fees">
                Monthly HOA Fees
              </label>
              <div className="calculator-value-display">
                {formatCurrency(hoaFees)}
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="hoa-fees"
                  min="0"
                  max="1000"
                  step="10"
                  value={hoaFees}
                  onChange={(e) => setHoaFees(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span>$500</span>
                  <span>$1K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="calculator-results">
            <div className="result-card">
              <div className="result-label">Principal & Interest</div>
              <div className="result-value">{formatCurrency(principalAndInterest)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Property Tax</div>
              <div className="result-value">{formatCurrency(propertyTax / 12)}</div>
              <div className="result-sublabel">per month</div>
            </div>
            <div className="result-card">
              <div className="result-label">Home Insurance</div>
              <div className="result-value">{formatCurrency(homeInsurance / 12)}</div>
              <div className="result-sublabel">per month</div>
            </div>
            {pmiAnnual > 0 && (
              <div className="result-card">
                <div className="result-label">PMI</div>
                <div className="result-value">{formatCurrency(pmiAnnual / 12)}</div>
                <div className="result-sublabel">per month</div>
              </div>
            )}
            {hoaFees > 0 && (
              <div className="result-card">
                <div className="result-label">HOA Fees</div>
                <div className="result-value">{formatCurrency(hoaFees)}</div>
                <div className="result-sublabel">per month</div>
              </div>
            )}
            <div className="result-card primary-result">
              <div className="result-label">Total Monthly Payment</div>
              <div className="result-value primary">{formatCurrency(totalMonthlyPayment)}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mortgage-summary">
            <div className="summary-row">
              <span className="summary-label">Loan Amount:</span>
              <span className="summary-value">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Total Interest Paid:</span>
              <span className="summary-value">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Total Amount Paid:</span>
              <span className="summary-value">{formatCurrency(totalAmount + (propertyTax * loanTerm) + (homeInsurance * loanTerm) + (pmiAnnual * loanTerm) + (hoaFees * 12 * loanTerm))}</span>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Table */}
        <div className="payment-breakdown">
          <h3 className="breakdown-title">Payment Breakdown</h3>
          <div className="breakdown-table-container">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {paymentBreakdown.slice(0, 12).map((payment) => (
                  <tr key={payment.month}>
                    <td>{payment.month}</td>
                    <td>{formatCurrency(payment.payment)}</td>
                    <td>{formatCurrency(payment.principal)}</td>
                    <td>{formatCurrency(payment.interest)}</td>
                    <td>{formatCurrency(payment.balance)}</td>
                  </tr>
                ))}
                {loanTerm * 12 > 12 && (
                  <tr className="breakdown-summary">
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                      <button 
                        type="button"
                        className="download-report-link"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '18px', height: '18px', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download full report ({formatNumber(loanTerm * 12 - 12)} more payments)
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatorType="mortgage"
        totalPayments={loanTerm * 12}
      />
    </div>
  );
}

