import React from 'react';
import { X, BookMarked, Calculator, BookOpen, Clock, Compass, FlaskConical } from 'lucide-react';

interface CurriculumGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurriculumGuideModal: React.FC<CurriculumGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-800 text-white">
          <div className="flex items-center gap-2 font-bold text-base">
            <BookMarked className="w-5 h-5 text-emerald-400" />
            <span>Sổ Tay Quy Định Ra Đề GDPT 2018 & Thông Tư 27</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* I. MÔN TOÁN */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-800 uppercase flex items-center gap-1.5 border-b border-emerald-200 pb-1">
              <Calculator className="w-4 h-4 text-emerald-600" />
              I. MÔN TOÁN (Lớp 1 đến Lớp 5)
            </h3>

            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 space-y-1">
              <div><strong>• Tỉ lệ 3 mức độ nhận thức:</strong> Mức 1 (50%) — Mức 2 (30%) — Mức 3 (20%).</div>
              <div><strong>• Tỉ lệ hình thức:</strong> Trắc nghiệm khách quan = 60% (6.0 điểm); Tự luận = 40% (4.0 điểm).</div>
              <div><strong>• Quy định vẽ hình:</strong> Có bài toán vẽ hình, đếm hình, tính diện tích trên <strong>lưới ô vuông</strong> (Lớp 1 - 5).</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">Lớp 1:</span>
                <p className="mt-1">
                  - Kỳ I: Số và Phép tính = 80%; Hình học và Đo lường = 20% (11/54 tiết = 20,37%).
                  <br />
                  - Kỳ II / Cả năm: Số và PT = 80%; HH và ĐL = 20% (29/105 tiết = 27,61%).
                  <br />
                  - Tập huấn: Số = 18t/52 = 3.5đ; 21/52 = 4.5đ; HH & ĐL = 11/52 = 2.0đ.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">Lớp 2, Lớp 3:</span>
                <p className="mt-1">
                  - Kỳ I: Số và PT = 70%; Hình học và đo lường = 30%.
                  <br />
                  - Kỳ II: Số và PT = 70%; HH và ĐL = 20%; Yếu tố thống kê và xác suất = 10%.
                  <br />
                  - Lớp 2 (CKI: HH&ĐL = 28/90 = 31,1%; CN: 45/175 = 25,7%).
                  <br />
                  - Lớp 3 (CKI: HH&ĐL = 23/90 = 25,55%; CN: 45/175 = 25,7%).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">Lớp 4:</span>
                <p className="mt-1">
                  - Giữa Kì I (GKI): Số và PT = 70%; HH & ĐL = 30% (HH&ĐL = 16/45 = 35,55%).
                  <br />
                  - Cuối Kì I (CKI): Số và PT = 50%; HH & ĐL = 50% (HH&ĐL = 44/90 = 48,88%).
                  <br />
                  - Giữa Kì II (GKII): Số và PT = 70%; HH & ĐL = 30% (HH&ĐL = 44/135 = 32,59%).
                  <br />
                  - Cuối Năm (CN): Số và PT = 70%; HH & ĐL = 20%; Thống kê & XS = 10% (HH&ĐL = 47/175 = 26,85%).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">Lớp 5:</span>
                <p className="mt-1">
                  - Giữa Kì I (GKI): Số và PT = 80%; HH & ĐL = 20% (HH&ĐL = 8/45 = 17,77%).
                  <br />
                  - Cuối Kì I (CKI): Số và PT = 60%; HH & ĐL = 40% (HH&ĐL = 34/90 = 37,77%).
                  <br />
                  - Giữa Kì II (GKII): Số và PT = 50%; HH & ĐL = 50% (HH&ĐL = 75/135 = 55,55%).
                  <br />
                  - Cuối Năm (CN): Số và PT = 50%; HH & ĐL = 40%; Thống kê & XS = 10% (HH&ĐL = 83/175 = 47,42%).
                </p>
              </div>
            </div>

            {/* Bảng thời lượng thực hiện chương trình GDPT 2018 */}
            <div className="border border-slate-300 rounded-lg overflow-hidden mt-3">
              <div className="bg-slate-100 p-2 font-bold text-slate-800 text-center">
                Ước lượng thời gian (%) cho các mạch nội dung theo Chương trình GDPT 2018
              </div>
              <table className="w-full text-center divide-y divide-slate-200 text-[11px]">
                <thead className="bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 text-left">Cấp học / Lớp</th>
                    <th className="p-2">Số & Phép tính</th>
                    <th className="p-2">Hình học & Đo lường</th>
                    <th className="p-2">Thống kê & Xác suất</th>
                    <th className="p-2">Thực hành, trải nghiệm</th>
                    <th className="p-2">Tổng số tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 text-left font-medium">Lớp 1</td>
                    <td className="p-2">80%</td>
                    <td className="p-2">15%</td>
                    <td className="p-2">0%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2 font-bold">105 tiết</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left font-medium">Lớp 2</td>
                    <td className="p-2">75%</td>
                    <td className="p-2">17%</td>
                    <td className="p-2">3%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2 font-bold">175 tiết</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left font-medium">Lớp 3</td>
                    <td className="p-2">70%</td>
                    <td className="p-2">22%</td>
                    <td className="p-2">3%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2 font-bold">175 tiết</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left font-medium">Lớp 4</td>
                    <td className="p-2">75%</td>
                    <td className="p-2">16%</td>
                    <td className="p-2">4%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2 font-bold">175 tiết</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left font-medium">Lớp 5</td>
                    <td className="p-2">50%</td>
                    <td className="p-2">40%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2 font-bold">175 tiết</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold">
                    <td className="p-2 text-left">Toàn cấp Tiểu học</td>
                    <td className="p-2">69%</td>
                    <td className="p-2">23%</td>
                    <td className="p-2">3%</td>
                    <td className="p-2">5%</td>
                    <td className="p-2">805 tiết</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* II. MÔN TIẾNG VIỆT */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-sm font-bold text-sky-800 uppercase flex items-center gap-1.5 border-b border-sky-200 pb-1">
              <BookOpen className="w-4 h-4 text-sky-600" />
              II. MÔN TIẾNG VIỆT (Lớp 4 & Lớp 5)
            </h3>

            <div className="bg-sky-50/50 p-3 rounded-lg border border-sky-200 space-y-1.5">
              <div><strong>• Bài Đọc:</strong> Đọc thành tiếng = 3.0 điểm; Đọc hiểu = 7.0 điểm (Ngữ liệu ngoài SGK).</div>
              <div><strong>• Bài Viết:</strong> Viết đoạn văn / bài văn = 10.0 điểm.</div>
              <div><strong>• Cấu trúc phần Đọc hiểu (11 câu = 7.0 điểm, Mức 1 - 3 khoảng 40% - 20% - 10%):</strong></div>
              <div className="pl-3 space-y-0.5">
                <div>+ Đọc hiểu văn bản: 4.0 điểm (TN 4 câu = 2.0đ; Tự luận 2 câu = 2.0đ).</div>
                <div>+ Kiến thức tiếng Việt: 3.0 điểm (TN 4 câu = 2.0đ; Tự luận 1 câu = 1.0đ).</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">Độ dài văn bản đọc Lớp 4:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Truyện, kịch bản: <strong>khoảng 280 – 330 chữ</strong>.</li>
                  <li>Bài miêu tả: <strong>khoảng 200 – 250 chữ</strong>.</li>
                  <li>Thơ: <strong>khoảng 100 – 120 chữ</strong>.</li>
                  <li>Văn bản thông tin: <strong>khoảng 150 – 180 chữ</strong>.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">Độ dài văn bản đọc Lớp 5:</span>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Truyện, kịch bản: <strong>khoảng 300 – 350 chữ</strong>.</li>
                  <li>Bài miêu tả: <strong>khoảng 200 – 250 chữ</strong>.</li>
                  <li>Thơ: <strong>khoảng 110 – 130 chữ</strong>.</li>
                  <li>Văn bản thông tin: <strong>khoảng 230 chữ</strong>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* III. LỊCH SỬ - ĐỊA LÝ & KHOA HỌC */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="text-sm font-bold text-purple-800 uppercase flex items-center gap-1.5 border-b border-purple-200 pb-1">
              <Compass className="w-4 h-4 text-purple-600" />
              III. MÔN LỊCH SỬ & ĐỊA LÝ - MÔN KHOA HỌC (Lớp 4 & 5)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200">
                <span className="font-bold text-purple-900">Môn Lịch sử & Địa lý:</span>
                <p className="mt-1">
                  - Mức 1 - 3: Tỉ lệ 50% – 30% – 20%.
                  <br />
                  - Tỉ lệ hình thức: Trắc nghiệm = 60% (6.0đ); Tự luận = 40% (4.0đ).
                  <br />
                  - Phân bổ 50% Lịch sử - 50% Địa lý hoặc theo chủ đề bài học.
                </p>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900">Môn Khoa học:</span>
                <p className="mt-1">
                  - Mức 1 - 3: Tỉ lệ 50% – 30% – 20%.
                  <br />
                  - Tỉ lệ hình thức: Trắc nghiệm = 60% (6.0đ); Tự luận = 40% (4.0đ).
                  <br />
                  - Gắn với thực hành, thí nghiệm, bảo vệ sức khỏe và môi trường.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg"
          >
            Đã hiểu quy chuẩn
          </button>
        </div>
      </div>
    </div>
  );
};
