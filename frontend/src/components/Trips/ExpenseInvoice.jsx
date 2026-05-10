import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExpenseInvoice.css';

const ExpenseInvoice = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data
  const tripDetails = {
    title: 'Trip to Europe Adventure',
    dates: 'May 15 - Jun 05, 2025 - 4 cities',
    creator: 'James',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80'
  };

  const invoiceDetails = {
    id: 'INV-xyz-30290',
    date: 'May 20, 2025',
    travelers: ['James', 'Arjun', 'Jerry', 'Cristina'],
    status: 'pending'
  };

  const budgetStats = {
    totalBudget: 20000,
    totalSpent: 22000,
    remaining: -2000
  };

  const expenseItems = [
    { id: 1, category: 'hotel', description: 'hotel booking paris', qty: '3 nights', unitCost: 3000, amount: 9000 },
    { id: 2, category: 'travel', description: 'flight bookings (DEL -> PAR)', qty: '1', unitCost: 12000, amount: 12000 }
  ];

  const subtotal = 21000;
  const tax = 1050; // 5%
  const discount = 50;
  const grandTotal = 22000;

  return (
    <div className="invoice-shell">
      <div className="invoice-background"></div>

      <div className="invoice-card">
        {/* Top Navbar */}
        <header className="invoice-topbar">
          <div className="brand-row" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Traveloop</span>
          </div>

          <div className="invoice-toolbar-inline">
            <label className="search-input" aria-label="Search invoices">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices......"
              />
            </label>
            <button className="toolbar-btn">Filter</button>
            <button className="toolbar-btn">Sort ↕</button>
          </div>

          <button className="profile-badge">U</button>
        </header>

        {/* Back Link */}
        <button className="back-link-btn" onClick={() => navigate('/trips')}>
          &larr; back to My Trips
        </button>

        {/* Top Metadata Row */}
        <div className="invoice-meta-row">
          
          {/* Trip Info Block */}
          <div className="meta-block trip-info-block">
            <div className="trip-thumb" style={{ backgroundImage: `url(${tripDetails.image})` }}></div>
            <div className="trip-text">
              <h3>{tripDetails.title}</h3>
              <p>{tripDetails.dates}</p>
              <p className="creator">created by {tripDetails.creator}</p>
            </div>
          </div>

          {/* Invoice Details Block */}
          <div className="meta-block invoice-details-block">
            <div className="details-col">
              <p><strong>Invoice Id</strong><br/>{invoiceDetails.id}</p>
              <p style={{ marginTop: '16px' }}><strong>Traveler Details:</strong><br/>
                {invoiceDetails.travelers.map((t, i) => <span key={i} style={{ display: 'block' }}>{t}</span>)}
              </p>
            </div>
            <div className="details-col right-align">
              <p><strong>Generated date</strong><br/>{invoiceDetails.date}</p>
              <p style={{ marginTop: '16px' }}><strong>Payment status</strong> - {invoiceDetails.status}</p>
            </div>
          </div>

          {/* Budget Insights Block */}
          <div className="meta-block budget-insights-block">
            <h4 className="insights-title">budget Insights</h4>
            <div className="insights-content">
              
              {/* Dummy pie chart using CSS conic-gradient */}
              <div className="pie-chart-placeholder" style={{
                background: `conic-gradient(
                  #ef4444 0% 55%, 
                  #2f2a28 55% 100%
                )`
              }}></div>
              
              <div className="insights-stats">
                <p>Total Budget: ${budgetStats.totalBudget}</p>
                <p>total spent: ${budgetStats.totalSpent}</p>
                <p style={{ color: budgetStats.remaining < 0 ? '#ef4444' : '#10b981' }}>
                  Remaining: ${budgetStats.remaining}
                </p>
              </div>
            </div>
            <button className="action-btn outline btn-full-budget" onClick={() => alert('View Full Budget')}>
              View Full Budget
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Description</th>
                <th>Qty/details</th>
                <th>Unit Cost</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseItems.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.qty}</td>
                  <td>${item.unitCost}</td>
                  <td>${item.amount}</td>
                </tr>
              ))}
              {/* Empty rows to match wireframe visual */}
              <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="no-border-bottom"></td>
                <td className="summary-label">Subtotal</td>
                <td className="summary-value">${subtotal}</td>
              </tr>
              <tr>
                <td colSpan="4" className="no-border-bottom"></td>
                <td className="summary-label">tax(5%)</td>
                <td className="summary-value">${tax}</td>
              </tr>
              <tr>
                <td colSpan="4" className="no-border-bottom border-bottom-thick"></td>
                <td className="summary-label border-bottom-thick">Discount</td>
                <td className="summary-value border-bottom-thick">${discount}</td>
              </tr>
              <tr>
                <td colSpan="4" className="no-border-bottom"></td>
                <td className="summary-label grand-total">Grand Total</td>
                <td className="summary-value grand-total">${grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="invoice-actions">
          <div className="left-actions">
            <button className="action-btn outline">Download Invoice</button>
            <button className="action-btn outline">Export as PDF</button>
          </div>
          <button className="action-btn">Mark as paid</button>
        </div>

      </div>
    </div>
  );
};

export default ExpenseInvoice;
