import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedFile {
  name: string;
  type: string;
  content: string;
  error?: string;
  size: number;
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const result: ParsedFile = {
    name: file.name,
    type: file.type,
    content: '',
    size: file.size
  };

  try {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File too large. Maximum size is 10MB.');
    }

    if (file.type === 'application/pdf') {
      result.content = await parsePDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.toLowerCase().endsWith('.docx')
    ) {
      result.content = await parseWord(file);
    } else if (
      file.type === 'text/plain' ||
      file.type === 'text/markdown' ||
      file.type === 'application/json' ||
      file.type === 'text/javascript' ||
      file.type === 'text/css' ||
      file.name.match(/\.(txt|md|json|js|ts|jsx|tsx|css)$/i)
    ) {
      result.content = await parseText(file);
    } else if (file.type.startsWith('image/')) {
      result.content = `[Image: ${file.name} (${formatFileSize(file.size)})]`;
    } else {
      throw new Error('Unsupported file type');
    }

    // Truncate content if too long
    if (result.content.length > 50000) { // ~50KB of text
      result.content = result.content.slice(0, 50000) + '\n[Content truncated due to length...]';
    }
  } catch (error) {
    result.error = `Error parsing ${file.name}: ${error.message}`;
    result.content = `[Failed to parse file: ${error.message}]`;
  }

  return result;
}

async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const maxPages = Math.min(pdf.numPages, 50); // Limit to first 50 pages
  let text = '';

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ');
    text += pageText + '\n\n';
  }

  if (pdf.numPages > maxPages) {
    text += `[Remaining ${pdf.numPages - maxPages} pages omitted...]`;
  }

  return text.trim();
}

async function parseWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function parseText(file: File): Promise<string> {
  const text = await file.text();
  return text.trim();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}