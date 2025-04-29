import React, { useRef, useEffect, useState } from 'react';

/**
 * hex 색상 문자열을 {r,g,b} 객체로 변환
 */
function hexToRgb(hex) {
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * 두 색상(r,g,b 객체)과 t(0~1)로 블렌딩한 hex 문자열 반환
 */
function blendHex(colorA, colorB, t) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bV = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bV})`;
}

/**
 * CanvasPanel 컴포넌트
 * - data: [{ x, y, value(0~1) }, ...]
 * - viewRect: { xMin, xMax, yMin, yMax }
 * - convergedColor/divergedColor: hex 색상 문자열
 */
export default function CanvasPanel({ data, viewRect, onZoomRect, convergedColor, divergedColor }) {
  const canvasRef = useRef(null);
  const [dragStart, setDragStart] = useState(null);
  const [rubberRect, setRubberRect] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!data) return;

    data.forEach(({ x, y, value }) => {
      // value: 0(완전 수렴) ~ 1(완전 발산)
      // t: 발산 쪽이 높을수록 1에 가까움
      const t = value;
      const cx = ((x - viewRect.xMin) / (viewRect.xMax - viewRect.xMin)) * canvas.width;
      const cy = ((y - viewRect.yMin) / (viewRect.yMax - viewRect.yMin)) * canvas.height;
      // 블렌딩 색상 계산
      ctx.fillStyle = blendHex(convergedColor, divergedColor, t);
      ctx.fillRect(cx, cy, 1, 1);
    });
  }, [data, viewRect, convergedColor, divergedColor]);

  const toRectCoords = (start, end) => {
    const rect = {};
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const x0 = (start.x / width) * (viewRect.xMax - viewRect.xMin) + viewRect.xMin;
    const y0 = (start.y / height) * (viewRect.yMax - viewRect.yMin) + viewRect.yMin;
    const x1 = (end.x / width) * (viewRect.xMax - viewRect.xMin) + viewRect.xMin;
    const y1 = (end.y / height) * (viewRect.yMax - viewRect.yMin) + viewRect.yMin;
    rect.xMin = Math.min(x0, x1);
    rect.xMax = Math.max(x0, x1);
    rect.yMin = Math.min(y0, y1);
    rect.yMax = Math.max(y0, y1);
    return rect;
  };

  const onMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const onMouseMove = (e) => {
    if (!dragStart) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRubberRect({ start: dragStart, end: current });
  };
  const onMouseUp = () => {
    if (rubberRect) {
      const newView = toRectCoords(rubberRect.start, rubberRect.end);
      onZoomRect(newView);
    }
    setDragStart(null);
    setRubberRect(null);
  };

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
      {rubberRect && (
        <div
          className="rubber-rect"
          style={{
            left: Math.min(rubberRect.start.x, rubberRect.end.x),
            top: Math.min(rubberRect.start.y, rubberRect.end.y),
            width: Math.abs(rubberRect.end.x - rubberRect.start.x),
            height: Math.abs(rubberRect.end.y - rubberRect.start.y)
          }}
        />
      )}
    </div>
  );
}
