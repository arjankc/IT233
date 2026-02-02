import React, { useState, useMemo, useRef } from 'react';
import { INITIAL_KPIs } from '../constants';

// Calculate initial score based on constants to reconstruct history
const INITIAL_SCORE = Math.floor(INITIAL_KPIs.revenue + INITIAL_KPIs.innovation - (INITIAL_KPIs.risk * 1.5));

interface SparklineProps {
    history: { change: number }[];
    width?: number;
    height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ history, width = 120, height = 40 }) => {
    const [hoveredData, setHoveredData] = useState<{ x: number; y: number; value: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const { pathD, areaD, dataPoints, strokeColor } = useMemo(() => {
        let current = INITIAL_SCORE;
        const data = [current];
        history.forEach(h => {
            current += h.change;
            data.push(current);
        });

        // Ensure we have at least 2 points for a line
        if (data.length === 1) data.push(data[0]);

        const min = Math.min(...data);
        const max = Math.max(...data);
        
        let range = max - min;
        const isFlat = range === 0;
        if (isFlat) range = 1; // Prevent divide by zero

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const normalizedY = isFlat ? 0.5 : (val - min) / range;
            // Padding of 4px on top and bottom
            const y = height - (normalizedY * (height - 8) + 4);
            return { x, y, value: val };
        });

        const d = points.map(p => `${p.x},${p.y}`).join(' ');

        // Determine trend color based on last movement
        const lastChange = history.length > 0 ? history[history.length - 1].change : 0;
        const color = lastChange >= 0 ? '#34d399' : '#f87171'; // emerald-400 : red-400

        return {
            pathD: `M ${d}`,
            areaD: `M ${d} L ${width},${height} L 0,${height} Z`,
            dataPoints: points,
            strokeColor: color
        };
    }, [history, width, height]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        
        // Map mouse position to SVG coordinate space
        const scaleX = width / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;

        // Find closest data point by X coordinate
        let closest = dataPoints[0];
        let minDiff = Math.abs(mouseX - closest.x);

        for (let i = 1; i < dataPoints.length; i++) {
            const diff = Math.abs(mouseX - dataPoints[i].x);
            if (diff < minDiff) {
                minDiff = diff;
                closest = dataPoints[i];
            }
        }
        
        setHoveredData(closest);
    };

    const handleMouseLeave = () => {
        setHoveredData(null);
    };

    return (
        <div className="relative w-full h-full group">
            <svg 
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full overflow-visible cursor-crosshair" 
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Chart Grid Lines */}
                <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                />
                <path
                    d={areaD}
                    fill={strokeColor}
                    className="opacity-10 transition-all duration-500"
                />
                
                {/* Hover Indicators in SVG space */}
                {hoveredData && (
                    <g>
                        <line 
                            x1={hoveredData.x} y1={0} 
                            x2={hoveredData.x} y2={height} 
                            stroke="rgba(255,255,255,0.3)" 
                            strokeDasharray="2 2" 
                        />
                        <circle 
                            cx={hoveredData.x} cy={hoveredData.y} 
                            r={4} 
                            fill={strokeColor} 
                            stroke="white" 
                            strokeWidth={2}
                        />
                    </g>
                )}
            </svg>

            {/* Tooltip Overlay (HTML) */}
            {hoveredData && (
                <div 
                    className="absolute bg-slate-900/95 backdrop-blur border border-slate-600 rounded px-2 py-1 text-xs text-white font-mono shadow-xl pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full whitespace-nowrap"
                    style={{ 
                        left: `${(hoveredData.x / width) * 100}%`, 
                        top: `${(hoveredData.y / height) * 100}%`,
                        marginTop: '-10px'
                    }}
                >
                     <span className={strokeColor === '#34d399' ? 'text-emerald-400' : 'text-red-400'}>
                         ${hoveredData.value}M
                    </span>
                </div>
            )}
        </div>
    );
};

export default Sparkline;