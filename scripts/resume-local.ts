import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Locale = 'en' | 'zh';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const privateDirectory = resolve(projectRoot, 'private-resume');
const fileFor = (locale: Locale) => resolve(privateDirectory, `resume.${locale}.json`);

export const readResume = (locale: Locale): unknown => {
  const file = fileFor(locale);
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(readFileSync(file, 'utf8'));
};

export const writeResume = (locale: Locale, value: unknown) => {
  mkdirSync(privateDirectory, { recursive: true });
  writeFileSync(fileFor(locale), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return value;
};

