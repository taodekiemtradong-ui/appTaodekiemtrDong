import React from 'react';
import { FullExamData, ScoringItem } from '../types/exam';
import { CheckSquare, Plus, Trash2, Award, Edit3, HelpCircle } from 'lucide-react';

interface ScoringGuideViewProps {
  exam: FullExamData;
  onUpdateExam: (updated: FullExamData) => void;
}

export const ScoringGuideView: React.FC<ScoringGuideViewProps> = ({ exam, onUpdateExam }) => {
  const { header, scoringGuide, writingSection } = exam;

  const handleScoreChange = (index: number, field: keyof ScoringItem, value: any) => {
    const updated = [...scoringGuide];
    updated[index] = { ...updated[index], [field]: value };

    // Also sync point with corresponding question
    const updatedQuestions = exam.questions.map(q => {
      if (`Câu ${q.number}` === updated[index].questionNumber) {
        return { ...q, points: Number(updated[index].points) || 0 };
      }
      return q;
    });

    onUpdateExam({
      ...exam,
      scoringGuide: updated,
      questions: updatedQuestions,
    });
  };

  const addScoreItem = () => {
    const newItem: ScoringItem = {
      id: `sc-${Date.now()}`,
      questionNumber: `Câu ${scoringGuide.length + 1}`,
      points: 0.5,
      answer: 'Đáp án chuẩn...',
      explanation: 'Hướng dẫn chấm và các bước làm bài chi tiết...',
    };
    onUpdateExam({
      ...exam,
      scoringGuide: [...scoringGuide, newItem],
    });
  };

  const removeScoreItem = (index: number) => {
    if (scoringGuide.length <= 1) return;
    const updated = scoringGuide.filter((_, i) => i !== index);
    onUpdateExam({
      ...exam,
      scoringGuide: updated,
    });
  };

  const totalGuidePoints = scoringGuide.reduce((s, item) => s + (Number(item.points) || 0), 0);

  // Group quick Multiple Choice answers for convenient glance
  const tnAnswers = scoringGuide.filter(s => {
    const match = exam.questions.find(q => `Câu ${q.number}` === s.questionNumber);
    return match?.part === 'TN';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {header.governingBody} • {header.schoolName}
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-1">
              HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN BIỂU ĐIỂM
            </h2>
            <p className="text-sm text-slate-500">
              Môn: <strong className="text-slate-700">{header.subject}</strong> - Lớp <strong className="text-slate-700">{header.grade}</strong> ({header.term} • Năm học {header.schoolYear})
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={addScoreItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mục chấm</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 mt-3">
          <span>
            Tính năng đặc biệt: <strong className="text-emerald-700 font-semibold">"Có chỗ sửa điểm"</strong> trực tiếp trên từng câu.
          </span>
          <span>
            Tổng điểm biểu điểm:{' '}
            <strong className={`px-2 py-0.5 rounded ${Math.abs(totalGuidePoints - 10) < 0.05 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {totalGuidePoints.toFixed(1)} / 10.0 điểm
            </strong>
          </span>
        </div>
      </div>

      {/* Quick Multiple Choice Grid */}
      {tnAnswers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-bold uppercase text-blue-900 tracking-wider mb-2 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            Bảng tra nhanh đáp án Trắc nghiệm:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-xs">
            {tnAnswers.map(sc => (
              <div key={sc.id} className="p-2 bg-blue-50/60 rounded-lg border border-blue-200 text-center">
                <div className="font-bold text-slate-700">{sc.questionNumber}</div>
                <div className="text-sm font-extrabold text-blue-800 mt-0.5">
                  {sc.answer.split('.')[0] || sc.answer}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">({sc.points}đ)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Scoring Guide Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold text-center border-b border-slate-700">
                <th className="p-3 w-20 border-r border-slate-700">Câu số</th>
                <th className="p-3 w-1/4 border-r border-slate-700 text-left">Đáp án đúng</th>
                <th className="p-3 border-r border-slate-700 text-left">Hướng dẫn chấm chi tiết & Các bước cho điểm</th>
                <th className="p-3 w-24 border-r border-slate-700">Biểu điểm (Sửa)</th>
                <th className="p-3 w-10 print:hidden"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {scoringGuide.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  {/* Question Number */}
                  <td className="p-3 text-center font-bold text-slate-800 border-r border-slate-200">
                    <input
                      type="text"
                      value={item.questionNumber}
                      onChange={e => handleScoreChange(idx, 'questionNumber', e.target.value)}
                      className="w-16 text-center font-bold bg-transparent hover:border-b hover:border-slate-300 focus:outline-none"
                    />
                  </td>

                  {/* Answer */}
                  <td className="p-3 border-r border-slate-200 font-medium text-slate-900">
                    <textarea
                      value={item.answer}
                      onChange={e => handleScoreChange(idx, 'answer', e.target.value)}
                      rows={2}
                      className="w-full bg-transparent hover:bg-slate-50 focus:bg-white border-none hover:border rounded p-1 text-xs focus:ring-1 focus:ring-emerald-500 font-serif"
                    />
                  </td>

                  {/* Explanation & Steps */}
                  <td className="p-3 border-r border-slate-200 text-slate-700">
                    <textarea
                      value={item.explanation}
                      onChange={e => handleScoreChange(idx, 'explanation', e.target.value)}
                      rows={3}
                      className="w-full bg-transparent hover:bg-slate-50 focus:bg-white border-none hover:border rounded p-1 text-xs focus:ring-1 focus:ring-emerald-500"
                    />

                    {/* Step breakdowns if available */}
                    {item.steps && item.steps.length > 0 && (
                      <div className="mt-2 space-y-1 pl-2 border-l-2 border-emerald-400 text-[11px] text-slate-600 bg-emerald-50/30 p-1.5 rounded-r">
                        <div className="font-semibold text-emerald-800">Chia điểm từng bước:</div>
                        {item.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex justify-between items-center">
                            <span>• {step.step}</span>
                            <span className="font-bold text-emerald-700">+{step.points}đ</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Điểm số: "CÓ CHỖ SỬA ĐIỂM" */}
                  <td className="p-3 text-center border-r border-slate-200 bg-amber-50/20">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={item.points}
                        onChange={e => handleScoreChange(idx, 'points', parseFloat(e.target.value) || 0)}
                        className="w-12 text-center font-bold text-amber-900 bg-white border border-amber-400 rounded p-1 text-xs shadow-inner focus:outline-none"
                        title="Sửa điểm câu này"
                      />
                      <span className="text-slate-600 font-bold">đ</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="p-2 text-center print:hidden">
                    {scoringGuide.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScoreItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Xóa mục chấm này"
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

      {/* Writing Criteria Rubric if Vietnamese */}
      {writingSection && writingSection.criteria && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="text-xs font-bold uppercase text-purple-900 tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            Biểu điểm và tiêu chí chấm Bài kiểm tra Viết ({writingSection.points} điểm):
          </div>
          <p className="text-xs italic text-slate-600 mb-3">
            Áp dụng chuẩn đánh giá học sinh tiểu học Thông tư 27/2020/TT-BGDĐT:
          </p>

          <div className="space-y-2 text-xs">
            {writingSection.criteria.map((c, idx) => (
              <div key={idx} className="flex items-start justify-between p-2.5 bg-purple-50/40 rounded-lg border border-purple-200">
                <div>
                  <span className="font-bold text-slate-800">{c.name}</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{c.note}</p>
                </div>
                <div className="font-extrabold text-purple-800 px-2 py-0.5 rounded bg-white border border-purple-300">
                  {c.maxPoints} điểm
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
