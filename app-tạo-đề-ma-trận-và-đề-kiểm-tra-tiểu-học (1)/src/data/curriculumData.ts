/**
 * Chuẩn Chương trình GDPT 2018 & Quy định đánh giá học sinh Tiểu học (Thông tư 27/2020/TT-BGDĐT)
 * Dữ liệu chuẩn hóa tỷ lệ mạch kiến thức, số tiết, mức độ nhận thức, độ dài ngữ liệu.
 */

export interface MathCurriculumRatio {
  grade: string;
  term: string;
  totalPeriods: number;
  strands: Array<{
    name: string;
    ratio: number; // percentage
    periodRatioNote?: string;
  }>;
}

export const MATH_CURRICULUM_RATIOS: MathCurriculumRatio[] = [
  {
    grade: '1',
    term: 'Kì I',
    totalPeriods: 54,
    strands: [
      { name: 'Số và phép tính', ratio: 80, periodRatioNote: 'Khoảng 43/54 tiết (Số: 18t/52 = 3.5đ; 21/52 = 4.5đ)' },
      { name: 'Hình học và đo lường', ratio: 20, periodRatioNote: '11/54 tiết = 20,37% (2.0 điểm). Có vẽ/đếm trên lưới ô vuông' },
    ],
  },
  {
    grade: '1',
    term: 'Kì II',
    totalPeriods: 51,
    strands: [
      { name: 'Số và phép tính', ratio: 80, periodRatioNote: 'Cả năm: 105 tiết' },
      { name: 'Hình học và đo lường', ratio: 20, periodRatioNote: 'Cả năm: 29/105 = 27,61%' },
    ],
  },
  {
    grade: '2',
    term: 'Kì I',
    totalPeriods: 90,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'CKI: HH và ĐL = 28/90 = 31,1%' },
      { name: 'Hình học và đo lường', ratio: 30, periodRatioNote: '28/90 tiết' },
    ],
  },
  {
    grade: '2',
    term: 'Kì II',
    totalPeriods: 85,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'Cả năm: 175 tiết' },
      { name: 'Hình học và đo lường', ratio: 20, periodRatioNote: 'CN: 45/175 = 25,7%' },
      { name: 'Một số yếu tố thống kê và xác suất', ratio: 10, periodRatioNote: 'Thu thập, phân loại, biểu đồ tranh' },
    ],
  },
  {
    grade: '3',
    term: 'Kì I',
    totalPeriods: 90,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'CKI: HH và ĐL = 23/90 = 25,55%' },
      { name: 'Hình học và đo lường', ratio: 30, periodRatioNote: '23/90 tiết' },
    ],
  },
  {
    grade: '3',
    term: 'Kì II',
    totalPeriods: 85,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'Cả năm: 175 tiết' },
      { name: 'Hình học và đo lường', ratio: 20, periodRatioNote: 'CN: 45/175 = 25,7%' },
      { name: 'Một số yếu tố thống kê và xác suất', ratio: 10, periodRatioNote: 'Bảng số liệu thống kê, khả năng xảy ra của sự kiện' },
    ],
  },
  // LỚP 4
  {
    grade: '4',
    term: 'Giữa Học kì I',
    totalPeriods: 45,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'GKI: Số và phép tính chiếm 70% (khoảng 29/45 tiết)' },
      { name: 'Hình học và đo lường', ratio: 30, periodRatioNote: 'GKI: HH và ĐL = 16/45 = 35,55% (khoảng 3.0 điểm)' },
    ],
  },
  {
    grade: '4',
    term: 'Cuối Học kì I',
    totalPeriods: 90,
    strands: [
      { name: 'Số và phép tính', ratio: 50, periodRatioNote: 'CKI: Số và PT = 50% (5.0 điểm)' },
      { name: 'Hình học và đo lường', ratio: 50, periodRatioNote: 'CKI: HH và ĐL = 44/90 = 48,88% (5.0 điểm)' },
    ],
  },
  {
    grade: '4',
    term: 'Giữa Học kì II',
    totalPeriods: 135,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'GKII: Phân số và các phép tính (7.0 điểm)' },
      { name: 'Hình học và đo lường', ratio: 30, periodRatioNote: 'GKII: HH và ĐL = 44/135 = 32,59% (3.0 điểm)' },
    ],
  },
  {
    grade: '4',
    term: 'Cuối Năm học',
    totalPeriods: 175,
    strands: [
      { name: 'Số và phép tính', ratio: 70, periodRatioNote: 'CN: 7.0 điểm' },
      { name: 'Hình học và đo lường', ratio: 20, periodRatioNote: 'CN: HH và ĐL = 47/175 = 26,85% (2.0 điểm)' },
      { name: 'Một số yếu tố thống kê và xác suất', ratio: 10, periodRatioNote: 'Dãy số liệu, biểu đồ cột (1.0 điểm)' },
    ],
  },
  // LỚP 5
  {
    grade: '5',
    term: 'Giữa Học kì I',
    totalPeriods: 45,
    strands: [
      { name: 'Số và phép tính', ratio: 80, periodRatioNote: 'GKI: Số thập phân, phân số thập phân (8.0 điểm)' },
      { name: 'Hình học và đo lường', ratio: 20, periodRatioNote: 'GKI: HH và ĐL = 8/45 = 17,77% (2.0 điểm)' },
    ],
  },
  {
    grade: '5',
    term: 'Cuối Học kì I',
    totalPeriods: 90,
    strands: [
      { name: 'Số và phép tính', ratio: 60, periodRatioNote: 'CKI: Số thập phân và 4 phép tính (6.0 điểm)' },
      { name: 'Hình học và đo lường', ratio: 40, periodRatioNote: 'CKI: HH và ĐL = 34/90 = 37,77% (4.0 điểm, hình tam giác, hình thang)' },
    ],
  },
  {
    grade: '5',
    term: 'Giữa Học kì II',
    totalPeriods: 135,
    strands: [
      { name: 'Số và phép tính', ratio: 50, periodRatioNote: 'GKII: Tỉ số phần trăm, số đo thời gian, vận tốc (5.0 điểm)' },
      { name: 'Hình học và đo lường', ratio: 50, periodRatioNote: 'GKII: HH và ĐL = 75/135 = 55,55% (5.0 điểm, hình tròn, hình hộp CN, hình lập phương)' },
    ],
  },
  {
    grade: '5',
    term: 'Cuối Năm học',
    totalPeriods: 175,
    strands: [
      { name: 'Số và phép tính', ratio: 50, periodRatioNote: 'CN: Ôn tập tổng hợp (5.0 điểm)' },
      { name: 'Hình học và đo lường', ratio: 40, periodRatioNote: 'CN: HH và ĐL = 83/175 = 47,42% (4.0 điểm)' },
      { name: 'Một số yếu tố thống kê và xác suất', ratio: 10, periodRatioNote: 'Biểu đồ hình quạt tròn, xác suất (1.0 điểm)' },
    ],
  },
];

export interface VietnameseReadingStandard {
  grade: '4' | '5';
  genres: Array<{
    genre: string;
    wordRange: string;
    minWords: number;
    maxWords: number;
    description: string;
  }>;
  readingScoreStructure: {
    totalReadingScore: number; // 10.0
    readingAloud: number;      // 3.0 điểm
    readingComprehension: number; // 7.0 điểm
    totalQuestions: number;    // 11 câu
    textComprehension: {
      points: number;          // 4.0 điểm
      tnCount: number;         // 4 câu = 2.0 điểm
      tlCount: number;         // 2 câu = 2.0 điểm
    };
    vietnameseKnowledge: {
      points: number;          // 3.0 điểm
      tnCount: number;         // 4 câu = 2.0 điểm
      tlCount: number;         // 1 câu = 1.0 điểm
    };
    cognitiveDistribution: {
      m1Percent: number; // 40% (hoặc ~4đ)
      m2Percent: number; // 20% (hoặc ~2đ)
      m3Percent: number; // 10% (hoặc ~1đ)
    };
  };
  writingScoreStructure: {
    totalWritingScore: number; // 10.0 điểm
    essayOrParagraph: number;
    criteriaNote: string;
  };
}

export const VIETNAMESE_STANDARDS: Record<'4' | '5', VietnameseReadingStandard> = {
  '4': {
    grade: '4',
    genres: [
      { genre: 'Truyện, kịch bản', wordRange: '280 – 330 chữ', minWords: 280, maxWords: 330, description: 'Ngữ liệu ngoài chương trình học, có cốt truyện rõ ràng, giàu tính giáo dục' },
      { genre: 'Bài miêu tả', wordRange: '200 – 250 chữ', minWords: 200, maxWords: 250, description: 'Miêu tả cảnh đẹp thiên nhiên, cây cối, con vật, sinh hoạt' },
      { genre: 'Thơ', wordRange: '100 – 120 chữ', minWords: 100, maxWords: 120, description: 'Giàu hình ảnh, nhạc điệu, cảm xúc trong sáng' },
      { genre: 'Văn bản thông tin', wordRange: '150 – 180 chữ', minWords: 150, maxWords: 180, description: 'Giới thiệu di tích, hiện tượng tự nhiên, thói quen tốt' },
    ],
    readingScoreStructure: {
      totalReadingScore: 10.0,
      readingAloud: 3.0,
      readingComprehension: 7.0,
      totalQuestions: 11,
      textComprehension: {
        points: 4.0,
        tnCount: 4, // 4 * 0.5 = 2.0đ
        tlCount: 2, // 2 * 1.0 = 2.0đ
      },
      vietnameseKnowledge: {
        points: 3.0,
        tnCount: 4, // 4 * 0.5 = 2.0đ
        tlCount: 1, // 1 * 1.0 = 1.0đ
      },
      cognitiveDistribution: {
        m1Percent: 40,
        m2Percent: 20,
        m3Percent: 10,
      },
    },
    writingScoreStructure: {
      totalWritingScore: 10.0,
      essayOrParagraph: 10.0,
      criteriaNote: 'Nội dung (4đ), Cấu trúc mở-thân-kết (2đ), Dùng từ đặt câu (2đ), Sáng tạo và liên hệ (1đ), Chính tả và chữ viết (1đ)',
    },
  },
  '5': {
    grade: '5',
    genres: [
      { genre: 'Truyện, kịch bản', wordRange: '300 – 350 chữ', minWords: 300, maxWords: 350, description: 'Truyện ngắn hoặc trích đoạn kịch giàu giá trị nhân văn' },
      { genre: 'Bài miêu tả', wordRange: '200 – 250 chữ', minWords: 200, maxWords: 250, description: 'Miêu tả phong cảnh, người thân, đồ vật gắn bó' },
      { genre: 'Thơ', wordRange: '110 – 130 chữ', minWords: 110, maxWords: 130, description: 'Thơ trữ tình, thể hiện tình yêu quê hương, đất nước' },
      { genre: 'Văn bản thông tin', wordRange: 'khoảng 230 chữ', minWords: 210, maxWords: 250, description: 'Văn bản khoa học thường thức, bảo vệ môi trường' },
    ],
    readingScoreStructure: {
      totalReadingScore: 10.0,
      readingAloud: 3.0,
      readingComprehension: 7.0,
      totalQuestions: 11,
      textComprehension: {
        points: 4.0,
        tnCount: 4, // 2.0đ
        tlCount: 2, // 2.0đ
      },
      vietnameseKnowledge: {
        points: 3.0,
        tnCount: 4, // 2.0đ
        tlCount: 1, // 1.0đ
      },
      cognitiveDistribution: {
        m1Percent: 40,
        m2Percent: 20,
        m3Percent: 10,
      },
    },
    writingScoreStructure: {
      totalWritingScore: 10.0,
      essayOrParagraph: 10.0,
      criteriaNote: 'Bố cục bài văn (2đ), Nội dung miêu tả/bày tỏ tình cảm (4đ), Nghệ thuật so sánh, nhân hóa (2đ), Chính tả ngữ pháp (1đ), Sáng tạo cảm xúc (1đ)',
    },
  },
};

export const DEFAULT_HEADER_CONFIG = {
  governingBody: 'UBND XÃ XÍN MẦN',
  schoolName: 'TRƯỜNG PTDTBT TH CHÍ CÀ',
  schoolYear: '2026 - 2027',
};
