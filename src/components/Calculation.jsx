function complexPow(a, b, c, d) {
    // (a + bi)^(c + di)
    const r = Math.sqrt(a * a + b * b);
    const theta = Math.atan2(b, a);
    const logR = Math.log(r);
    const newR = Math.exp(c * logR - d * theta);
    const newTheta = c * theta + d * logR;
    return [newR * Math.cos(newTheta), newR * Math.sin(newTheta)];
}
  
function powerTowerEscape(x, y, max_iter, escape_radius) {
    let zr = x, zi = y; // base 복소수
    let r = x, i = y;   // 초기값 z₀ = base
  
    for (let iter = 1; iter <= max_iter; iter++) {
        [r, i] = complexPow(zr, zi, r, i);
  
        const magSq = r * r + i * i;
        if (isNaN(magSq) || !isFinite(magSq)) return 0.0;
        if (magSq > escape_radius * escape_radius) return (iter) / max_iter;
    }
  
    return 0.0; // max_iter까지 수렴
}
  
export default function generatePowerTowerData(xmin, xmax, ymin, ymax, escape_radius, max_iter, resolution) {
    const width = resolution[0];
    const height = resolution[1];
    const data = [];
  
    for (let j = 0; j < height; j++) {
        const y = ymin + (ymax - ymin) * (j / (height - 1));
        for (let i = 0; i < width; i++) {
            const x = xmin + (xmax - xmin) * (i / (width - 1));
            const value = powerTowerEscape(x, y, max_iter, escape_radius);
            data.push({ x, y, value });
        }
    }
  
    return data;
}
  