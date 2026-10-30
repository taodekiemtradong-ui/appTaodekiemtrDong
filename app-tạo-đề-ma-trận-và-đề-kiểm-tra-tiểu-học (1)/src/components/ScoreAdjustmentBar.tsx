import React from 'react';
import { FullExamData } from '../types/exam';
import { AlertCircle, CheckCircle2, Sliders, RefreshCw, Sparkles, Scale, Info } from 'lucide-react';

interface ScoreAdjustmentBarProps {
  exam: FullExamData;
  onAutoBalance: () => void;
  onQuickAdjustAll: (factor: number) => void;
}

export const ScoreAdjustmentBar: React.FC<ScoreAdjustmentBarProps> = ({
  exam,
  onAutoBalance,
  onQuickAdjustAll,
}) => {
  const currentTotal = exam.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  const roundedTotal = Math.round(currentTotal * 100) / 100;
  const isPerfect = Math.abs(roundedTotal - 10.0) < 0.05;

  // Calculate Breakdown by Level
  const m1Points = exam.questions.filter(q => q.level === 'Mức 1').reduce((s, q) => s + (Number(q.points) || 0), 0);
  const m2Points = exam.questions.filter(q => q.level === 'Mức 2').reduce((s, q) => s + (Number(q.points) || 0), 0);
  const m3Points = exam.questions.filter(q => q.level === 'Mức 3').reduce((s, q) => s + (Number(q.points) || 0), 0);

  const m1Percent = roundedTotal > 0 ? Math.round((m1Points / roundedTotal) * 100) : 0;
  const m2Percent = roundedTotal > 0 ? Math.round((m2Points / roundedTotal) * 100) : 0;
  const m3Percent = roundedTotal > 0 ? Math.round((m3Points / roundedTotal) * 100) : 0;

  // Breakdown by Format
  const tnPoints = exam.questions.filter(q => q.part === 'TN').reduce((s, q) => s + (Number(q.points) || 0), 0);
  const tlPoints = exam.questions.filter(q => q.part === 'TL').reduce((s, q) => s + (Number(q.points) || 0), 0);

  const tnPercent = roundedTotal > 0 ? Math.round((tnPoints / roundedTotal) * 100) : 0;
  const tlPercent = roundedTotal > 0 ? Math.round((tlPoints / roundedTotal) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 print:hidden transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Total Score & Status */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold shadow-sm ${
              isPerfect
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
            }`}
          >
            {roundedTotal.toFixed(1)}
            <span className="text-xs font-normal ml-0.5">/10</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              {isPerfect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Thang điểm chuẩn 10,0 điểm</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800">
                    {roundedTotal < 10
                      ? `Thiếu ${(10 - roundedTotal).toFixed(2)} điểm để tròn 10.0đ`
                      : `Thừa ${(roundedTotal - 10).toFixed(2)} điểm so với thang 10.0đ`}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tính năng <span className="font-semibold text-emerald-700">"Có chỗ sửa điểm"</span>: Bấm trực tiếp vào ô điểm ở bất kỳ câu nào để điều chỉnh linh hoạt.
            </p>
          </div>
        </div>

        {/* Cognitive & Format Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {/* Mức 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-500 text-[11px]">Mức 1 (Biết ~50%)</div>
            <div className="font-bold text-slate-800">
              {m1Points.toFixed(1)}đ <span className="text-slate-500 font-normal">({m1Percent}%)</span>
            </div>
          </div>

          {/* Mức 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-500 text-[11px]">Mức 2 (Hiểu ~30%)</div>
            <div className="font-bold text-slate-800">
              {m2Points.toFixed(1)}đ <span className="text-slate-500 font-normal">({m2Percent}%)</span>
            </div>
          </div>

          {/* Mức 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <div className="text-slate-500 text-[11px]">Mức 3 (Vận dụng ~20%)</div>
            <div className="font-bold text-slate-800">
              {m3Points.toFixed(1)}đ <span className="text-slate-500 font-normal">({m3Percent}%)</span>
            </div>
          </div>

          {/* TN */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
            <div className="text-blue-700 text-[11px]">Trắc nghiệm (60%)</div>
            <div className="font-bold text-blue-900">
              {tnPoints.toFixed(1)}đ <span className="text-blue-600 font-normal">({tnPercent}%)</span>
            </div>
          </div>

          {/* TL */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
            <div className="text-purple-700 text-[11px]">Tự luận (40%)</div>
            <div className="font-bold text-purple-900">
              {tlPoints.toFixed(1)}đ <span className="text-purple-600 font-normal">({tlPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Quick balance action */}
        <div className="flex items-center gap-2">
          {!isPerfect && (
            <button
              type="button"
              onClick={onAutoBalance}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              title="Tự động cân đối điểm các câu để tổng vừa tròn 10.0 điểm chuẩn"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Cân đối về tròn 10đ</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-lg p-1">
            <span className="px-1 text-slate-400">Tăng/giảm nhanh:</span>
            <button
              type="button"
              onClick={() => onQuickAdjustAll(0.25)}
              className="px-1.5 py-0.5 bg-white hover:bg-slate-200 rounded border border-slate-200 font-medium"
              title="Tăng điểm tất cả các câu thêm 0.25"
            >
              +0.25
            </button>
            <button
              type="button"
              onClick={() => onQuickAdjustAll(-0.25)}
              className="px-1.5 py-0.5 bg-white hover:bg-slate-200 rounded border border-slate-200 font-medium"
              title="Giảm điểm tất cả các câu bớt 0.25"
            >
              -0.25
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
