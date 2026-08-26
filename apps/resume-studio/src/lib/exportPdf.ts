const collectStyles = () => Array.from(document.styleSheets)
  .map((sheet) => {
    try {
      return Array.from(sheet.cssRules).map((rule) => rule.cssText).join('\n');
    } catch {
      return '';
    }
  })
  .filter(Boolean)
  .join('\n');

export const createResumePdf = async (source: HTMLElement, title: string) => {
  await document.fonts.ready;
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      baseUrl: `${window.location.origin}/`,
      css: collectStyles(),
      html: source.outerHTML,
      title,
    }),
  });

  if (!response.ok) {
    const message = await response.json() as { error?: string };
    throw new Error(message.error ?? 'PDF generation failed.');
  }

  return URL.createObjectURL(await response.blob());
};
