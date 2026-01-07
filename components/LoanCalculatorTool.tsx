'use client';

import { useState, useMemo } from 'react';

interface PaymentBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanCalculatorTool() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(60);

  // Calculate monthly payment using standard amortization formula
  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number): number => {
    if (months === 0 || annualRate === 0) return principal;
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  // Calculate payment breakdown
  const paymentBreakdown = useMemo((): PaymentBreakdown[] => {
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    const monthlyRate = interestRate / 100 / 12;
    const breakdown: PaymentBreakdown[] = [];
    let balance = loanAmount;

    for (let month = 1; month <= loanTerm; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);

      breakdown.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        balance: Math.max(0, balance),
      });
    }

    return breakdown;
  }, [loanAmount, interestRate, loanTerm]);

  const monthlyPayment = useMemo(() => {
    return calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
  }, [loanAmount, interestRate, loanTerm]);

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

  return (
    <div className="loan-calculator-tool">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Calculator Form */}
        <div className="calculator-form">
          <div className="calculator-inputs">
            {/* Loan Amount */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="loan-amount">
                Loan Amount
              </label>
              <div className="calculator-value-display">
                {formatCurrency(loanAmount)}
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="loan-amount"
                  min="1000"
                  max="500000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>$1,000</span>
                  <span>$250,000</span>
                  <span>$500,000</span>
                </div>
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
                  min="0"
                  max="30"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>0%</span>
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            {/* Loan Term */}
            <div className="calculator-input-group">
              <label className="calculator-label" htmlFor="loan-term">
                Loan Term (months)
              </label>
              <div className="calculator-value-display">
                {loanTerm} months ({Math.round(loanTerm / 12)} years)
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  id="loan-term"
                  min="12"
                  max="360"
                  step="12"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="calculator-slider"
                />
                <div className="slider-labels">
                  <span>1 year</span>
                  <span>15 years</span>
                  <span>30 years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="calculator-results">
            <div className="result-card">
              <div className="result-label">Monthly Payment</div>
              <div className="result-value primary">{formatCurrency(monthlyPayment)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Total Interest</div>
              <div className="result-value">{formatCurrency(totalInterest)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Total Amount</div>
              <div className="result-value">{formatCurrency(totalAmount)}</div>
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
                {loanTerm > 12 && (
                  <tr className="breakdown-summary">
                    <td colSpan={5} style={{ textAlign: 'center', padding: '1rem', fontWeight: 600 }}>
                      ... and {formatNumber(loanTerm - 12)} more payments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

