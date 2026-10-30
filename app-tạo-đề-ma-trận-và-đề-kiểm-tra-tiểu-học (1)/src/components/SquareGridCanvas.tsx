import React, { useState } from 'react';
import { GeometryGridConfig } from '../types/exam';
import { Grid, Eye, Square, Triangle, RotateCcw, PenTool } from 'lucide-react';

interface SquareGridCanvasProps {
  config?: GeometryGridConfig;
  editable?: boolean;
  questionNumber?: number;
  onConfigChange?: (newConfig: GeometryGridConfig) => void;
}

export const SquareGridCanvas: React.FC<SquareGridCanvasProps> = ({
  config = { type: 'grid_shape', gridSize: { rows: 6, cols: 8, cellSize: 28 }, caption: 'Lưới ô vuông tiểu học' },
  editable = false,
  questionNumber,
  onConfigChange,
}) => {
  const rows = config.gridSize?.rows || 6;
  const cols = config.gridSize?.cols || 8;
  const cellSize = config.gridSize?.cellSize || 28;

  // Track highlighted cells in interactive mode
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [activeShape, setActiveShape] = useState<string>(config.shapeType || 'rectangle');

  const toggleCell = (r: number, c: number) => {
    if (!editable) return;
    const key = `${r}-${c}`;
    const next = new Set(selectedCells);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedCells(next);
  };

  const clearGrid = () => {
    setSelectedCells(new Set());
  };

  const applyPreset = (preset: 'rect' | 'triangle' | 'trapezoid' | 'square') => {
    const next = new Set<string>();
    if (preset === 'rect') {
      // 5 cols x 3 rows rectangle starting at (1, 1)
      for (let r = 1; r <= 3; r++) {
        for (let c = 1; c <= 5; c++) {
          next.add(`${r}-${c}`);
        }
      }
      setActiveShape('rectangle');
    } else if (preset === 'square') {
      for (let r = 1; r <= 4; r++) {
        for (let c = 2; c <= 5; c++) {
          next.add(`${r}-${c}`);
        }
      }
      setActiveShape('square');
    } else if (preset === 'triangle') {
      // Right triangle
      for (let r = 1; r <= 4; r++) {
        for (let c = 1; c <= r + 1; c++) {
          next.add(`${r}-${c}`);
        }
      }
      setActiveShape('triangle');
    } else if (preset === 'trapezoid') {
      // Trapezoid
      for (let c = 2; c <= 5; c++) next.add(`1-${c}`);
      for (let c = 1; c <= 6; c++) next.add(`2-${c}`);
      for (let c = 1; c <= 6; c++) next.add(`3-${c}`);
      setActiveShape('trapezoid');
    }
    setSelectedCells(next);
    if (onConfigChange) {
      onConfigChange({
        ...config,
        shapeType: preset as any,
      });
    }
  };

  const width = cols * cellSize;
  const height = rows * cellSize;

  return (
    <div className="my-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm print:border-slate-400 print:shadow-none max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-100 text-xs text-slate-600 print:hidden">
        <div className="flex items-center gap-1.5 font-medium text-emerald-800">
          <Grid className="w-4 h-4 text-emerald-600" />
          <span>{config.caption || 'Lưới ô vuông vẽ hình (1 ô = 1 cm x 1 cm)'}</span>
        </div>

        {editable && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 mr-1">Hình mẫu:</span>
            <button
              type="button"
              onClick={() => applyPreset('rect')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeShape === 'rectangle' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Hình chữ nhật 5x3
            </button>
            <button
              type="button"
              onClick={() => applyPreset('square')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeShape === 'square' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Hình vuông 4x4
            </button>
            <button
              type="button"
              onClick={() => applyPreset('trapezoid')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeShape === 'trapezoid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Hình thang
            </button>
            <button
              type="button"
              onClick={clearGrid}
              className="p-1 hover:bg-rose-50 text-rose-600 rounded ml-1"
              title="Xóa trắng để học sinh tự vẽ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* SVG Grid */}
      <div className="overflow-x-auto flex justify-center py-1">
        <svg
          width={width}
          height={height}
          className="border border-slate-400 bg-white select-none shadow-inner"
        >
          <defs>
            {/* Pattern for primary school small 5mm / 1cm grid lines */}
            <pattern id="smallGrid" width={cellSize / 2} height={cellSize / 2} patternUnits="userSpaceOnUse">
              <path d={`M ${cellSize / 2} 0 L 0 0 0 ${cellSize / 2}`} fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <rect width={cellSize} height={cellSize} fill="url(#smallGrid)" />
              <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="#94a3b8" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Base Grid */}
          <rect width={width} height={height} fill="url(#grid)" />

          {/* Selected or filled cells */}
          {Array.from(selectedCells).map(key => {
            const [r, c] = key.split('-').map(Number);
            return (
              <rect
                key={key}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#34d399"
                fillOpacity="0.45"
                stroke="#059669"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Interactive click targets */}
          {editable &&
            Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => (
                <rect
                  key={`click-${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="transparent"
                  className="cursor-pointer hover:fill-blue-200 hover:fill-opacity-30"
                  onClick={() => toggleCell(r, c)}
                />
              ))
            )}

          {/* Dimension Labels for Standard Rect 5x3 if selected */}
          {selectedCells.size > 0 && activeShape === 'rectangle' && (
            <g>
              {/* Length label */}
              <text
                x={1 * cellSize + (5 * cellSize) / 2}
                y={1 * cellSize - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#047857"
              >
                5 cm (5 ô)
              </text>
              {/* Width label */}
              <text
                x={1 * cellSize - 8}
                y={1 * cellSize + (3 * cellSize) / 2}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#047857"
                transform={`rotate(-90 ${1 * cellSize - 8} ${1 * cellSize + (3 * cellSize) / 2})`}
              >
                3 cm (3 ô)
              </text>
              {/* Vertex letters */}
              <text x={1 * cellSize - 8} y={1 * cellSize - 4} fontSize="12" fontWeight="bold" fill="#1e293b">A</text>
              <text x={6 * cellSize + 4} y={1 * cellSize - 4} fontSize="12" fontWeight="bold" fill="#1e293b">B</text>
              <text x={6 * cellSize + 4} y={4 * cellSize + 12} fontSize="12" fontWeight="bold" fill="#1e293b">C</text>
              <text x={1 * cellSize - 8} y={4 * cellSize + 12} fontSize="12" fontWeight="bold" fill="#1e293b">D</text>
            </g>
          )}

          {/* Dimension Labels for Trapezoid if active */}
          {selectedCells.size > 0 && activeShape === 'trapezoid' && (
            <g>
              <text x={width / 2} y={cellSize - 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#047857">
                Đáy bé: 4 cm
              </text>
              <text x={width / 2} y={4 * cellSize + 14} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#047857">
                Đáy lớn: 6 cm
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
        <span>* Mỗi ô vuông cạnh 1 cm. Diện tích 1 ô = 1 cm²</span>
        {editable && (
          <span className="text-emerald-700 italic">
            Mẹo: Nhấp chuột vào từng ô để tô màu / bỏ chọn hình học
          </span>
        )}
      </div>
    </div>
  );
};
