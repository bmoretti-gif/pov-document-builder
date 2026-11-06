export const escapeHtml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function replaceCustomerPlaceholder(text: string, customerName: string): string {
  const customer = customerName.trim();
  return customer ? text.replace(/\[CUSTOMER\]/g, () => customer) : text;
}

export function formatCustomerContent(text: string, customerName: string): string {
  // Substitute after formatting so the customer name stays literal text, even
  // when it contains Markdown punctuation or HTML characters.
  return replaceCustomerPlaceholder(formatContent(text), escapeHtml(customerName));
}

export function formatContent(text: string): string {
  if (!text) return '';
  
  let html = '';
  const lines = text.split('\n');
  let inTable = false;
  let tableRows: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  
  // v1.4 Formatting Styles
  const paraStyle = 'margin: 0; padding: 0; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 3pt; mso-para-margin: 0; line-height: 12pt; mso-line-height-rule: exactly; color: #1e293b; font-size: 10pt;';
  const bulletStyle = 'margin: 0; padding: 0; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 0pt; mso-para-margin: 0; line-height: 12pt; mso-line-height-rule: exactly; color: #1e293b; font-size: 10pt;';

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const originalLine = line;
    const trimmedLine = line.trim();
    
    if (trimmedLine === 'CODE:' || /^```/.test(trimmedLine)) {
      if (inCodeBlock) {
        html += `<pre style="background-color: #0f172a; color: #f8fafc; padding: 9pt; border-radius: 4pt; margin: 12pt 0; font-family: 'Courier New', Courier, monospace; font-size: 9pt; white-space: pre-wrap; word-break: break-all; border: 1pt solid #1e293b; line-height: 11pt; mso-line-height-rule: exactly;"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`;
        inCodeBlock = false;
        codeLines = [];
        continue;
      } else {
        inCodeBlock = true;
        continue;
      }
    }
    
    if (inCodeBlock) {
      codeLines.push(originalLine);
      continue;
    }

    if (trimmedLine.startsWith('|') && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] || '')) {
      const rows = [trimmedLine];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) rows.push(lines[index++].trim());
      index--;
      html += renderTable(rows, '|');
      continue;
    }
    
    if (trimmedLine === 'TABLE:') {
      inTable = true;
      tableRows = [];
      continue;
    }
    
    if (inTable) {
      if (trimmedLine === '') {
        html += renderTable(tableRows);
        inTable = false;
        tableRows = [];
        continue;
      } else if (trimmedLine.includes(',')) {
        tableRows.push(trimmedLine);
        continue;
      }
    }
    
    if (!trimmedLine) {
      html += '<p class="MsoNormal" style="margin: 0; padding: 0; mso-margin-top-alt:0pt; mso-margin-bottom-alt:0pt; mso-para-margin:0pt; height: 6pt; font-size: 1pt; line-height: 6pt; mso-line-height-rule: exactly;">&nbsp;</p>';
    } else {
      let processedLine = escapeHtml(trimmedLine);
      processedLine = processedLine.replace(/\*\*\*(\S(?:.*?\S)?)\*\*\*/g, '<strong><em>$1</em></strong>');
      processedLine = processedLine.replace(/\*\*(\S(?:.*?\S)?)\*\*/g, '<strong>$1</strong>');
      processedLine = processedLine.replace(/\*(\S(?:.*?\S)?)\*/g, '<em>$1</em>');
      processedLine = processedLine.replace(/`([^`]+)`/g, '<code style="background-color: #f1f5f9; color: #2596be; padding: 1pt 2pt; border-radius: 2pt; font-family: \'Courier New\', Courier, monospace;">$1</code>');
      processedLine = processedLine.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #2596be; text-decoration: underline;">$1</a>');
      
      const leadingSpaces = originalLine.search(/\S/);
      
      const heading = trimmedLine.match(/^(#{1,6})\s+/);
      if (heading) {
        const level = Math.min(heading[1].length + 1, 6);
        html += `<h${level} style="font-size: ${level <= 3 ? '13pt' : '11pt'}; color: #1e293b; margin: 12pt 0 6pt; font-weight: bold;">${processedLine.slice(heading[0].length)}</h${level}>`;
      } else if (trimmedLine.startsWith('>')) {
        html += `<p style="${paraStyle} border-left: 2pt solid #cbd5e1; padding-left: 8pt;">${processedLine.replace(/^&gt;\s?/, '')}</p>`;
      } else if (trimmedLine.startsWith('- [ ]')) {
        const ml = leadingSpaces >= 2 ? '36pt' : '18pt';
        html += `<p class="MsoNormal" style="${bulletStyle} margin-left: ${ml}; mso-para-margin-left: ${ml};"><span style="font-family: Arial, sans-serif;">☐</span>&nbsp;${processedLine.slice(5).trim()}</p>`;
      } else if (trimmedLine.startsWith('- [x]') || trimmedLine.startsWith('- [X]')) {
        const ml = leadingSpaces >= 2 ? '36pt' : '18pt';
        html += `<p class="MsoNormal" style="${bulletStyle} margin-left: ${ml}; mso-para-margin-left: ${ml};"><span style="font-family: Arial, sans-serif;">☑</span>&nbsp;${processedLine.slice(5).trim()}</p>`;
      } else if (trimmedLine.startsWith('- ')) {
        const isSubBullet = leadingSpaces >= 2;
        const ml = isSubBullet ? '36pt' : '18pt';
        const bullet = isSubBullet ? '◦' : '•';
        html += `<p class="MsoNormal" style="${bulletStyle} margin-left: ${ml}; mso-para-margin-left: ${ml};"><span style="font-weight: bold;">${bullet}</span>&nbsp;${processedLine.slice(2).trim()}</p>`;
      } else {
        html += `<p class="MsoNormal" style="${paraStyle}">${processedLine}</p>`;
      }
    }
  }
  
  if (inTable && tableRows.length > 0) {
    html += renderTable(tableRows);
  }
  if (inCodeBlock) html += `<pre style="white-space: pre-wrap; word-break: break-all; font-size: 9pt;"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`;
  
  return html;
}

function renderTable(rows: string[], delimiter = ','): string {
  if (rows.length === 0) return '';
  let html = '<div style="margin: 12pt 0; width: 100%;"><table cellPadding="0" cellSpacing="0" border="0" style="width: 100%; border-collapse: collapse; border: 1pt solid #cbd5e1; font-size: 9pt; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">';
  rows.forEach((row, index) => {
    const cells = delimiter === '|' ? row.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|')) : row.split(',').map(cell => cell.trim());
    const isHeader = index === 0;
    html += `<tr style="${isHeader ? 'background-color: #0f172a; color: #ffffff;' : 'background-color: #ffffff;'}">`;
    cells.forEach(cell => {
      let processedCell = escapeHtml(cell);
      if (cell === '[ ]' || cell === '- [ ]') processedCell = '☐';
      else if (cell === '[x]' || cell === '[X]' || cell === '- [x]') processedCell = '☑';
      const align = isHeader ? 'center' : 'left';
      html += `<${isHeader ? 'th' : 'td'} style="border: 1pt solid #cbd5e1; padding: 3pt 6pt; vertical-align: middle; line-height: 11pt; mso-line-height-rule: exactly;">`;
      html += `<p class="MsoNormal" style="margin: 0; padding: 0; mso-margin-top-alt:0pt; mso-margin-bottom-alt:0pt; mso-para-margin: 0; line-height: 11pt; mso-line-height-rule: exactly; text-align: ${align}; font-size: 9pt;">${processedCell}</p>`;
      html += `</${isHeader ? 'th' : 'td'}>`;
    });
    html += '</tr>';
  });
  html += '</table></div>';
  return html;
}
