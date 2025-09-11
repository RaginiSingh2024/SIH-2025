import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { IFlashcard } from '../models/flashcard.model';

export const generateFlashcardsPDF = async (
  flashcards: IFlashcard[],
  res: Response,
  title: string = 'Flashcards',
): Promise<void> => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
  );

  // Pipe the PDF to the response
  doc.pipe(res);

  // Add title page
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text(title, 50, 50, { align: 'center' });

  doc
    .fontSize(14)
    .font('Helvetica')
    .text(`Generated on ${new Date().toLocaleDateString()}`, 50, 100, {
      align: 'center',
    });

  doc.fontSize(12).text(`Total Flashcards: ${flashcards.length}`, 50, 120, {
    align: 'center',
  });

  doc.addPage();

  // Add flashcards
  flashcards.forEach((flashcard, index) => {
    const cardNumber = index + 1;

    // Check if we need a new page
    if (index > 0 && index % 3 === 0) {
      doc.addPage();
    }

    const yPosition = 80 + (index % 3) * 220;

    // Card border
    doc.rect(40, yPosition - 10, doc.page.width - 80, 200).stroke('#cccccc');

    // Card number and difficulty
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#666666')
      .text(`Card ${cardNumber}`, 50, yPosition, { align: 'left' });

    doc.text(
      `Difficulty: ${flashcard.difficulty.toUpperCase()}`,
      doc.page.width - 150,
      yPosition,
      { align: 'right' },
    );

    // Question
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#2563eb')
      .text('Q:', 50, yPosition + 25);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#000000')
      .text(flashcard.question, 70, yPosition + 25, {
        width: doc.page.width - 120,
        align: 'left',
      });

    // Answer
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#dc2626')
      .text('A:', 50, yPosition + 80);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#000000')
      .text(flashcard.answer, 70, yPosition + 80, {
        width: doc.page.width - 120,
        align: 'left',
      });

    // Tags
    if (flashcard.tags && flashcard.tags.length > 0) {
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text(`Tags: ${flashcard.tags.join(', ')}`, 50, yPosition + 140, {
          width: doc.page.width - 100,
          align: 'left',
        });
    }
  });

  // Add footer to last page
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor('#6b7280')
      .text(
        `Page ${i + 1} of ${pageCount}`,
        doc.page.width - 100,
        doc.page.height - 30,
        {
          align: 'right',
        },
      );
  }

  // Finalize the PDF
  doc.end();
};
