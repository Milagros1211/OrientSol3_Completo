/**
 * chartSvgUtils.ts - Shared SVG rendering and text-wrapping helpers for OrientSol charts.
 * Ensures clean multi-line wrapping (<tspan>) for titles and legends without clipping.
 */

/**
 * Splits text into lines such that each line does not exceed maxCharsPerLine (at word boundaries).
 */
export function wrapSvgTextLines(text: string, maxCharsPerLine = 46): string[] {
  if (!text) return [''];
  const trimmed = text.trim();
  if (trimmed.length <= maxCharsPerLine) {
    return [trimmed];
  }

  const words = trimmed.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [trimmed];
}

export interface SvgTitleOptions {
  text: string;
  centerX: number;
  startY?: number;
  fill: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  maxCharsPerLine?: number;
  id?: string;
}

/**
 * Renders an SVG <text> element with multi-line <tspan> wrapping if text exceeds maxCharsPerLine.
 * Vertically balances the lines around startY.
 */
export function renderWrappedSvgTitle({
  text,
  centerX,
  startY = 18,
  fill,
  fontSize = 11.5,
  fontWeight = 700,
  lineHeight = 13.5,
  maxCharsPerLine = 46,
  id,
}: SvgTitleOptions): string {
  const lines = wrapSvgTextLines(text, maxCharsPerLine);
  const idAttr = id ? ` id="${id}"` : '';

  if (lines.length <= 1) {
    return `<text${idAttr} x="${centerX.toFixed(1)}" y="${startY.toFixed(1)}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle">${lines[0] || ''}</text>`;
  }

  const firstY = startY - ((lines.length - 1) * lineHeight) / 2;

  return `
    <text${idAttr} x="${centerX.toFixed(1)}" y="${firstY.toFixed(1)}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="middle">
      ${lines
        .map(
          (line, idx) =>
            `<tspan x="${centerX.toFixed(1)}" ${idx === 0 ? '' : `dy="${lineHeight}"`}>${line}</tspan>`
        )
        .join('')}
    </text>
  `.trim();
}
