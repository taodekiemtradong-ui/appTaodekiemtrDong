/**
 * Types for Primary School Exam Matrix and Test Builder
 * Quy định chuẩn GDPT 2018 & Thông tư 27/2020/TT-BGDĐT
 */

export type SubjectType = 'Toán' | 'Tiếng Việt' | 'Lịch sử và Địa lý' | 'Khoa học';

export type GradeLevel = '1' | '2' | '3' | '4' | '5';

export type ExamTerm = 'Giữa Học kì I' | 'Cuối Học kì I' | 'Giữa Học kì II' | 'Cuối Năm học';

export type CognitiveLevel = 'Mức 1' | 'Mức 2' | 'Mức 3';

export type QuestionFormat = 'TN' | 'TL'; // Trắc nghiệm | Tự luận

export interface ExamHeader {
  governingBody: string; // UBND XÃ XÍN MẦN
  schoolName: string;    // TRƯỜNG PTDTBT TH CHÍ CÀ
  examTitle: string;     // ĐỀ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ I
  schoolYear: string;    // NĂM HỌC 2026 - 2027
  subject: SubjectType;  // TOÁN
  grade: GradeLevel;     // 4
  term: ExamTerm;
  timeMinutes: number;   // 40
  curriculumBook?: string; // Kết nối tri thức | Cánh diều | Chân trời sáng tạo
}

export interface MatrixStrand {
  id: string;
  name: string; // Mạch kiến thức: Số và phép tính, Hình học và đo lường, Yếu tố thống kê...
  targetPercentage?: number; // Tỉ lệ mục tiêu % (vd: 70%, 30%)
  
  // Mức 1
  m1_tn_count: number;
  m1_tn_points: number;
  m1_tl_count: number;
  m1_tl_points: number;

  // Mức 2
  m2_tn_count: number;
  m2_tn_points: number;
  m2_tl_count: number;
  m2_tl_points: number;

  // Mức 3
  m3_tn_count: number;
  m3_tn_points: number;
  m3_tl_count: number;
  m3_tl_points: number;

  total_points: number;
  percentage: number;
}

export interface MatrixSummary {
  m1_points: number;
  m1_percent: number;
  m2_points: number;
  m2_percent: number;
  m3_points: number;
  m3_percent: number;
  
  tn_points: number;
  tn_percent: number;
  tl_points: number;
  tl_percent: number;

  total_points: number;
}

export interface SpecificationItem {
  id: string;
  strand: string;           // Mạch kiến thức
  competency: string;       // Yêu cầu cần đạt
  questionNum: string;      // Câu 1, Câu 2...
  format: QuestionFormat;   // TN / TL
  level: CognitiveLevel;    // Mức 1, 2, 3
  points: number;           // Điểm số
  description: string;      // Mô tả câu hỏi / dạng bài
}

export interface GeometryGridConfig {
  type: 'grid_count' | 'grid_area' | 'grid_shape' | 'arithmetic_column' | 'none';
  gridSize?: { rows: number; cols: number; cellSize: number };
  shapeType?: 'triangle' | 'rectangle' | 'square' | 'parallelogram' | 'composite';
  points?: Array<{ x: number; y: number }>;
  caption?: string;
  unit?: string;
}

export interface ExamQuestion {
  id: string;
  number: number;
  part: QuestionFormat;       // TN | TL
  strand: string;            // Mạch kiến thức
  level: CognitiveLevel;     // Mức 1 | Mức 2 | Mức 3
  points: number;            // Có chỗ sửa điểm
  prompt: string;            // Nội dung câu hỏi
  subQuestions?: Array<{ label: string; prompt: string; points: number }>;
  options?: string[];        // Cho câu trắc nghiệm: ['A. ...', 'B. ...', 'C. ...', 'D. ...']
  correctOption?: string;    // 'A' | 'B' | 'C' | 'D'
  hasGrid?: boolean;         // Vẽ hình trên lưới ô vuông
  gridConfig?: GeometryGridConfig;
  workSpaceHeightLines?: number; // Số dòng kẻ ô ly cho học sinh làm bài
}

export interface ReadingPassage {
  title: string;
  author: string;
  genre?: 'Truyện, kịch bản' | 'Truyện' | 'Kịch' | 'Bài miêu tả' | 'Thơ' | 'Văn bản thông tin';
  wordCount: number;
  content: string;
  readingAloudPrompt?: {
    passageSnippet: string;
    question: string;
    points: number; // Mặc định 3.0 điểm
  };
}

export interface WritingSection {
  title: string;
  prompt: string;
  points: number; // Mặc định 10.0 điểm
  instructions: string;
  criteria: Array<{ name: string; maxPoints: number; note: string }>;
}

export interface ScoringItem {
  id: string;
  questionNumber: string;
  points: number; // Có chỗ sửa điểm
  answer: string;
  explanation: string;
  steps?: Array<{ step: string; points: number }>;
}

export interface FullExamData {
  id: string;
  createdAt: string;
  updatedAt: string;
  header: ExamHeader;
  matrix: {
    strands: MatrixStrand[];
    summary: MatrixSummary;
  };
  specifications: SpecificationItem[];
  readingPassage?: ReadingPassage;
  writingSection?: WritingSection;
  questions: ExamQuestion[];
  scoringGuide: ScoringItem[];
}
