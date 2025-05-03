import React from 'react';

export default function ControlPanel({ rect, onChange, onDraw}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...rect, [name]: parseFloat(value) });
  };
  return (
    <div className="control-panel">
      <div className="view-control">
        <div className="range-input">
          <label>X </label>
          <input type="number" className="number-input" name="xMin" value={rect.xMin} onChange={handleChange} />
          <label>~</label>
          <input type="number" className="number-input" name="xMax" value={rect.xMax} onChange={handleChange} />
        </div>
        <div className="range-input">
          <label>Y </label>
          <input type="number" className="number-input" name="yMin" value={rect.yMin} onChange={handleChange} />
          <label>~</label>
          <input type="number" className="number-input" name="yMax" value={rect.yMax} onChange={handleChange} />
        </div>
      </div>
      <button onClick={onDraw}>Draw</button>
    </div>
  );
}
