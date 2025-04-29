import React from 'react';

export default function ControlPanel({ rect, onChange, onDraw }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...rect, [name]: parseFloat(value) });
  };
  return (
    <div className="control-panel">
      <div className="range-input">
        <label>x min:</label>
        <input type="number" name="xMin" value={rect.xMin} onChange={handleChange} />
        <label>~</label>
        <input type="number" name="xMax" value={rect.xMax} onChange={handleChange} />
      </div>
      <div className="range-input">
        <label>y min:</label>
        <input type="number" name="yMin" value={rect.yMin} onChange={handleChange} />
        <label>~</label>
        <input type="number" name="yMax" value={rect.yMax} onChange={handleChange} />
      </div>
      <button onClick={onDraw}>그리기</button>
    </div>
  );
}
