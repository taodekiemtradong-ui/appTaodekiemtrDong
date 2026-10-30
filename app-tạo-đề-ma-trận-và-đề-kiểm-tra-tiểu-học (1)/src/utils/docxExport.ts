import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Packer,
} from 'docx';
import saveAs from 'file-saver';
import { FullExamData } from '../types/exam';

export async function exportExamToDocx(exam: FullExamData, exportType: 'full' | 'exam_only' | 'matrix_only' | 'scoring_only' = 'full') {
  const { header, matrix, specifications, questions, scoringGuide, readingPassage, writingSection } = exam;

  const fontStandard = 'Times New Roman';

  // Common borders
  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const children: any[] = [];

  // Helper to create bold paragraph
  const makeBoldP = (text: string, alignment: any = AlignmentType.CENTER, size = 20) =>
    new Paragraph({
      alignment,
      children: [new TextRun({ text, bold: true, font: fontStandard, size })],
    });

  // Helper to create regular paragraph
  const makeP = (text: string, alignment: any = AlignmentType.LEFT, size = 20) =>
    new Paragraph({
      alignment,
      children: [new TextRun({ text, font: fontStandard, size })],
    });

  // Header Table for official exam
  const schoolHeaderTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: header.governingBody.toUpperCase(), font: fontStandard, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: header.schoolName.toUpperCase(), bold: true, font: fontStandard, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: '-----------------------', font: fontStandard, size: 18 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, font: fontStandard, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', bold: true, font: fontStandard, size: 22 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: '-----------------------', font: fontStandard, size: 18 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 1. ADD EXAM PAPER (ĐỀ KIỂM TRA)
  if (exportType === 'full' || exportType === 'exam_only') {
    children.push(schoolHeaderTable);
    children.push(new Paragraph({ text: '', spacing: { after: 120 } }));

    // Exam Title
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${header.examTitle} - NĂM HỌC ${header.schoolYear}`,
            bold: true,
            font: fontStandard,
            size: 26,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `MÔN: ${header.subject.toUpperCase()} - LỚP ${header.grade}`,
            bold: true,
            font: fontStandard,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `(Thời gian làm bài: ${header.timeMinutes} phút - Không kể thời gian giao đề)`,
            italics: true,
            font: fontStandard,
            size: 22,
          }),
        ],
        spacing: { after: 180 },
      })
    );

    // Student Info & Score Box Table
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: thinBorder,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Họ và tên học sinh: ..............................................................', font: fontStandard, size: 22 }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: `Lớp: ${header.grade}.....  Trường: ${header.schoolName}`, font: fontStandard, size: 22 }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: 'ĐIỂM SỐ & LỜI NHẬN XÉT CỦA GIÁO VIÊN', bold: true, font: fontStandard, size: 20 }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Điểm bằng số: ..........  Điểm bằng chữ: .................', font: fontStandard, size: 20 }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Nhận xét: ................................................................', italics: true, font: fontStandard, size: 20 }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({ text: '', spacing: { after: 200 } })
    );

    // Reading Passage if Subject is Vietnamese
    if (readingPassage && readingPassage.content) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'A. BÀI ĐỌC KIỂM TRA (Ngữ liệu đọc hiểu):', bold: true, font: fontStandard, size: 24 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: readingPassage.title.toUpperCase(), bold: true, font: fontStandard, size: 24 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: `(Tác giả: ${readingPassage.author} - Độ dài: ${readingPassage.wordCount} chữ)`, italics: true, font: fontStandard, size: 20 }),
          ],
          spacing: { after: 120 },
        }),
        ...readingPassage.content.split('\n\n').map(p =>
          new Paragraph({
            children: [new TextRun({ text: `    ${p}`, font: fontStandard, size: 22 })],
            spacing: { line: 280, after: 100 },
          })
        ),
        new Paragraph({ text: '', spacing: { after: 160 } })
      );

      if (readingPassage.readingAloudPrompt) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'I. ĐỌC THÀNH TIẾNG (3,0 điểm): ', bold: true, font: fontStandard, size: 22 }),
              new TextRun({ text: readingPassage.readingAloudPrompt.passageSnippet, italics: true, font: fontStandard, size: 22 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Câu hỏi phụ: ${readingPassage.readingAloudPrompt.question}`, font: fontStandard, size: 22 }),
            ],
            spacing: { after: 160 },
          })
        );
      }
    }

    // Questions Section
    const tnQuestions = questions.filter(q => q.part === 'TN');
    const tlQuestions = questions.filter(q => q.part === 'TL');

    if (tnQuestions.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `PHẦN I. TRẮC NGHIỆM (${tnQuestions.reduce((s, q) => s + q.points, 0).toFixed(1)} điểm)`,
              bold: true,
              font: fontStandard,
              size: 24,
            }),
          ],
          spacing: { before: 120, after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Khoanh tròn vào chữ cái (A, B, C hoặc D) trước câu trả lời đúng nhất:',
              italics: true,
              font: fontStandard,
              size: 22,
            }),
          ],
          spacing: { after: 120 },
        })
      );

      tnQuestions.forEach(q => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: fontStandard, size: 22 }),
              new TextRun({ text: q.prompt, font: fontStandard, size: 22 }),
            ],
            spacing: { before: 100, after: 60 },
          })
        );

        if (q.options && q.options.length > 0) {
          q.options.forEach(opt => {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: `    ${opt}`, font: fontStandard, size: 22 })],
                spacing: { after: 40 },
              })
            );
          });
        }
      });
    }

    if (tlQuestions.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `PHẦN II. TỰ LUẬN (${tlQuestions.reduce((s, q) => s + q.points, 0).toFixed(1)} điểm)`,
              bold: true,
              font: fontStandard,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 120 },
        })
      );

      tlQuestions.forEach(q => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Câu ${q.number} (${q.points} điểm): `, bold: true, font: fontStandard, size: 22 }),
              new TextRun({ text: q.prompt, font: fontStandard, size: 22 }),
            ],
            spacing: { before: 100, after: 60 },
          })
        );

        if (q.hasGrid) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Học sinh thực hiện vẽ hình hoặc đặt tính trên lưới ô vuông kiểm tra - ${q.gridConfig?.caption || 'Lưới ô vuông'}]`,
                  italics: true,
                  font: fontStandard,
                  size: 20,
                  color: '666666',
                }),
              ],
              spacing: { after: 60 },
            })
          );
        }

        // Draw dotted lines for essay writing
        const linesCount = q.workSpaceHeightLines || 4;
        for (let i = 0; i < linesCount; i++) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: '........................................................................................................................................................................',
                  color: '888888',
                  font: fontStandard,
                  size: 20,
                }),
              ],
              spacing: { line: 260 },
            })
          );
        }
      });
    }

    // Writing section if Vietnamese
    if (writingSection) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: writingSection.title, bold: true, font: fontStandard, size: 24 }),
          ],
          spacing: { before: 240, after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: writingSection.prompt, bold: true, font: fontStandard, size: 22 }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `(${writingSection.instructions})`, italics: true, font: fontStandard, size: 20 }),
          ],
          spacing: { after: 120 },
        })
      );

      for (let i = 0; i < 12; i++) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '........................................................................................................................................................................',
                color: '888888',
                font: fontStandard,
                size: 20,
              }),
            ],
            spacing: { line: 260 },
          })
        );
      }
    }
  }

  // 2. ADD MATRIX TABLE (MA TRẬN ĐỀ KIỂM TRA)
  if (exportType === 'full' || exportType === 'matrix_only') {
    children.push(
      new Paragraph({
        text: '',
        spacing: { before: 240 },
        pageBreakBefore: exportType === 'full',
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ MÔN ${header.subject.toUpperCase()} LỚP ${header.grade}`,
            bold: true,
            font: fontStandard,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${header.examTitle} - NĂM HỌC ${header.schoolYear} (Theo chuẩn GDPT 2018)`,
            italics: true,
            font: fontStandard,
            size: 22,
          }),
        ],
        spacing: { after: 160 },
      })
    );

    // Matrix Table Header & Rows
    const matrixRows = [
      new TableRow({
        children: [
          new TableCell({ children: [makeBoldP('Mạch kiến thức / Kĩ năng')], width: { size: 30, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Mức 1 (Nhận biết)')], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Mức 2 (Kết nối/Hiểu)')], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Mức 3 (Vận dụng)')], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Tổng điểm')], width: { size: 10, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...matrix.strands.map(s =>
        new TableRow({
          children: [
            new TableCell({ children: [makeP(s.name)] }),
            new TableCell({ children: [makeP(`TN: ${s.m1_tn_count} câu (${s.m1_tn_points}đ)\nTL: ${s.m1_tl_count} câu (${s.m1_tl_points}đ)`)] }),
            new TableCell({ children: [makeP(`TN: ${s.m2_tn_count} câu (${s.m2_tn_points}đ)\nTL: ${s.m2_tl_count} câu (${s.m2_tl_points}đ)`)] }),
            new TableCell({ children: [makeP(`TN: ${s.m3_tn_count} câu (${s.m3_tn_points}đ)\nTL: ${s.m3_tl_count} câu (${s.m3_tl_points}đ)`)] }),
            new TableCell({ children: [makeBoldP(`${s.total_points.toFixed(1)}đ (${s.percentage}%)`, AlignmentType.CENTER)] }),
          ],
        })
      ),
      new TableRow({
        children: [
          new TableCell({ children: [makeBoldP('TỔNG CỘNG')] }),
          new TableCell({ children: [makeBoldP(`${matrix.summary.m1_points} điểm (${matrix.summary.m1_percent}%)`)] }),
          new TableCell({ children: [makeBoldP(`${matrix.summary.m2_points} điểm (${matrix.summary.m2_percent}%)`)] }),
          new TableCell({ children: [makeBoldP(`${matrix.summary.m3_points} điểm (${matrix.summary.m3_percent}%)`)] }),
          new TableCell({ children: [makeBoldP(`${matrix.summary.total_points} điểm (100%)`)] }),
        ],
      }),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: thinBorder,
        rows: matrixRows,
      }),
      new Paragraph({ text: '', spacing: { after: 200 } })
    );

    // Specification Table
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `BẢN ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ`,
            bold: true,
            font: fontStandard,
            size: 24,
          }),
        ],
        spacing: { before: 160, after: 120 },
      })
    );

    const specRows = [
      new TableRow({
        children: [
          new TableCell({ children: [makeBoldP('STT / Câu')], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Mạch kiến thức')], width: { size: 25, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Yêu cầu cần đạt')], width: { size: 40, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Mức độ')], width: { size: 10, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Điểm')], width: { size: 10, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...specifications.map(sp =>
        new TableRow({
          children: [
            new TableCell({ children: [makeP(`${sp.questionNum} (${sp.format})`, AlignmentType.CENTER)] }),
            new TableCell({ children: [makeP(sp.strand)] }),
            new TableCell({ children: [makeP(`${sp.competency}\n- ${sp.description}`)] }),
            new TableCell({ children: [makeP(sp.level, AlignmentType.CENTER)] }),
            new TableCell({ children: [makeBoldP(`${sp.points}đ`, AlignmentType.CENTER)] }),
          ],
        })
      ),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: thinBorder,
        rows: specRows,
      }),
      new Paragraph({ text: '', spacing: { after: 200 } })
    );
  }

  // 3. ADD SCORING GUIDE (HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN)
  if (exportType === 'full' || exportType === 'scoring_only') {
    children.push(
      new Paragraph({
        text: '',
        spacing: { before: 240 },
        pageBreakBefore: exportType === 'full',
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT`,
            bold: true,
            font: fontStandard,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `MÔN: ${header.subject.toUpperCase()} - LỚP ${header.grade} (${header.examTitle})`,
            italics: true,
            font: fontStandard,
            size: 22,
          }),
        ],
        spacing: { after: 160 },
      })
    );

    const scoreRows = [
      new TableRow({
        children: [
          new TableCell({ children: [makeBoldP('Câu số')], width: { size: 15, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Đáp án chuẩn')], width: { size: 30, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Hướng dẫn chấm & Tiêu chí')], width: { size: 45, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [makeBoldP('Biểu điểm')], width: { size: 10, type: WidthType.PERCENTAGE } }),
        ],
      }),
      ...scoringGuide.map(sc =>
        new TableRow({
          children: [
            new TableCell({ children: [makeBoldP(sc.questionNumber, AlignmentType.CENTER)] }),
            new TableCell({ children: [makeP(sc.answer)] }),
            new TableCell({ children: [makeP(`${sc.explanation}${sc.steps ? '\n' + sc.steps.map(s => `• ${s.step}: ${s.points}đ`).join('\n') : ''}`)] }),
            new TableCell({ children: [makeBoldP(`${sc.points}đ`, AlignmentType.CENTER)] }),
          ],
        })
      ),
    ];

    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: thinBorder,
        rows: scoreRows,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              bottom: 1134,
              left: 1417, // ~2.5cm
              right: 1134,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `De_Kiem_Tra_${header.subject}_Lop${header.grade}_${header.term.replace(/\s+/g, '_')}_2026_2027.docx`;
  saveAs(blob, fileName);
}
