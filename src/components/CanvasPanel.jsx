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
export default function CanvasPanel({ data, viewRect, onZoomRect, convergedColor, divergedColor, lastSpan}) {
    const canvasRef = useRef(null);
    // 초기 x, y span 저장
    //const initialSpanX = useRef(viewRect.xMax - viewRect.xMin);
    //const initialSpanY = useRef(viewRect.yMax - viewRect.yMin);
    const lastSpanX = lastSpan[0];
    const lastSpanY = lastSpan[1];
    const [rubberRect, setRubberRect] = useState(null);
  
    useEffect(() => {       

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if (!data || data.length===0) return;
    
        // grid 해상도 유추: 전체 개수와 가로/세로 비율로 구분
        // data.length = cols * rows
        const spanX = viewRect.xMax - viewRect.xMin;
        const spanY = viewRect.yMax - viewRect.yMin;
        // 가로:세로 span 비율
        //const ratio = (spanX/spanY) * (canvas.height/canvas.width);
        //const total = data.length;
        //const cols = Math.round(Math.sqrt(total * (canvas.width/canvas.height) * (spanY/spanX)));
        //const rows = Math.round(total / cols);
        
        //(lastSpanX*lastSpanY)/total

        // 기본 dot 크기
        //const baseSizeX = canvas.width / cols;
        //const baseSizeY = canvas.height / rows;
    
        // zoom scale per axis
        //const scaleX = lastSpanX / spanX;
        //const scaleY = lastSpanY / spanY;
    
        //const dotWidth = baseSizeX * scaleX;
        //const dotHeight = baseSizeY * scaleY;

        const dotWidth =  lastSpanX / spanX + (lastSpanX!=spanX?1:0);
        const dotHeight = lastSpanY / spanY + (lastSpanY!=spanY?1:0);

        //어차피 canvas 600x600 서버에서 600x600 보내니까 일치함
    
        data.forEach(({ x, y, value }) => {
            const t = value;
            // 좌표 -> pixel
            const cx = ((x - viewRect.xMin)/spanX)*canvas.width;
            const cy = ((y - viewRect.yMin)/spanY)*canvas.height;
            ctx.fillStyle = blendHex(convergedColor,divergedColor,t);
            // 직사각형 dot 렌더링
            ctx.fillRect(cx - dotWidth/2, cy - dotHeight/2, dotWidth, dotHeight);
        });
    }, [data, viewRect, convergedColor, divergedColor]);
  
    // pixel -> viewRect 좌표 변환
    const toRect = (s,e) => {
        const c = canvasRef.current, w = c.width, h = c.height;
        const x0 = (s.x/w)*(viewRect.xMax-viewRect.xMin)+viewRect.xMin;
        const y0 = (s.y/h)*(viewRect.yMax-viewRect.yMin)+viewRect.yMin;
        const x1 = (e.x/w)*(viewRect.xMax-viewRect.xMin)+viewRect.xMin;
        const y1 = (e.y/h)*(viewRect.yMax-viewRect.yMin)+viewRect.yMin;
        return {
            xMin:Math.min(x0,x1),
            xMax:Math.max(x0,x1),
            yMin:Math.min(y0,y1),
            yMax:Math.max(y0,y1)
        };
    };
  
    // drag events
    const onMouseDown = e => {
            const r = canvasRef.current.getBoundingClientRect();
            // 드래그 초기화: start와 end를 동일 좌표로 설정하여 undefined 방지
            const point = { x: e.clientX - r.left, y: e.clientY - r.top };
            setRubberRect({ start: point, end: point });
        };
    const onMouseMove = e => {
        if(!rubberRect) return;
        const r = canvasRef.current.getBoundingClientRect();
        setRubberRect(rRect => ({
            ...rRect,
            end:{ x:e.clientX-r.left, y:e.clientY-r.top }
        }));
    };
    const onMouseUp = () => {
        if(rubberRect && rubberRect.end) onZoomRect(toRect(rubberRect.start, rubberRect.end));
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
                height: Math.abs(rubberRect.end.y - rubberRect.start.y),
                borderColor: divergedColor,
                outlineColor: convergedColor
            }}
            />
        )}
    </div>
  );
}
