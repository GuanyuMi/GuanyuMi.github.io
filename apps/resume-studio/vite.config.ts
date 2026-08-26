import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { readResume, writeResume, type Locale } from '../../scripts/resume-local.ts';

const localeFrom = (url?: string): Locale | null => {
  const match = url?.match(/^\/api\/resumes\/(en|zh)$/);
  return match ? match[1] as Locale : null;
};

const send = (response: import('node:http').ServerResponse, status: number, body: unknown) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
};

const sendPdf = (response: import('node:http').ServerResponse, pdf: Uint8Array) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader('Content-Length', String(pdf.byteLength));
  response.setHeader('Cache-Control', 'no-store');
  response.end(pdf);
};

const browserCandidates = () => {
  if (process.platform === 'win32') {
    return [
      process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
      process.env['PROGRAMFILES(X86)'] && `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
      process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
      process.env['PROGRAMFILES(X86)'] && `${process.env['PROGRAMFILES(X86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
      process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
    ];
  }
  if (process.platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];
  }
  return ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/microsoft-edge', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
};

const findBrowser = () => browserCandidates().find((candidate): candidate is string => Boolean(candidate && existsSync(candidate)));

interface PdfRequest {
  html: string;
  css: string;
  baseUrl: string;
  title: string;
}

const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

let browserPromise: Promise<import('playwright-core').Browser> | null = null;

const getBrowser = () => {
  if (!browserPromise) {
    const executablePath = findBrowser();
    if (!executablePath) throw new Error('Chrome, Edge, or Chromium is required to export PDF.');
    browserPromise = import('playwright-core').then(({ chromium }) => chromium.launch({ executablePath, headless: true }));
    void browserPromise.then((browser) => browser.on('disconnected', () => { browserPromise = null; })).catch(() => { browserPromise = null; });
  }
  return browserPromise;
};

const renderPdf = async ({ html, css, baseUrl, title }: PdfRequest) => {
  const browser = await getBrowser();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
  try {
    await page.emulateMedia({ media: 'screen' });
    await page.setContent(`<!doctype html><html><head><base href="${escapeHtml(baseUrl)}"><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${css}</style><style>html,body{height:auto!important;margin:0!important;overflow:visible!important;background:#fff!important}.resume-page{box-shadow:none!important;margin:0!important;transform:none!important}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
    await page.evaluate('document.fonts.ready');
    return await page.pdf({ format: 'A4', margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true, printBackground: true });
  } finally {
    await page.close();
  }
};

const readBody = (request: import('node:http').IncomingMessage) => new Promise<string>((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => { body += String(chunk); });
  request.on('end', () => resolve(body));
  request.on('error', reject);
});

const localResumePlugin = (): Plugin => ({
  name: 'local-resume-files',
  configureServer(server) {
    server.httpServer?.once('close', () => {
      const pendingBrowser = browserPromise;
      browserPromise = null;
      if (pendingBrowser) void pendingBrowser.then((browser) => browser.close()).catch(() => undefined);
    });
    server.middlewares.use(async (request, response, next) => {
      const locale = localeFrom(request.url);
      try {
        if (request.method === 'GET' && locale) return send(response, 200, readResume(locale));
        if (request.method === 'PUT' && locale) return send(response, 200, writeResume(locale, JSON.parse(await readBody(request))));
        if (request.method === 'POST' && request.url === '/api/export-pdf') {
          const payload = JSON.parse(await readBody(request)) as PdfRequest;
          if (!payload.html || !payload.css || !payload.baseUrl || !payload.title) return send(response, 400, { error: 'Incomplete PDF export request.' });
          return sendPdf(response, await renderPdf(payload));
        }
      } catch (error) {
        return send(response, 400, { error: error instanceof Error ? error.message : 'Local resume request failed.' });
      }
      next();
    });
  },
});

export default defineConfig({ plugins: [react(), localResumePlugin()] });
