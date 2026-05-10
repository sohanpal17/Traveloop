import React from 'react';

const PackingList = ({ checklist, onAdd, onToggle }) => {
  const packedCount = checklist.filter(i => i.is_packed).length;
  const progress = checklist.length > 0 ? (packedCount / checklist.length) * 100 : 0;

  return (
    <div className="main-content">
      <div className="content-card" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Preparation Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#2563eb', transition: '0.5s' }}></div>
        </div>
      </div>

      <div className="content-card">
        <h3>Items to Pack</h3>
        <form onSubmit={onAdd} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
          <input name="item" placeholder="Add essential item..." style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <button type="submit" style={{ padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Add</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {checklist.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px', 
              background: item.is_packed ? '#f8fafc' : 'white', 
              border: '1px solid #f1f5f9', 
              borderRadius: '10px', 
              gap: '15px' 
            }}>
              <input 
                type="checkbox" 
                checked={item.is_packed} 
                onChange={() => onToggle(item.id, item.is_packed)} 
                style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
              />
              <span style={{ 
                flex: 1, 
                textDecoration: item.is_packed ? 'line-through' : 'none', 
                color: item.is_packed ? '#94a3b8' : '#1e293b', 
                fontWeight: '500' 
              }}>
                {item.item_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackingList;