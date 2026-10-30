import React, { useState } from 'react';
import { SubjectType, GradeLevel, ExamTerm, FullExamData } from '../types/exam';
import { Sparkles, X, Loader2, BookOpen, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (generatedExam: FullExamData) => void;
}

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [subject, setSubject] = useState<SubjectType>('Toán');
  const [grade, setGrade] = useState<GradeLevel>('4');
  const [term, setTerm] = useState<ExamTerm>('Giữa Học kì I');
  const [curriculumBook, setCurriculumBook] = useState('Kết nối tri thức');
  const [customNote, setCustomNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: 'TRƯỜNG PTDTBT TH CHÍ CÀ',
          governingBody: 'UBND XÃ XÍN MẦN',
          subject,
          grade,
          term,
          schoolYear: '2026 - 2027',
          timeMinutes: subject === 'Toán' || subject === 'Tiếng Việt' ? 40 : 35,
          curriculumBook,
          customNote,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Không thể tạo đề kiểm tra lúc này.');
      }

      // Format response to full exam data
      const fullExam: FullExamData = {
        id: `ai-exam-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        header: {
          governingBody: data.header?.governingBody || 'UBND XÃ XÍN MẦN',
          schoolName: data.header?.schoolName || 'TRƯỜNG PTDTBT TH CHÍ CÀ',
          examTitle: data.header?.examTitle || `ĐỀ KIỂM TRA ĐỊNH KÌ ${term.toUpperCase()}`,
          schoolYear: data.header?.schoolYear || '2026 - 2027',
          subject,
          grade,
          term,
          timeMinutes: data.header?.timeMinutes || 40,
          curriculumBook,
        },
        matrix: data.matrix || {
          strands: [],
          summary: {
            m1_points: 5.0,
            m1_percent: 50,
            m2_points: 3.0,
            m2_percent: 30,
            m3_points: 2.0,
            m3_percent: 20,
            tn_points: 6.0,
            tn_percent: 60,
            tl_points: 4.0,
            tl_percent: 40,
            total_points: 10.0,
          },
        },
        specifications: data.specifications || [],
        readingPassage: data.readingPassage,
        writingSection: data.writingSection,
        questions: (data.questions || []).map((q: any, idx: number) => ({
          ...q,
          number: idx + 1,
          points: Number(q.points) || (q.part === 'TN' ? 0.5 : 1.0),
        })),
        scoringGuide: data.scoringGuide || [],
      };

      onSuccess(fullExam);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối khi sinh đề kiểm tra với AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Tạo Ma Trận & Đề Kiểm Tra bằng AI (Gemini)</span>
          </div>
          {!loading && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleGenerate} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Đã xảy ra lỗi:</span>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn kiểm tra:</label>
              <select
                value={subject}
                disabled={loading}
                onChange={e => setSubject(e.target.value as SubjectType)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Toán">Toán học</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Lịch sử và Địa lý">Lịch sử và Địa lý</option>
                <option value="Khoa học">Khoa học</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
              <select
                value={grade}
                disabled={loading}
                onChange={e => setGrade(e.target.value as GradeLevel)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="1">Lớp 1</option>
                <option value="2">Lớp 2</option>
                <option value="3">Lớp 3</option>
                <option value="4">Lớp 4</option>
                <option value="5">Lớp 5</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kì kiểm tra:</label>
              <select
                value={term}
                disabled={loading}
                onChange={e => setTerm(e.target.value as ExamTerm)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Giữa Học kì I">Giữa Học kì I</option>
                <option value="Cuối Học kì I">Cuối Học kì I</option>
                <option value="Giữa Học kì II">Giữa Học kì II</option>
                <option value="Cuối Năm học">Cuối Năm học</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bộ sách giáo khoa:</label>
              <select
                value={curriculumBook}
                disabled={loading}
                onChange={e => setCurriculumBook(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Kết nối tri thức">Kết nối tri thức với cuộc sống</option>
                <option value="Cánh diều">Cánh diều</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ghi chú thêm của giáo viên (tùy chọn):
            </label>
            <textarea
              value={customNote}
              disabled={loading}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="Ví dụ: Đề toán có bài toán giải gắn với xã Xín Mần, bài đọc Tiếng Việt về tinh thần vượt khó của học sinh vùng cao..."
              rows={3}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1 text-[11px]">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Cam kết chuẩn quy định GDPT 2018:
            </div>
            <div>• Tỉ lệ nhận thức 3 mức độ: Mức 1 (50%) - Mức 2 (30%) - Mức 3 (20%)</div>
            <div>• Tỉ lệ hình thức: Trắc nghiệm 60% (6.0đ) - Tự luận 40% (4.0đ)</div>
            <div>• Môn Tiếng Việt: Đọc hiểu 7đ (11 câu chuẩn tỉ lệ), bài đọc đúng số từ, viết 10đ</div>
            <div>• Đủ 4 bộ thành phần: Ma trận, Đặc tả, Đề kiểm tra và Hướng dẫn chấm có chỗ sửa điểm.</div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-bold shadow-md cursor-pointer transition active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo bộ đề chuẩn...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo ngay với AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
