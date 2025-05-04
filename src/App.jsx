import React, { useState } from 'react';
import CanvasPanel from './components/CanvasPanel';
import ControlPanel from './components/ControlPanel';
import ColorPanel from './components/ColorPanel';
import './App.css';
import DOMapproach from './components/DOMapproach';
import generatePowerTowerData from './components/Calculation'

/**
 * App 컴포넌트
 * - 전체 앱의 상태를 관리
 * - 사용자가 지정한 영역(viewRect)과 서버에서 받아온 데이터를 저장
 * - 하위 컴포넌트에 props로 전달
 */
export default function App() {
  const [viewRect, setViewRect] = useState({ xMin: -2, xMax: 2, yMin: -2, yMax: 2 });
  const [data, setData] = useState(null);
  const [color, setColor] = useState(["#000000","#ffffff"]) // Default Colors

  const [lastSpan, setLastSpan] = useState([4,4])

  const resolution = [600,600] // Resolution

  /**
   * 서버에서 그래프 데이터를 가져오는 함수
   * 서버는 각 점마다 0~1 사이의 convergence 수치(value)를 반환
   */
  const fetchGraph = (rect) => {
    console.log('Fetching...') //----------------------
    const { xMin, xMax, yMin, yMax } = rect;
    const res = generatePowerTowerData(
      xMin, xMax,
      yMin, yMax,
      1e6, // Escape Radius
      50, // Max Iteration
      resolution
    )
    setData(res);
    console.log('Done!') //----------------------
  };

  React.useEffect(() => {
    fetchGraph(viewRect);
    DOMapproach();
  }, []);

  return (
    <div className="app-container">
      <CanvasPanel
        data={data}
        viewRect={viewRect}
        onZoomRect={(newRect) => setViewRect(newRect)}
        convergedColor={color[0]}
        divergedColor={color[1]}
        lastSpan={lastSpan}
        resolution={resolution}
      />
      <div className="control-wrapper">
        <ControlPanel
          rect={viewRect}
          onChange={(newRect) => setViewRect(newRect)}
          onDraw={() => {
            fetchGraph(viewRect);
            setLastSpan([
              viewRect.xMax-viewRect.xMin,
              viewRect.yMax-viewRect.yMin
            ])
          }}
          setLastSpan={setLastSpan}
        />
        <ColorPanel
          onChange={(newColor) => setColor(newColor)}
        />
      </div>
    </div>
  );
}