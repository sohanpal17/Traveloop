import React from 'react';

const Budget = ({ activities }) => {
  const total = activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);

  return (
    <div className="main-content">
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="content-card" style={{ flex: 1, borderLeft: '5px solid #059669' }}>
          <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>TOTAL BUDGET</span>
          <h2 style={{ fontSize: '28px', margin: '10px 0' }}>${total.toLocaleString()}</h2>
          <div style={{ fontSize: '12px', color: '#059669' }}>▲ 12% from last trip</div>
        </div>
        <div className="content-card" style={{ flex: 1, borderLeft: '5px solid #2563eb' }}>
          <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>EXPENSES COUNT</span>
          <h2 style={{ fontSize: '28px', margin: '10px 0' }}>{activities.length} Items</h2>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Current Itinerary</div>
        </div>
      </div>

      <div className="content-card">
        <h3 style={{ marginBottom: '20px' }}>Expense Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>CATEGORY</th>
              <th style={{ padding: '12px' }}>DESCRIPTION</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}><span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{act.category || 'Travel'}</span></td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{act.title}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>${Number(act.cost).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {activities.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No expenses found.</p>}
      </div>
    </div>
  );
};

export default Budget;