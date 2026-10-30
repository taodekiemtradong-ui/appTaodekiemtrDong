import React from 'react';
import { FullExamData, SpecificationItem } from '../types/exam';
import { Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';

interface SpecificationViewProps {
  exam: FullExamData;
  onUpdateExam: (updated: FullExamData) => void;
}

export const SpecificationView: React.FC<SpecificationViewProps> = ({ exam, onUpdateExam }) => {
  const { header, specifications } = exam;

  const handleSpecChange = (index: number, field: keyof SpecificationItem, value: any) => {
    const updated = [...specifications];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateExam({
      ...exam,
      specifications: updated,
    });
  };

  const addSpecItem = () => {
    const newItem: SpecificationItem = {
      id: `spec-${Date.now()}`,
      questionNum: `Câu ${specifications.length + 1}`,
      format: 'TN',
      strand: exam.matrix.strands[0]?.name || 'Số và phép tính',
      level: 'Mức 1',
      competency: 'Nhận biết kiến thức cốt lõi.',
      description: 'Dạng bài tập cơ bản.',
      points: 0.5,
    };
    onUpdateExam({
      ...exam,
      specifications: [...specifications, newItem],
    });
  };

  const removeSpecItem = (index: number) => {
    if (specifications.length <= 1) return;
    const updated = specifications.filter((_, i) => i !== index);
    onUpdateExam({
      ...exam,
      specifications: updated,
    });
  };

  const totalSpecPoints = specifications.reduce((s, item) => s + (Number(item.points) || 0), 0);

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
              BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ
            </h2>
            <p className="text-sm text-slate-500">
              Môn: <strong className="text-slate-700">{header.subject}</strong> - Lớp <strong className="text-slate-700">{header.grade}</strong> ({header.term} • Năm học {header.schoolYear})
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={addSpecItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mục đặc tả</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 mt-3">
          <span>Tổng số câu đặc tả: <strong>{specifications.length} câu</strong></span>
          <span>
            Tổng điểm đặc tả:{' '}
            <strong className={`px-2 py-0.5 rounded ${Math.abs(totalSpecPoints - 10) < 0.05 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {totalSpecPoints.toFixed(1)} / 10.0 điểm
            </strong>
          </span>
        </div>
      </div>

      {/* Specification Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold text-center border-b border-slate-700">
                <th className="p-3 w-16 border-r border-slate-700">Câu hỏi</th>
                <th className="p-3 w-20 border-r border-slate-700">Hình thức</th>
                <th className="p-3 w-1/4 border-r border-slate-700 text-left">Mạch kiến thức</th>
                <th className="p-3 w-20 border-r border-slate-700">Mức độ</th>
                <th className="p-3 border-r border-slate-700 text-left">Yêu cầu cần đạt & Mô tả</th>
                <th className="p-3 w-20 border-r border-slate-700">Điểm số</th>
                <th className="p-3 w-10 print:hidden"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {specifications.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  {/* Question Number */}
                  <td className="p-2.5 text-center font-bold text-slate-800 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.questionNum}
                      onChange={e => handleSpecChange(idx, 'questionNum', e.target.value)}
                      className="w-14 text-center bg-transparent font-bold hover:border-b hover:border-slate-300 focus:outline-none"
                    />
                  </td>

                  {/* Format TN or TL */}
                  <td className="p-2 text-center border-r border-slate-200">
                    <select
                      value={item.format}
                      onChange={e => handleSpecChange(idx, 'format', e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none ${
                        item.format === 'TN' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      <option value="TN">TN</option>
                      <option value="TL">TL</option>
                    </select>
                  </td>

                  {/* Strand */}
                  <td className="p-2.5 border-r border-slate-200 text-slate-700 font-medium">
                    <input
                      type="text"
                      value={item.strand}
                      onChange={e => handleSpecChange(idx, 'strand', e.target.value)}
                      className="w-full bg-transparent hover:border-b hover:border-slate-300 focus:outline-none font-medium text-slate-800"
                    />
                  </td>

                  {/* Cognitive Level */}
                  <td className="p-2 text-center border-r border-slate-200">
                    <select
                      value={item.level}
                      onChange={e => handleSpecChange(idx, 'level', e.target.value)}
                      className={`text-xs font-semibold px-1.5 py-1 rounded border focus:outline-none ${
                        item.level === 'Mức 1'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.level === 'Mức 2'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="Mức 1">Mức 1</option>
                      <option value="Mức 2">Mức 2</option>
                      <option value="Mức 3">Mức 3</option>
                    </select>
                  </td>

                  {/* Competency & Description */}
                  <td className="p-2.5 border-r border-slate-200">
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={item.competency}
                        onChange={e => handleSpecChange(idx, 'competency', e.target.value)}
                        placeholder="Yêu cầu cần đạt..."
                        className="w-full font-medium text-slate-900 bg-transparent hover:border-b hover:border-slate-300 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => handleSpecChange(idx, 'description', e.target.value)}
                        placeholder="Mô tả dạng bài tập..."
                        className="w-full text-slate-500 bg-transparent hover:border-b hover:border-slate-300 focus:outline-none text-[11px]"
                      />
                    </div>
                  </td>

                  {/* Point (Sửa điểm) */}
                  <td className="p-2 text-center border-r border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-center gap-0.5">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={item.points}
                        onChange={e => handleSpecChange(idx, 'points', parseFloat(e.target.value) || 0)}
                        className="w-12 text-center font-bold text-emerald-800 bg-white border border-emerald-300 rounded p-1 text-xs shadow-inner"
                      />
                      <span className="text-slate-500 font-medium">đ</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-2 text-center print:hidden">
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Xóa dòng đặc tả này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
