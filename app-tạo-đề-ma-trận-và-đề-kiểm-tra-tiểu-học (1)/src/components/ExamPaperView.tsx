import React, { useState } from 'react';
import { FullExamData, ExamQuestion } from '../types/exam';
import { SquareGridCanvas } from './SquareGridCanvas';
import { Plus, Trash2, Edit3, Grid, BookOpen, PenTool, CheckCircle, Award, Sparkles } from 'lucide-react';

interface ExamPaperViewProps {
  exam: FullExamData;
  onUpdateExam: (updated: FullExamData) => void;
  onOpenQuestionModal?: (question?: ExamQuestion) => void;
}

export const ExamPaperView: React.FC<ExamPaperViewProps> = ({
  exam,
  onUpdateExam,
  onOpenQuestionModal,
}) => {
  const { header, questions, readingPassage, writingSection } = exam;
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handlePointChange = (qIndex: number, newPoint: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      points: newPoint,
    };

    // Also sync with scoring guide and specifications
    const updatedScoring = exam.scoringGuide.map(sc => {
      if (sc.questionNumber === `Câu ${updatedQuestions[qIndex].number}`) {
        return { ...sc, points: newPoint };
      }
      return sc;
    });

    const updatedSpecs = exam.specifications.map(sp => {
      if (sp.questionNum === `Câu ${updatedQuestions[qIndex].number}`) {
        return { ...sp, points: newPoint };
      }
      return sp;
    });

    onUpdateExam({
      ...exam,
      questions: updatedQuestions,
      scoringGuide: updatedScoring,
      specifications: updatedSpecs,
    });
  };

  const handlePromptChange = (qIndex: number, newPrompt: string) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], prompt: newPrompt };
    onUpdateExam({ ...exam, questions: updated });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, newText: string) => {
    const updated = [...questions];
    const opts = [...(updated[qIndex].options || [])];
    opts[optIndex] = newText;
    updated[qIndex] = { ...updated[qIndex], options: opts };
    onUpdateExam({ ...exam, questions: updated });
  };

  const toggleQuestionGrid = (qIndex: number) => {
    const updated = [...questions];
    const current = updated[qIndex];
    updated[qIndex] = {
      ...current,
      hasGrid: !current.hasGrid,
      gridConfig: !current.hasGrid
        ? { type: 'grid_shape', gridSize: { rows: 6, cols: 8, cellSize: 28 }, caption: 'Lưới ô vuông' }
        : undefined,
    };
    onUpdateExam({ ...exam, questions: updated });
  };

  const addQuestion = (part: 'TN' | 'TL') => {
    const newNumber = questions.length + 1;
    const newQ: ExamQuestion = {
      id: `q-${Date.now()}`,
      number: newNumber,
      part,
      strand: exam.matrix.strands[0]?.name || 'Số và phép tính',
      level: part === 'TN' ? 'Mức 1' : 'Mức 2',
      points: part === 'TN' ? 0.5 : 1.0,
      prompt: part === 'TN' ? 'Nội dung câu hỏi trắc nghiệm mới...' : 'Nội dung câu hỏi tự luận mới...',
      options: part === 'TN' ? ['A. Phương án 1', 'B. Phương án 2', 'C. Phương án 3', 'D. Phương án 4'] : undefined,
      correctOption: 'A',
      workSpaceHeightLines: part === 'TL' ? 4 : undefined,
    };

    onUpdateExam({
      ...exam,
      questions: [...questions, newQ],
    });
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== qIndex).map((q, idx) => ({ ...q, number: idx + 1 }));
    onUpdateExam({ ...exam, questions: updated });
  };

  const tnQuestions = questions.filter(q => q.part === 'TN');
  const tlQuestions = questions.filter(q => q.part === 'TL');

  const totalTNPoints = tnQuestions.reduce((s, q) => s + (Number(q.points) || 0), 0);
  const totalTLPoints = tlQuestions.reduce((s, q) => s + (Number(q.points) || 0), 0);

  // Word count analysis for reading passage
  const actualWordCount = readingPassage?.content
    ? readingPassage.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Exam Paper Sheet Container */}
      <div className="bg-white p-6 md:p-10 rounded-xl border border-slate-200 shadow-md font-serif text-slate-900 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* National and School Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300">
          <div className="text-center">
            <div className="text-xs tracking-wider uppercase font-sans text-slate-600 font-semibold">
              {header.governingBody}
            </div>
            <div className="text-sm font-bold uppercase tracking-wide text-slate-900 mt-0.5">
              {header.schoolName}
            </div>
            <div className="w-16 h-0.5 bg-slate-800 mx-auto mt-1"></div>
          </div>

          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <div className="w-20 h-0.5 bg-slate-800 mx-auto mt-1"></div>
          </div>
        </div>

        {/* Exam Title */}
        <div className="text-center my-6">
          <h1 className="text-lg md:text-xl font-bold uppercase tracking-wide text-slate-900">
            {header.examTitle} - NĂM HỌC {header.schoolYear}
          </h1>
          <h2 className="text-base font-bold text-slate-800 mt-1 uppercase">
            MÔN: {header.subject} - LỚP {header.grade}
          </h2>
          <p className="text-xs italic text-slate-600 mt-1">
            (Thời gian làm bài: {header.timeMinutes} phút - Không kể thời gian giao đề)
          </p>
        </div>

        {/* Student Identification & Teacher Grading Box (Thông tư 27) */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-700 rounded-lg overflow-hidden my-5 text-xs">
          <div className="md:col-span-7 p-3 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-700 space-y-2">
            <div>
              <span className="font-semibold">Họ và tên học sinh:</span>{' '}
              <span className="border-b border-dotted border-slate-600 inline-block w-48"></span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="font-semibold">Lớp:</span>{' '}
                <span className="font-bold">{header.grade}.....</span>
              </div>
              <div>
                <span className="font-semibold">Trường:</span>{' '}
                <span>{header.schoolName}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 p-3 bg-white text-center">
            <div className="font-bold text-[11px] uppercase tracking-wide text-slate-800 border-b border-slate-300 pb-1">
              ĐIỂM SỐ VÀ NHẬN XÉT CỦA GIÁO VIÊN
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
              <div className="border-r border-slate-200 pr-2">
                <span className="text-slate-500">Điểm số:</span>
                <div className="h-7 border border-dashed border-slate-300 rounded mt-1 flex items-center justify-center font-bold text-base text-emerald-800">
                  ....../10
                </div>
              </div>
              <div>
                <span className="text-slate-500">Điểm chữ:</span>
                <div className="h-7 border border-dashed border-slate-300 rounded mt-1 flex items-center justify-center font-medium text-xs text-slate-700 italic">
                  ...............
                </div>
              </div>
            </div>
            <div className="mt-2 text-left text-[11px] text-slate-600">
              <span className="font-semibold italic">Lời nhận xét (TT 27):</span>
              <div className="border-b border-dotted border-slate-400 mt-3"></div>
            </div>
          </div>
        </div>

        {/* READING PASSAGE (MÔN TIẾNG VIỆT) */}
        {readingPassage && readingPassage.content && (
          <div className="my-6 p-4 bg-emerald-50/30 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                A. BÀI ĐỌC KIỂM TRA (Ngữ liệu đọc hiểu):
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-medium">
                {actualWordCount} chữ (Chuẩn: {header.grade === '4' ? '280 - 330 chữ' : '300 - 350 chữ'})
              </span>
            </div>

            <div className="text-center font-bold text-base text-slate-900 my-2 uppercase">
              {readingPassage.title}
            </div>
            <div className="text-right text-xs italic text-slate-600 mb-3">
              Tác giả: {readingPassage.author}
            </div>

            <div className="text-xs leading-relaxed space-y-2.5 text-justify text-slate-800 font-serif">
              {readingPassage.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="indent-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Reading Aloud Prompt */}
            {readingPassage.readingAloudPrompt && (
              <div className="mt-4 pt-3 border-t border-emerald-200 text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>I. ĐỌC THÀNH TIẾNG ({readingPassage.readingAloudPrompt.points} điểm):</span>
                </div>
                <p className="italic text-slate-700 mt-1">
                  Đoạn đọc: {readingPassage.readingAloudPrompt.passageSnippet}
                </p>
                <p className="text-slate-800 mt-0.5 font-medium">
                  Câu hỏi kiểm tra: {readingPassage.readingAloudPrompt.question}
                </p>
              </div>
            )}
          </div>
        )}

        {/* SECTION I: TRẮC NGHIỆM */}
        {tnQuestions.length > 0 && (
          <div className="my-6">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1 mb-3">
              <h3 className="text-sm md:text-base font-bold uppercase text-slate-900">
                PHẦN I. TRẮC NGHIỆM ({totalTNPoints.toFixed(1)} điểm)
              </h3>
              <button
                type="button"
                onClick={() => addQuestion('TN')}
                className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-sans font-semibold bg-blue-50 px-2 py-1 rounded print:hidden"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm câu TN</span>
              </button>
            </div>
            <p className="text-xs italic text-slate-600 mb-4">
              Khoanh tròn vào chữ cái (A, B, C hoặc D) trước câu trả lời đúng nhất:
            </p>

            <div className="space-y-4">
              {tnQuestions.map((q, idx) => {
                const originalIndex = questions.findIndex(item => item.id === q.id);
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg border border-transparent hover:border-slate-300 transition text-xs relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            Câu {q.number}:
                          </span>

                          {/* "CÓ CHỖ SỬA ĐIỂM" inline input */}
                          <div className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5 text-[11px] font-sans font-bold text-amber-900">
                            <span>(</span>
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              value={q.points}
                              onChange={e => handlePointChange(originalIndex, parseFloat(e.target.value) || 0)}
                              className="w-10 text-center font-bold bg-white border border-amber-400 rounded px-0.5 focus:outline-none"
                              title="Sửa điểm câu này"
                            />
                            <span> điểm)</span>
                          </div>

                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-sans">
                            {q.level} • {q.strand}
                          </span>
                        </div>

                        {/* Prompt Content */}
                        <div className="mt-1 font-medium text-slate-900 leading-normal">
                          <textarea
                            value={q.prompt}
                            onChange={e => handlePromptChange(originalIndex, e.target.value)}
                            rows={2}
                            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white border-none hover:border focus:ring-1 focus:ring-emerald-500 rounded p-1 resize-y text-xs font-serif"
                          />
                        </div>

                        {/* Options A, B, C, D */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-1.5 p-1.5 rounded border ${
                                  opt.startsWith(q.correctOption || 'A')
                                    ? 'bg-emerald-50/40 border-emerald-300'
                                    : 'border-slate-200'
                                }`}
                              >
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => handleOptionChange(originalIndex, optIdx, e.target.value)}
                                  className="w-full bg-transparent text-xs font-serif focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 print:hidden opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => removeQuestion(originalIndex)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Xóa câu hỏi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION II: TỰ LUẬN */}
        {tlQuestions.length > 0 && (
          <div className="my-6">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1 mb-3">
              <h3 className="text-sm md:text-base font-bold uppercase text-slate-900">
                PHẦN II. TỰ LUẬN ({totalTLPoints.toFixed(1)} điểm)
              </h3>
              <button
                type="button"
                onClick={() => addQuestion('TL')}
                className="flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900 font-sans font-semibold bg-purple-50 px-2 py-1 rounded print:hidden"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm câu TL</span>
              </button>
            </div>

            <div className="space-y-6">
              {tlQuestions.map((q, idx) => {
                const originalIndex = questions.findIndex(item => item.id === q.id);
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg border border-transparent hover:border-slate-300 transition text-xs relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            Câu {q.number}:
                          </span>

                          {/* "CÓ CHỖ SỬA ĐIỂM" */}
                          <div className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5 text-[11px] font-sans font-bold text-amber-900">
                            <span>(</span>
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              value={q.points}
                              onChange={e => handlePointChange(originalIndex, parseFloat(e.target.value) || 0)}
                              className="w-10 text-center font-bold bg-white border border-amber-400 rounded px-0.5 focus:outline-none"
                              title="Sửa điểm câu này"
                            />
                            <span> điểm)</span>
                          </div>

                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-sans">
                            {q.level} • {q.strand}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleQuestionGrid(originalIndex)}
                            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-sans transition print:hidden ${
                              q.hasGrid ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title="Bật/tắt lưới ô vuông tiểu học"
                          >
                            <Grid className="w-3 h-3" />
                            <span>{q.hasGrid ? 'Đã bật lưới ô vuông' : 'Thêm lưới ô vuông'}</span>
                          </button>
                        </div>

                        {/* Prompt */}
                        <div className="mt-1 font-medium text-slate-900 leading-normal">
                          <textarea
                            value={q.prompt}
                            onChange={e => handlePromptChange(originalIndex, e.target.value)}
                            rows={3}
                            className="w-full bg-transparent hover:bg-slate-50 focus:bg-white border-none hover:border focus:ring-1 focus:ring-emerald-500 rounded p-1 resize-y text-xs font-serif"
                          />
                        </div>

                        {/* Geometry Square Grid Canvas if enabled */}
                        {q.hasGrid && (
                          <div className="my-2">
                            <SquareGridCanvas
                              config={q.gridConfig}
                              editable={true}
                              questionNumber={q.number}
                              onConfigChange={newConf => {
                                const updated = [...questions];
                                updated[originalIndex] = { ...updated[originalIndex], gridConfig: newConf };
                                onUpdateExam({ ...exam, questions: updated });
                              }}
                            />
                          </div>
                        )}

                        {/* Primary School Lined Workspace for Students */}
                        <div className="my-3 space-y-3.5 pl-2 select-none">
                          <div className="text-[10px] italic text-slate-400 font-sans print:hidden">
                            Bài làm của học sinh (Dòng kẻ ô ly tiểu học):
                          </div>
                          {Array.from({ length: q.workSpaceHeightLines || 4 }).map((_, lIdx) => (
                            <div
                              key={lIdx}
                              className="border-b border-dotted border-slate-400 h-5 w-full"
                            ></div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 print:hidden opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => removeQuestion(originalIndex)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Xóa câu hỏi này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WRITING SECTION (MÔN TIẾNG VIỆT) */}
        {writingSection && (
          <div className="my-6 pt-4 border-t-2 border-slate-800">
            <h3 className="text-sm md:text-base font-bold uppercase text-slate-900">
              {writingSection.title}
            </h3>
            <div className="mt-2 text-xs font-medium text-slate-900 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
              <strong>{writingSection.prompt}</strong>
              <p className="text-[11px] italic text-slate-600 mt-1">
                {writingSection.instructions}
              </p>
            </div>

            {/* Student Writing Lines */}
            <div className="my-4 space-y-4 pl-2 select-none">
              <div className="text-center italic text-xs text-slate-600 font-bold">
                Bài làm
              </div>
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="border-b border-dotted border-slate-400 h-5 w-full"></div>
              ))}
            </div>
          </div>
        )}

        {/* Signature Footer */}
        <div className="grid grid-cols-2 gap-4 mt-8 pt-4 text-xs text-center border-t border-slate-200">
          <div>
            <div className="font-bold uppercase text-slate-800">CÁN BỘ COI THI</div>
            <div className="italic text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</div>
            <div className="h-16"></div>
          </div>

          <div>
            <div className="font-bold uppercase text-slate-800">GIÁO VIÊN CHẤM THI</div>
            <div className="italic text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</div>
            <div className="h-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
