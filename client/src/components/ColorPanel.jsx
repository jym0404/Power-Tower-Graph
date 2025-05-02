import React, { useState, useEffect } from "react";

export default function ColorPanel({ onChange }) {
    const [rgb1, setRgb1] = useState({ r: 0, g: 0, b: 0 });
    const [rgb2, setRgb2] = useState({ r: 255, g: 255, b: 255 });

    const rgbToHex = ({ r, g, b }) =>
        "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");

    useEffect(() => {
        onChange([
            rgbToHex(rgb1),
            rgbToHex(rgb2)
        ]);
    }, [rgb1, rgb2]);

    return (
        <div className="color-panel">
            <div className="color-control-unit">
                <label>Color 1</label>
                <div className="horizontal-flex">
                    <label>R</label>
                    <input type="range" min="0" max="255" defaultValue="0" className="accent-red"
                        onChange={(e) => setRgb1(prev => ({ ...prev, r: parseInt(e.target.value, 10) }))} />
                </div>
                <div className="horizontal-flex">
                    <label>G</label>
                    <input type="range" min="0" max="255" defaultValue="0" className="accent-green"
                        onChange={(e) => setRgb1(prev => ({ ...prev, g: parseInt(e.target.value, 10) }))} />
                </div>
                <div className="horizontal-flex">
                    <label>B</label>
                    <input type="range" min="0" max="255" defaultValue="0" className="accent-blue"
                        onChange={(e) => setRgb1(prev => ({ ...prev, b: parseInt(e.target.value, 10) }))} />
                </div>
            </div>
            <div className="color-control-unit">
                <label>Color 2</label>
                <div className="horizontal-flex">
                    <label>R</label>
                    <input type="range" min="0" max="255" defaultValue="255" className="accent-red"
                        onChange={(e) => setRgb2(prev => ({ ...prev, r: parseInt(e.target.value, 10) }))} />
                </div>
                <div className="horizontal-flex">
                    <label>G</label>
                    <input type="range" min="0" max="255" defaultValue="255" className="accent-green"
                        onChange={(e) => setRgb2(prev => ({ ...prev, g: parseInt(e.target.value, 10) }))} />
                </div>
                <div className="horizontal-flex">
                    <label>B</label>
                    <input type="range" min="0" max="255" defaultValue="255" className="accent-blue"
                        onChange={(e) => setRgb2(prev => ({ ...prev, b: parseInt(e.target.value, 10) }))} />
                </div>
            </div>
        </div>
    );
}
