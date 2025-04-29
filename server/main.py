# File: server/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

# 이미 구현해둔 함수 import
from power import generate_power_tower_image

app = FastAPI()

# CORS 설정: 모든 도메인에서 접근 허용 (개발용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/powertower", response_model=List[Dict[str, float]])
def get_powertower(
    xmin: float = Query(..., description="x 최소값"),
    xmax: float = Query(..., description="x 최대값"),
    ymin: float = Query(..., description="y 최소값"),
    ymax: float = Query(..., description="y 최대값")
):
    """
    복소평면의 Power Tower 수렴/발산 값을 0~1로 계산해서 반환
    generate_power_tower_image 함수에 xmin, xmax, ymin, ymax를 그대로 전달
    반환값: List of { 'x': float, 'y': float, 'value': float }
    """
    result = generate_power_tower_image(xmin, xmax, ymin, ymax)
    return result

# 실행방법:
# uvicorn server.main:app --reload --host 0.0.0.0 --port 5000
