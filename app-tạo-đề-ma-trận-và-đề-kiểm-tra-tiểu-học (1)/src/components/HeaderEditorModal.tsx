import React, { useState } from 'react';
import { ExamHeader, GradeLevel, SubjectType, ExamTerm } from '../types/exam';
import { X, Check, School, Calendar, Clock, Book } from 'lucide-react';

interface HeaderEditorModalProps {
  header: ExamHeader;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newHeader: ExamHeader) => void;
}

export const HeaderEditorModal: React.FC<HeaderEditorModalProps> = ({
  header,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExamHeader>({ ...header });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-50">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-base">
            <School className="w-5 h-5 text-emerald-700" />
            <span>Chỉnh sửa thông tin đơn vị & kì thi</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cơ quan chủ quản (UBND):</label>
              <input
                type="text"
                value={formData.governingBody}
                onChange={e => setFormData({ ...formData, governingBody: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="UBND XÃ XÍN MẦN"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên trường Tiểu học:</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="TRƯỜNG PTDTBT TH CHÍ CÀ"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học:</label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value as SubjectType })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Lịch sử và Địa lý">Lịch sử và Địa lý</option>
                <option value="Khoa học">Khoa học</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp:</label>
              <select
                value={formData.grade}
                onChange={e => setFormData({ ...formData, grade: e.target.value as GradeLevel })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kì kiểm tra định kì:</label>
              <select
                value={formData.term}
                onChange={e => setFormData({ ...formData, term: e.target.value as ExamTerm })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Giữa Học kì I">Giữa Học kì I</option>
                <option value="Cuối Học kì I">Cuối Học kì I</option>
                <option value="Giữa Học kì II">Giữa Học kì II</option>
                <option value="Cuối Năm học">Cuối Năm học</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Năm học:</label>
              <input
                type="text"
                value={formData.schoolYear}
                onChange={e => setFormData({ ...formData, schoolYear: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="2026 - 2027"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thời gian làm bài (phút):</label>
              <input
                type="number"
                min="15"
                max="90"
                value={formData.timeMinutes}
                onChange={e => setFormData({ ...formData, timeMinutes: parseInt(e.target.value) || 40 })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bộ sách giáo khoa:</label>
              <select
                value={formData.curriculumBook || 'Kết nối tri thức'}
                onChange={e => setFormData({ ...formData, curriculumBook: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="Kết nối tri thức">Kết nối tri thức với cuộc sống</option>
                <option value="Cánh diều">Cánh diều</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề đề thi hiển thị:</label>
            <input
              type="text"
              value={formData.examTitle}
              onChange={e => setFormData({ ...formData, examTitle: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
              placeholder="ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Lưu thông tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
