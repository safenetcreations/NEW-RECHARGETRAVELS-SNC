import { jsPDF } from 'jspdf';
import { GuideCategory } from '@/data/travelGuideContent';

export const generatePDF = async (categories: GuideCategory[]) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set fonts
  pdf.setFont('helvetica');
  
  // Cover page
  pdf.setFontSize(32);
  pdf.setTextColor(30, 64, 175); // Blue color
  pdf.text('Sri Lanka Travel Guide', 105, 60, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Your Comprehensive Guide to Paradise', 105, 75, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text('Powered by Recharge Travels', 105, 90, { align: 'center' });
  
  // Table of contents
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Table of Contents', 20, 30);
  
  let tocY = 50;
  categories.forEach((category, index) => {
    pdf.setFontSize(14);
    pdf.setTextColor(30, 64, 175);
    pdf.text(`${category.icon} ${category.name}`, 25, tocY);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(category.description, 25, tocY + 5);
    tocY += 15;
  });

  // Content pages
  categories.forEach((category) => {
    // Category cover page
    pdf.addPage();
    pdf.setFontSize(24);
    pdf.setTextColor(30, 64, 175);
    pdf.text(`${category.icon} ${category.name}`, 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const descLines = pdf.splitTextToSize(category.description, 170);
    pdf.text(descLines, 20, 40);

    let yPosition = 60;

    // Sections
    category.sections.forEach((section) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }

      // Section title
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(section.title, 20, yPosition);
      yPosition += 10;

      // Section content
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      const contentLines = pdf.splitTextToSize(section.content, 170);
      contentLines.forEach((line: string) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 30;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      });

      // Highlights
      if (section.highlights && section.highlights.length > 0) {
        yPosition += 5;
        pdf.setFontSize(12);
        pdf.setTextColor(30, 64, 175);
        pdf.text('Highlights:', 20, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        section.highlights.forEach((highlight) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 30;
          }
          const highlightLines = pdf.splitTextToSize(`• ${highlight}`, 165);
          highlightLines.forEach((line: string) => {
            pdf.text(line, 25, yPosition);
            yPosition += 5;
          });
        });
      }

      // Tips
      if (section.tips && section.tips.length > 0) {
        yPosition += 5;
        
        // Tips box background
        pdf.setFillColor(240, 248, 255); // Light blue background
        pdf.roundedRect(18, yPosition - 5, 174, section.tips.length * 6 + 15, 3, 3, 'F');
        
        pdf.setFontSize(12);
        pdf.setTextColor(30, 64, 175);
        pdf.text('Travel Tips:', 20, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.setTextColor(30, 64, 175);
        section.tips.forEach((tip) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 30;
          }
          const tipLines = pdf.splitTextToSize(`• ${tip}`, 165);
          tipLines.forEach((line: string) => {
            pdf.text(line, 25, yPosition);
            yPosition += 5;
          });
        });
      }

      yPosition += 15; // Space between sections
    });
  });

  // Footer on last page
  const pageCount = pdf.getNumberOfPages();
  pdf.setPage(pageCount);
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text('© Recharge Travels - Your trusted travel partner in Sri Lanka', 105, 285, { align: 'center' });

  // Save the PDF
  pdf.save('sri-lanka-travel-guide.pdf');
};

// Alternative simple HTML-based approach for better formatting
export const generateHTMLForPrint = (categories: GuideCategory[]): string => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sri Lanka Travel Guide</title>
      <style>
        @page { 
          size: A4; 
          margin: 2cm;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .page-break { 
          page-break-after: always; 
        }
        
        .cover {
          text-align: center;
          padding: 100px 0;
        }
        
        .cover h1 {
          color: #1e40af;
          font-size: 48px;
          margin-bottom: 20px;
        }
        
        .cover p {
          font-size: 20px;
          color: #666;
        }
        
        .toc {
          padding: 40px 0;
        }
        
        .toc h2 {
          color: #1e40af;
          margin-bottom: 30px;
        }
        
        .toc-item {
          margin-bottom: 15px;
        }
        
        .toc-item h3 {
          color: #1e40af;
          margin: 0;
        }
        
        .toc-item p {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 14px;
        }
        
        .category {
          padding: 40px 0;
        }
        
        .category-header {
          color: #1e40af;
          border-bottom: 2px solid #1e40af;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section h3 {
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-content {
          margin-bottom: 20px;
          text-align: justify;
        }
        
        .highlights {
          background-color: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .highlights h4 {
          color: #1e40af;
          margin-top: 0;
        }
        
        .highlights ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .tips {
          background-color: #fef3c7;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        
        .tips h4 {
          color: #92400e;
          margin-top: 0;
        }
        
        .tips ul {
          margin: 0;
          padding-left: 20px;
        }
        
        @media print {
          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="cover page-break">
        <h1>Sri Lanka Travel Guide</h1>
        <p>Your Comprehensive Guide to Paradise</p>
        <p style="margin-top: 50px; font-size: 16px;">Powered by Recharge Travels</p>
      </div>
      
      <!-- Table of Contents -->
      <div class="toc page-break">
        <h2>Table of Contents</h2>
  `;

  categories.forEach(category => {
    html += `
      <div class="toc-item">
        <h3>${category.icon} ${category.name}</h3>
        <p>${category.description}</p>
      </div>
    `;
  });

  html += '</div>';

  // Content
  categories.forEach((category, catIndex) => {
    html += `
      <div class="category ${catIndex < categories.length - 1 ? 'page-break' : ''}">
        <h2 class="category-header">${category.icon} ${category.name}</h2>
        <p style="color: #666; margin-bottom: 30px;">${category.description}</p>
    `;

    category.sections.forEach(section => {
      html += `
        <div class="section">
          <h3>${section.title}</h3>
          <div class="section-content">${section.content}</div>
      `;

      if (section.highlights && section.highlights.length > 0) {
        html += `
          <div class="highlights">
            <h4>Highlights</h4>
            <ul>
              ${section.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      if (section.tips && section.tips.length > 0) {
        html += `
          <div class="tips">
            <h4>Travel Tips</h4>
            <ul>
              ${section.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      html += '</div>';
    });

    html += '</div>';
  });

  html += `
      <div style="text-align: center; margin-top: 50px; color: #999;">
        <p>© Recharge Travels - Your trusted travel partner in Sri Lanka</p>
      </div>
    </body>
    </html>
  `;

  return html;
};