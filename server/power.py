import numpy as np
import matplotlib.pyplot as plt
from numba import jit
from typing import List, Dict

#TODO: Use Cupy to optimize generating these bunch of numbers

@jit
def custom_meshgrid(x, y):
    x_len = x.shape[0]
    y_len = y.shape[0]
    xx = np.empty((y_len, x_len), dtype=x.dtype)
    yy = np.empty((y_len, x_len), dtype=y.dtype)
    
    for i in range(y_len):
        for j in range(x_len):
            xx[i, j] = x[j]
            yy[i, j] = y[i]
    
    return xx, yy

def generate_power_tower_image(
    xmin: float,
    xmax: float,
    ymin: float,
    ymax: float,
    width: int = 600,
    height: int = 600,
    max_iter: int = 50,
    escape_radius: float = 1e6
) -> List[Dict[str, float]]:
    """
    Power Tower의 수렴/발산 정도를 0~1 범위의 brightness로 계산하여
    x, y 좌표와 함께 리스트 형태로 반환

    반환 형식:
      [
        { 'x': float, 'y': float, 'value': float },
        ...
      ]

    - x, y: 복소평면 상의 좌표
    - value: 0(완전 수렴) ~ 1(완전 발산)
    """
    # 1. 복소수 평면 그리드 생성
    x = np.linspace(xmin, xmax, width)
    y = np.linspace(ymin, ymax, height)
    X, Y = custom_meshgrid(x, y)
    Z = X + 1j * Y

    # 2. Power Tower 반복 계산
    W = Z.copy()
    mask = np.ones_like(Z, dtype=bool)
    iter_count = np.zeros(Z.shape, dtype=int)

    for i in range(max_iter):
        W[mask] = np.power(Z[mask], W[mask])
        diverged = np.abs(W) > escape_radius
        new_diverged = diverged & mask
        iter_count[new_diverged] = i
        mask &= ~diverged

    # 3. 밝기 값으로 변환 및 클리핑
    brightness = iter_count.astype(np.float32) / max_iter
    brightness = np.clip(brightness, 0.0, 1.0)

    # 4. 반환용 리스트 생성
    #   메모리 고려 시 너무 큰 배열은 주의 (width*height 개)
    result: List[Dict[str, float]] = []
    # flatten
    xs = X.flatten()
    ys = Y.flatten()
    vs = brightness.flatten()
    for xi, yi, vi in zip(xs, ys, vs):
        result.append({'x': float(xi), 'y': float(yi), 'value': float(vi)})

    return result