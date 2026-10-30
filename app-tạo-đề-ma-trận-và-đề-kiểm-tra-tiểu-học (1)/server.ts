import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini generation API endpoint
app.post('/api/gemini/generate-exam', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trong hệ thống. Vui lòng kiểm tra lại cấu hình.',
      });
    }

    const {
      schoolName = 'TRƯỜNG PTDTBT TH CHÍ CÀ',
      governingBody = 'UBND XÃ XÍN MẦN',
      grade = '4',
      subject = 'Toán',
      term = 'Giữa Học kì I',
      schoolYear = '2026 - 2027',
      timeMinutes = 40,
      customNote = '',
      curriculumBook = 'Kết nối tri thức',
    } = req.body;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemPrompt = `Bạn là Chuyên gia ra đề kiểm tra, xây dựng ma trận và đánh giá học sinh Tiểu học theo Chương trình Giáo dục phổ thông (GDPT) 2018 và Thông tư 27/2020/TT-BGDĐT.
Bạn am hiểu sâu sắc cơ cấu điểm 10 điểm, tỉ lệ nhận thức 3 mức độ (Mức 1: Nhận biết [khoảng 50%], Mức 2: Kết nối/Hiểu [khoảng 30%], Mức 3: Vận dụng [khoảng 20%]), tỉ lệ Trắc nghiệm (TN: 60% = 6.0 điểm) và Tự luận (TL: 40% = 4.0 điểm).

QUY ĐỊNH ĐẶC THÙ THEO MÔN:
1. MÔN TOÁN:
- Vẽ hình trên lưới ô vuông (tính diện tích, chu vi, đếm hình tam giác/tứ giác, hình chữ nhật).
- Phép tính đặt tính rồi tính hoặc tìm x hoặc giải toán có lời văn.
- Tỉ lệ mạch kiến thức theo đúng khối lớp và kì:
  * Lớp 1: Số & phép tính 80%, Hình học & đo lường 20%.
  * Lớp 2, 3: Kỳ I (Số & PT 70%, HH&ĐL 30%); Kỳ II (Số & PT 70%, HH&ĐL 20%, Thống kê & XS 10%).
  * Lớp 4: GKI (Số 70%, HH&ĐL 30%); CKI (Số 50%, HH&ĐL 50%); GKII (Số 70%, HH&ĐL 30%); CN (Số 70%, HH&ĐL 20%, TK&XS 10%).
  * Lớp 5: GKI (Số 80%, HH&ĐL 20%); CKI (Số 60%, HH&ĐL 40%); GKII (Số 50%, HH&ĐL 50%); CN (Số 50%, HH&ĐL 40%, TK&XS 10%).

2. MÔN TIẾNG VIỆT:
- Lớp 4: Ngữ liệu ngoài SGK. Truyện/kịch 280-330 từ; miêu tả 200-250 từ; thơ 100-120 từ; văn bản thông tin 150-180 từ.
- Lớp 5: Truyện/kịch 300-350 từ; miêu tả 200-250 từ; thơ 110-130 từ; văn bản thông tin ~230 từ.
- Cấu trúc Đọc hiểu 7 điểm: 11 câu.
  * Đọc hiểu văn bản 4 điểm: 4 câu TN (2đ) + 2 câu TL (2đ).
  * Kiến thức tiếng Việt 3 điểm: 4 câu TN (2đ) + 1 câu TL (1đ).
- Phần Đọc thành tiếng: 3 điểm (Gợi ý đoạn đọc và câu hỏi phụ).
- Phần Viết: 10 điểm (Chính tả / Tập làm văn miêu tả hoặc viết đoạn văn theo chủ đề kì học).

3. MÔN LỊCH SỬ & ĐỊA LÝ / KHOA HỌC:
- Lớp 4, 5: Mức 1-3 (50-30-20%), TN = 60%, TL = 40%.

Hãy xuất ra DUY NHẤT một chuỗi JSON hợp lệ (không kèm markdown ngoài JSON hoặc dùng JSON format sạch) với cấu trúc sau:
{
  "header": {
    "governingBody": "${governingBody}",
    "schoolName": "${schoolName}",
    "examTitle": "ĐỀ KIỂM TRA ĐỊNH KÌ ${term.toUpperCase()}",
    "schoolYear": "${schoolYear}",
    "subject": "${subject}",
    "grade": "${grade}",
    "term": "${term}",
    "timeMinutes": ${timeMinutes}
  },
  "matrix": {
    "strands": [
      {
        "name": "Số và phép tính",
        "m1_tn_count": 3, "m1_tn_points": 1.5,
        "m1_tl_count": 0, "m1_tl_points": 0,
        "m2_tn_count": 2, "m2_tn_points": 1.0,
        "m2_tl_count": 1, "m2_tl_points": 1.5,
        "m3_tn_count": 0, "m3_tn_points": 0,
        "m3_tl_count": 1, "m3_tl_points": 1.0,
        "total_points": 5.0,
        "percentage": 50
      }
    ],
    "summary": {
      "m1_points": 5.0, "m1_percent": 50,
      "m2_points": 3.0, "m2_percent": 30,
      "m3_points": 2.0, "m3_percent": 20,
      "tn_points": 6.0, "tn_percent": 60,
      "tl_points": 4.0, "tl_percent": 40,
      "total_points": 10.0
    }
  },
  "specifications": [
    {
      "strand": "Số và phép tính",
      "competency": "Yêu cầu cần đạt",
      "questionNum": "Câu 1",
      "format": "TN",
      "level": "Mức 1",
      "points": 0.5,
      "description": "Nhận biết được..."
    }
  ],
  "readingPassage": {
    "title": "Tên bài đọc (nếu là môn Tiếng Việt)",
    "author": "Tác giả",
    "wordCount": 310,
    "content": "Nội dung bài đọc..."
  },
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "part": "TN",
      "strand": "Số và phép tính",
      "level": "Mức 1",
      "points": 0.5,
      "prompt": "Câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctOption": "A",
      "hasGrid": false,
      "gridType": "none"
    }
  ],
  "writingSection": {
    "prompt": "Đề bài tập làm văn / viết đoạn văn (cho môn Tiếng Việt)",
    "points": 10.0,
    "instructions": "Hướng dẫn viết và tiêu chí chấm chi tiết..."
  },
  "scoringGuide": [
    {
      "questionNumber": "Câu 1",
      "points": 0.5,
      "answer": "Đáp án A",
      "explanation": "Chi tiết bước tính hoặc tiêu chí chấm..."
    }
  ]
}`;

    const userPrompt = `Hãy tạo một đề kiểm tra hoàn chỉnh cho:
- Môn học: ${subject}
- Khối lớp: Lớp ${grade}
- Kì kiểm tra: ${term}
- Năm học: ${schoolYear}
- Thời gian làm bài: ${timeMinutes} phút
- Đơn vị: ${governingBody} - ${schoolName}
- Bộ sách: ${curriculumBook}
- Ghi chú giáo viên: ${customNote || 'Theo chuẩn ma trận quy định GDPT 2018'}.

Đảm bảo:
- Tổng điểm các câu trên đề = 10.0 điểm.
- Đủ 4 thành phần: Ma trận phân bố chuẩn (50-30-20, 60-40), Bản đặc tả chi tiết, Đề thi chuẩn (trắc nghiệm và tự luận có hướng dẫn dòng kẻ hoặc lưới ô vuông nếu là toán hình), và Hướng dẫn chấm kèm biểu điểm chi tiết (có chỗ sửa điểm linh hoạt).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);
    return res.json(jsonResult);
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    return res.status(500).json({
      error: error.message || 'Lỗi xử lý khi tạo đề thi với AI. Vui lòng thử lại.',
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Exam Builder Server listening on port ${PORT}`);
  });
}

startServer();
