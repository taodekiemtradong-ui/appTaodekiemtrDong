import React, { useState, useEffect } from 'react';
import { FullExamData, ExamHeader } from './types/exam';
import { SAMPLE_EXAMS } from './data/sampleExams';
import { ScoreAdjustmentBar } from './components/ScoreAdjustmentBar';
import { MatrixView } from './components/MatrixView';
import { SpecificationView } from './components/SpecificationView';
import { ExamPaperView } from './components/ExamPaperView';
import { ScoringGuideView } from './components/ScoringGuideView';
import { HeaderEditorModal } from './components/HeaderEditorModal';
import { AIGenerateModal } from './components/AIGenerateModal';
import { CurriculumGuideModal } from './components/CurriculumGuideModal';
import { exportExamToDocx } from './utils/docxExport';
import confetti from 'canvas-confetti';
import {
  Table2,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  School,
  Save,
  RotateCcw,
  ChevronDown,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  // Load saved or default sample exam
  const [currentExam, setCurrentExam] = useState<FullExamData>(() => {
    const saved = localStorage.getItem('app_chica_current_exam');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved exam:', e);
      }
    }
    return SAMPLE_EXAMS[0]; // Toán 4 GKI Chí Cà 2026-2027
  });

  const [activeTab, setActiveTab] = useState<'matrix' | 'specs' | 'exam' | 'scoring'>('matrix');

  // Modals
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_chica_current_exam', JSON.stringify(currentExam));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [currentExam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch to another pre-built sample exam
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_EXAMS.find(s => s.id === sampleId);
    if (found) {
      setCurrentExam(JSON.parse(JSON.stringify(found)));
      showToast(`Đã chuyển sang đề: ${found.header.subject} - Lớp ${found.header.grade}`);
    }
  };

  // Auto balance points to 10.0
  const handleAutoBalance = () => {
    const questions = [...currentExam.questions];
    if (questions.length === 0) return;

    const currentTotal = questions.reduce((s, q) => s + (Number(q.points) || 0), 0);
    if (currentTotal === 0) return;

    // Scale each question proportionally to sum to 10
    const factor = 10 / currentTotal;
    let distributedSum = 0;

    const balancedQuestions = questions.map((q, idx) => {
      if (idx === questions.length - 1) {
        // Last question takes remainder to guarantee exact 10.0
        const remainder = Math.round((10 - distributedSum) * 100) / 100;
        return { ...q, points: remainder > 0 ? remainder : 0.5 };
      }
      // Round to nearest 0.25
      const raw = q.points * factor;
      const rounded = Math.round(raw * 4) / 4;
      const validPoint = rounded > 0 ? rounded : 0.25;
      distributedSum += validPoint;
      return { ...q, points: validPoint };
    });

    // Update scoring guide and matrix
    const updatedScoring = currentExam.scoringGuide.map(sc => {
      const match = balancedQuestions.find(q => `Câu ${q.number}` === sc.questionNumber);
      return match ? { ...sc, points: match.points } : sc;
    });

    const updatedSpecs = currentExam.specifications.map(sp => {
      const match = balancedQuestions.find(q => `Câu ${q.number}` === sp.questionNum);
      return match ? { ...sp, points: match.points } : sp;
    });

    // Recompute matrix summary
    let sumM1 = 0;
    let sumM2 = 0;
    let sumM3 = 0;
    let sumTN = 0;
    let sumTL = 0;

    balancedQuestions.forEach(q => {
      if (q.level === 'Mức 1') sumM1 += q.points;
      if (q.level === 'Mức 2') sumM2 += q.points;
      if (q.level === 'Mức 3') sumM3 += q.points;
      if (q.part === 'TN') sumTN += q.points;
      if (q.part === 'TL') sumTL += q.points;
    });

    const newMatrix = {
      ...currentExam.matrix,
      summary: {
        m1_points: Math.round(sumM1 * 100) / 100,
        m1_percent: Math.round((sumM1 / 10) * 100),
        m2_points: Math.round(sumM2 * 100) / 100,
        m2_percent: Math.round((sumM2 / 10) * 100),
        m3_points: Math.round(sumM3 * 100) / 100,
        m3_percent: Math.round((sumM3 / 10) * 100),
        tn_points: Math.round(sumTN * 100) / 100,
        tn_percent: Math.round((sumTN / 10) * 100),
        tl_points: Math.round(sumTL * 100) / 100,
        tl_percent: Math.round((sumTL / 10) * 100),
        total_points: 10.0,
      },
    };

    setCurrentExam({
      ...currentExam,
      questions: balancedQuestions,
      scoringGuide: updatedScoring,
      specifications: updatedSpecs,
      matrix: newMatrix,
    });

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    showToast('Đã tự động cân đối điểm các câu về tròn 10.0 điểm chuẩn!');
  };

  const handleQuickAdjustAll = (delta: number) => {
    const updated = currentExam.questions.map(q => ({
      ...q,
      points: Math.max(0.25, Math.round((q.points + delta) * 100) / 100),
    }));
    setCurrentExam({ ...currentExam, questions: updated });
    showToast(`Đã ${delta > 0 ? 'tăng' : 'giảm'} điểm mỗi câu ${Math.abs(delta)}đ`);
  };

  const handleExportWord = async (type: 'full' | 'exam_only' | 'matrix_only' | 'scoring_only') => {
    setIsExportDropdownOpen(false);
    setIsExporting(true);
    try {
      await exportExamToDocx(currentExam, type);
      showToast('Đã xuất file Word (.docx) thành công!');
    } catch (e: any) {
      console.error(e);
      showToast('Lỗi khi xuất Word: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & School Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  GDPT 2018
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {currentExam.header.governingBody} • {currentExam.header.schoolName} • Năm học {currentExam.header.schoolYear}
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Quick Sample Selector */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px]">Đề mẫu:</span>
              <select
                value={currentExam.id}
                onChange={e => handleSelectSample(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="toan-4-gki-2026">Toán 4 - Giữa Kì I (2026-2027)</option>
                <option value="tieng-viet-4-gki-2026">Tiếng Việt 4 - Giữa Kì I (312 chữ, 11 câu)</option>
                <option value="toan-5-cki-2026">Toán 5 - Cuối Kì I (STP & Hình thang)</option>
                <option value="lsdl-4-gki-2026">Lịch sử & Địa lý 4 - Giữa Kì I</option>
              </select>
            </div>

            {/* AI Generator Button */}
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
              title="Tạo ma trận, đặc tả và đề kiểm tra mới bằng Gemini 3.8 Flash"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tạo Đề AI</span>
            </button>

            {/* School Header Edit */}
            <button
              type="button"
              onClick={() => setIsHeaderModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
              title="Chỉnh sửa tên trường, lớp, năm học, môn thi"
            >
              <School className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Trường & Kì thi</span>
            </button>

            {/* Curriculum Reference Handbook */}
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold border border-sky-200 transition"
              title="Xem sổ tay tỷ lệ % môn Toán, Tiếng Việt, số tiết 2018"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quy chuẩn GDPT</span>
            </button>

            {/* Export Word (.docx) Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
                title="Xuất file Word (.docx) chuẩn phông Times New Roman"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Word</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isExportDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => handleExportWord('full')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 font-semibold text-slate-800 flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Xuất trọn bộ 4 phần (Đầy đủ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportWord('exam_only')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Chỉ xuất Đề kiểm tra</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportWord('matrix_only')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <Table2 className="w-4 h-4 text-purple-600" />
                    <span>Chỉ xuất Ma trận & Bản đặc tả</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportWord('scoring_only')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Chỉ xuất Hướng dẫn chấm & Đáp án</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print A4 button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
              title="In trực tiếp ra giấy A4 chuẩn thể thức văn bản"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In A4</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Real-Time "CÓ CHỖ SỬA ĐIỂM" Management Bar */}
        <ScoreAdjustmentBar
          exam={currentExam}
          onAutoBalance={handleAutoBalance}
          onQuickAdjustAll={handleQuickAdjustAll}
        />

        {/* 4 Core Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex flex-wrap gap-1 print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Table2 className="w-4 h-4" />
            <span>1. MA TRẬN ĐỀ KIỂM TRA</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                activeTab === 'matrix' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              3 Mức độ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>2. BẢN ĐẶC TẢ MA TRẬN</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                activeTab === 'specs' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {currentExam.specifications.length} mục
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. ĐỀ KIỂM TRA CHÍNH THỨC</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                activeTab === 'exam' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Có lưới ô vuông
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scoring')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'scoring'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>4. HƯỚNG DẪN CHẤM & ĐÁP ÁN</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                activeTab === 'scoring' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Có chỗ sửa điểm
            </span>
          </button>
        </div>

        {/* Tab 1: Ma Trận Đề Kiểm Tra */}
        {activeTab === 'matrix' && (
          <MatrixView exam={currentExam} onUpdateExam={setCurrentExam} />
        )}

        {/* Tab 2: Bản Đặc Tả Ma Trận */}
        {activeTab === 'specs' && (
          <SpecificationView exam={currentExam} onUpdateExam={setCurrentExam} />
        )}

        {/* Tab 3: Đề Kiểm Tra Chính Thức */}
        {activeTab === 'exam' && (
          <ExamPaperView exam={currentExam} onUpdateExam={setCurrentExam} />
        )}

        {/* Tab 4: Hướng Dẫn Chấm & Đáp Án */}
        {activeTab === 'scoring' && (
          <ScoringGuideView exam={currentExam} onUpdateExam={setCurrentExam} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC</strong> — Dành riêng cho giáo viên tiểu học.
          </div>
          <div>
            Đơn vị: <strong>UBND XÃ XÍN MẦN • TRƯỜNG PTDTBT TH CHÍ CÀ</strong> (Năm học 2026 - 2027)
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HeaderEditorModal
        header={currentExam.header}
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        onSave={newHeader => setCurrentExam({ ...currentExam, header: newHeader })}
      />

      <AIGenerateModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSuccess={newExam => {
          setCurrentExam(newExam);
          showToast('Đã tạo thành công bộ ma trận và đề kiểm tra bằng AI!');
        }}
      />

      <CurriculumGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
