import React from 'react';
import { FullExamData, MatrixStrand } from '../types/exam';
import { Table, Plus, Trash2, Edit3, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface MatrixViewProps {
  exam: FullExamData;
  onUpdateExam: (updated: FullExamData) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({ exam, onUpdateExam }) => {
  const { header, matrix } = exam;

  // Handle cell edit for a strand
  const handleStrandChange = (index: number, field: keyof MatrixStrand, value: number | string) => {
    const updatedStrands = [...matrix.strands];
    const current = { ...updatedStrands[index], [field]: value };

    // Recompute total points for this strand
    const totalPoints =
      (Number(current.m1_tn_points) || 0) +
      (Number(current.m1_tl_points) || 0) +
      (Number(current.m2_tn_points) || 0) +
      (Number(current.m2_tl_points) || 0) +
      (Number(current.m3_tn_points) || 0) +
      (Number(current.m3_tl_points) || 0);

    current.total_points = Math.round(totalPoints * 100) / 100;

    updatedStrands[index] = current;

    // Recompute whole matrix summary
    let sumTotal = 0;
    let sumM1 = 0;
    let sumM2 = 0;
    let sumM3 = 0;
    let sumTN = 0;
    let sumTL = 0;

    updatedStrands.forEach(s => {
      sumTotal += s.total_points;
      sumM1 += (Number(s.m1_tn_points) || 0) + (Number(s.m1_tl_points) || 0);
      sumM2 += (Number(s.m2_tn_points) || 0) + (Number(s.m2_tl_points) || 0);
      sumM3 += (Number(s.m3_tn_points) || 0) + (Number(s.m3_tl_points) || 0);
      sumTN += (Number(s.m1_tn_points) || 0) + (Number(s.m2_tn_points) || 0) + (Number(s.m3_tn_points) || 0);
      sumTL += (Number(s.m1_tl_points) || 0) + (Number(s.m2_tl_points) || 0) + (Number(s.m3_tl_points) || 0);
    });

    sumTotal = Math.round(sumTotal * 100) / 100;
    const baseTotal = sumTotal > 0 ? sumTotal : 10;

    // Update percentages for each strand
    updatedStrands.forEach(s => {
      s.percentage = Math.round((s.total_points / baseTotal) * 100);
    });

    const newSummary = {
      m1_points: Math.round(sumM1 * 100) / 100,
      m1_percent: Math.round((sumM1 / baseTotal) * 100),
      m2_points: Math.round(sumM2 * 100) / 100,
      m2_percent: Math.round((sumM2 / baseTotal) * 100),
      m3_points: Math.round(sumM3 * 100) / 100,
      m3_percent: Math.round((sumM3 / baseTotal) * 100),
      tn_points: Math.round(sumTN * 100) / 100,
      tn_percent: Math.round((sumTN / baseTotal) * 100),
      tl_points: Math.round(sumTL * 100) / 100,
      tl_percent: Math.round((sumTL / baseTotal) * 100),
      total_points: sumTotal,
    };

    onUpdateExam({
      ...exam,
      matrix: {
        strands: updatedStrands,
        summary: newSummary,
      },
    });
  };

  const addStrand = () => {
    const newStrand: MatrixStrand = {
      id: `strand-${Date.now()}`,
      name: 'Mạch kiến thức bổ sung',
      targetPercentage: 10,
      m1_tn_count: 1,
      m1_tn_points: 0.5,
      m1_tl_count: 0,
      m1_tl_points: 0,
      m2_tn_count: 1,
      m2_tn_points: 0.5,
      m2_tl_count: 0,
      m2_tl_points: 0,
      m3_tn_count: 0,
      m3_tn_points: 0,
      m3_tl_count: 0,
      m3_tl_points: 0,
      total_points: 1.0,
      percentage: 10,
    };

    const updated = [...matrix.strands, newStrand];
    onUpdateExam({
      ...exam,
      matrix: {
        ...matrix,
        strands: updated,
      },
    });
  };

  const removeStrand = (index: number) => {
    if (matrix.strands.length <= 1) return;
    const updated = matrix.strands.filter((_, i) => i !== index);
    onUpdateExam({
      ...exam,
      matrix: {
        ...matrix,
        strands: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {header.governingBody} • {header.schoolName}
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-1">
              MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ THEO 3 MỨC ĐỘ
            </h2>
            <p className="text-sm text-slate-500">
              Môn: <strong className="text-slate-700">{header.subject}</strong> - Lớp <strong className="text-slate-700">{header.grade}</strong> ({header.term} • Năm học {header.schoolYear})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addStrand}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition cursor-pointer print:hidden"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mạch nội dung</span>
            </button>
          </div>
        </div>

        {/* Matrix Standards Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Tỉ lệ 3 mức độ chuẩn GDPT 2018:</span>
              <p className="text-slate-600 mt-0.5">
                Mức 1 (50%) — Mức 2 (30%) — Mức 3 (20%). Hiện tại:{' '}
                <strong className="text-emerald-700">
                  {matrix.summary.m1_percent}% - {matrix.summary.m2_percent}% - {matrix.summary.m3_percent}%
                </strong>
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Tỉ lệ hình thức kiểm tra:</span>
              <p className="text-slate-600 mt-0.5">
                Trắc nghiệm 60% (6.0đ) — Tự luận 40% (4.0đ). Hiện tại:{' '}
                <strong className="text-blue-700">
                  {matrix.summary.tn_points.toFixed(1)}đ ({matrix.summary.tn_percent}%) - {matrix.summary.tl_points.toFixed(1)}đ ({matrix.summary.tl_percent}%)
                </strong>
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Quy định sửa điểm trực tiếp:</span>
              <p className="text-slate-600 mt-0.5">
                Giáo viên có thể sửa trực tiếp số câu và số điểm ở từng ô. Ma trận sẽ tự động tính lại tổng điểm và phần trăm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Dimensional Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold text-center border-b border-slate-700">
                <th rowSpan={2} className="p-3 w-1/4 border-r border-slate-700">
                  Mạch kiến thức / Kĩ năng
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-700 bg-emerald-900/60">
                  Mức 1 (Nhận biết ~50%)
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-700 bg-sky-900/60">
                  Mức 2 (Kết nối/Hiểu ~30%)
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-700 bg-amber-900/60">
                  Mức 3 (Vận dụng ~20%)
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-700 bg-indigo-900/60">
                  Tổng TN & TL
                </th>
                <th rowSpan={2} className="p-3 w-28 bg-slate-900">
                  Tổng điểm (%)
                </th>
                <th rowSpan={2} className="p-3 w-12 print:hidden"></th>
              </tr>
              <tr className="bg-slate-100 text-slate-700 font-medium text-center border-b border-slate-200 text-[11px]">
                {/* Mức 1 */}
                <th className="p-1.5 border-r border-slate-200 w-16">TN</th>
                <th className="p-1.5 border-r border-slate-200 w-16">TL</th>
                {/* Mức 2 */}
                <th className="p-1.5 border-r border-slate-200 w-16">TN</th>
                <th className="p-1.5 border-r border-slate-200 w-16">TL</th>
                {/* Mức 3 */}
                <th className="p-1.5 border-r border-slate-200 w-16">TN</th>
                <th className="p-1.5 border-r border-slate-200 w-16">TL</th>
                {/* Tổng */}
                <th className="p-1.5 border-r border-slate-200 w-16">TN (60%)</th>
                <th className="p-1.5 border-r border-slate-200 w-16">TL (40%)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {matrix.strands.map((strand, idx) => {
                const rowTNCount = strand.m1_tn_count + strand.m2_tn_count + strand.m3_tn_count;
                const rowTNPoints = Math.round((strand.m1_tn_points + strand.m2_tn_points + strand.m3_tn_points) * 100) / 100;
                const rowTLCount = strand.m1_tl_count + strand.m2_tl_count + strand.m3_tl_count;
                const rowTLPoints = Math.round((strand.m1_tl_points + strand.m2_tl_points + strand.m3_tl_points) * 100) / 100;

                return (
                  <tr key={strand.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    {/* Strand Name Input */}
                    <td className="p-2.5 font-medium text-slate-800 border-r border-slate-200">
                      <input
                        type="text"
                        value={strand.name}
                        onChange={e => handleStrandChange(idx, 'name', e.target.value)}
                        className="w-full bg-transparent font-medium hover:border-b hover:border-slate-300 focus:border-b-2 focus:border-emerald-600 focus:outline-none"
                      />
                      {strand.targetPercentage && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Tỉ lệ mục tiêu GDPT: {strand.targetPercentage}%
                        </div>
                      )}
                    </td>

                    {/* Mức 1: TN */}
                    <td className="p-1.5 text-center border-r border-slate-200 bg-emerald-50/20">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={strand.m1_tn_count}
                          onChange={e => handleStrandChange(idx, 'm1_tn_count', parseInt(e.target.value) || 0)}
                          className="w-7 text-center font-semibold bg-white border border-slate-200 rounded p-0.5 text-xs"
                          title="Số câu TN Mức 1"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={strand.m1_tn_points}
                          onChange={e => handleStrandChange(idx, 'm1_tn_points', parseFloat(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded p-0.5 text-xs"
                          title="Điểm TN Mức 1"
                        />
                      </div>
                    </td>

                    {/* Mức 1: TL */}
                    <td className="p-1.5 text-center border-r border-slate-200 bg-emerald-50/20">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={strand.m1_tl_count}
                          onChange={e => handleStrandChange(idx, 'm1_tl_count', parseInt(e.target.value) || 0)}
                          className="w-7 text-center font-semibold bg-white border border-slate-200 rounded p-0.5 text-xs"
                          title="Số câu TL Mức 1"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={strand.m1_tl_points}
                          onChange={e => handleStrandChange(idx, 'm1_tl_points', parseFloat(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded p-0.5 text-xs"
                          title="Điểm TL Mức 1"
                        />
                      </div>
                    </td>

                    {/* Mức 2: TN */}
                    <td className="p-1.5 text-center border-r border-slate-200 bg-sky-50/20">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={strand.m2_tn_count}
                          onChange={e => handleStrandChange(idx, 'm2_tn_count', parseInt(e.target.value) || 0)}
                          className="w-7 text-center font-semibold bg-white border border-slate-200 rounded p-0.5 text-xs"
                          title="Số câu TN Mức 2"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={strand.m2_tn_points}
                          onChange={e => handleStrandChange(idx, 'm2_tn_points', parseFloat(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-sky-800 bg-sky-50 border border-sky-300 rounded p-0.5 text-xs"
                          title="Điểm TN Mức 2"
                        />
                      </div>
                    </td>

                    {/* Mức 2: TL */}
                    <td className="p-1.5 text-center border-r border-slate-200 bg-sky-50/20">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={strand.m2_tl_count}
                          onChange={e => handleStrandChange(idx, 'm2_tl_count', parseInt(e.target.value) || 0)}
                          className="w-7 text-center font-semibold bg-white border border-slate-200 rounded p-0.5 text-xs"
                          title="Số câu TL Mức 2"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={strand.m2_tl_points}
                          onChange={e => handleStrandChange(idx, 'm2_tl_points', parseFloat(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-sky-800 bg-sky-50 border border-sky-300 rounded p-0.5 text-xs"
                          title="Điểm TL Mức 2"
                        />
                      </div>
                    </td>

                    {/* Mức 3: TN */}
                    <td className="p-1.5 text-center border-r border-slate-200 bg-amber-50/20">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={strand.m3_tn_count}
                          onChange={e => handleStrandChange(idx, 'm3_tn_count', parseInt(e.target.value) || 0)}
                          className="w-7 text-center font-semibold bg-white border border-slate-200 rounded p-0.5 text-xs"
                          title="Số câu TN Mức 3"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={strand.m3_tn_points}
                          onChange={e => handleStrandChange(idx, 'm3_tn_points', parseFloat(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded p-0.5 text-xs"
                          title="Điểm TN Mức 3"
                        />
                      </div>
                    </td>

                    {/* Mức 3: TL */}
                    <td className="p-1.5 text-center border-r border-slate-200 bg-amber-50/20">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={strand.m3_tl_count}
                          onChange={e => handleStrandChange(idx, 'm3_tl_count', parseInt(e.target.value) || 0)}
                          className="w-7 text-center font-semibold bg-white border border-slate-200 rounded p-0.5 text-xs"
                          title="Số câu TL Mức 3"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={strand.m3_tl_points}
                          onChange={e => handleStrandChange(idx, 'm3_tl_points', parseFloat(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded p-0.5 text-xs"
                          title="Điểm TL Mức 3"
                        />
                      </div>
                    </td>

                    {/* Total TN */}
                    <td className="p-1.5 text-center font-semibold text-blue-900 border-r border-slate-200 bg-blue-50/30">
                      {rowTNCount}c / {rowTNPoints.toFixed(1)}đ
                    </td>

                    {/* Total TL */}
                    <td className="p-1.5 text-center font-semibold text-purple-900 border-r border-slate-200 bg-purple-50/30">
                      {rowTLCount}c / {rowTLPoints.toFixed(1)}đ
                    </td>

                    {/* Strand Total Point & Percent */}
                    <td className="p-2 text-center font-bold text-slate-800 bg-slate-100">
                      <span className="text-sm">{strand.total_points.toFixed(1)}đ</span>
                      <div className="text-[11px] text-slate-500 font-normal">
                        ({strand.percentage}%)
                      </div>
                    </td>

                    {/* Remove Action */}
                    <td className="p-1.5 text-center print:hidden">
                      {matrix.strands.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStrand(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Xóa mạch kiến thức này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Summary Row */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400 text-center">
                <td className="p-3 text-left border-r border-slate-300">
                  TỔNG CỘNG THEO MỨC ĐỘ
                </td>

                {/* Mức 1 Total */}
                <td colSpan={2} className="p-2 border-r border-slate-300 bg-emerald-100/60">
                  <div>{matrix.summary.m1_points.toFixed(1)} điểm</div>
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    ({matrix.summary.m1_percent}% - Chuẩn ~50%)
                  </div>
                </td>

                {/* Mức 2 Total */}
                <td colSpan={2} className="p-2 border-r border-slate-300 bg-sky-100/60">
                  <div>{matrix.summary.m2_points.toFixed(1)} điểm</div>
                  <div className="text-[11px] text-sky-800 font-semibold">
                    ({matrix.summary.m2_percent}% - Chuẩn ~30%)
                  </div>
                </td>

                {/* Mức 3 Total */}
                <td colSpan={2} className="p-2 border-r border-slate-300 bg-amber-100/60">
                  <div>{matrix.summary.m3_points.toFixed(1)} điểm</div>
                  <div className="text-[11px] text-amber-800 font-semibold">
                    ({matrix.summary.m3_percent}% - Chuẩn ~20%)
                  </div>
                </td>

                {/* Total TN */}
                <td className="p-2 border-r border-slate-300 bg-blue-100 text-blue-900">
                  <div>{matrix.summary.tn_points.toFixed(1)}đ</div>
                  <div className="text-[11px] text-blue-700">({matrix.summary.tn_percent}%)</div>
                </td>

                {/* Total TL */}
                <td className="p-2 border-r border-slate-300 bg-purple-100 text-purple-900">
                  <div>{matrix.summary.tl_points.toFixed(1)}đ</div>
                  <div className="text-[11px] text-purple-700">({matrix.summary.tl_percent}%)</div>
                </td>

                {/* Total 10.0 points */}
                <td className="p-2 bg-slate-900 text-white">
                  <div className="text-sm font-extrabold">{matrix.summary.total_points.toFixed(1)}đ</div>
                  <div className="text-[11px] text-emerald-300">100%</div>
                </td>

                <td className="print:hidden"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
