import React, { useState } from 'react';
import CanvasPanel from './components/CanvasPanel';
import ControlPanel from './components/ControlPanel';
import './App.css';

//TODO: Make it beautiful

/**
 * App 컴포넌트
 * - 전체 앱의 상태를 관리
 * - 사용자가 지정한 영역(viewRect)과 서버에서 받아온 데이터를 저장
 * - 하위 컴포넌트에 props로 전달
 */
export default function App() {
  const [viewRect, setViewRect] = useState({ xMin: -2, xMax: 2, yMin: -2, yMax: 2 });
  const [data, setData] = useState(null);

  // API 서버의 절대 주소 (환경변수 REACT_APP_API_URL 사용 가능)
  const API_BASE = 'http://localhost:5000';

  /**
   * 서버에서 그래프 데이터를 가져오는 함수
   * 서버는 각 점마다 0~1 사이의 convergence 수치(value)를 반환
   */
  const fetchGraph = async (rect) => {
    const { xMin, xMax, yMin, yMax } = rect;
    const res = await fetch(
      `${API_BASE}/api/powertower?xmin=${xMin}&xmax=${xMax}&ymin=${yMin}&ymax=${yMax}`
    );
    const json = await res.json();
    setData(json);
  };

  React.useEffect(() => {
    fetchGraph(viewRect);
  }, []);

  return (
    <div className="app-container">
      <CanvasPanel
        data={data}
        viewRect={viewRect}
        onZoomRect={(newRect) => {
          setViewRect(newRect);
        }}
        // 원하는 색상을 hex로 전달
        convergedColor="#000000"
        divergedColor="#ffffff"
      />
      <ControlPanel
        rect={viewRect}
        onChange={(newRect) => setViewRect(newRect)}
        onDraw={() => fetchGraph(viewRect)}
      />
    </div>
  );
}