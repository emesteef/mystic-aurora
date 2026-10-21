import { execSync } from 'child_process';
import { cpSync, mkdirSync, statSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const GS = `C:\\Program Files\\gs\\gs10.05.1\\bin\\gswin64c.exe`;
const inputDir  = String.raw`C:\Users\marci\Desktop\Projekty\Mystic Aurora\mystic-aurora\public\materialy`;
const outputDir = String.raw`C:\Users\marci\Desktop\Projekty\Mystic Aurora\mystic-aurora\public\materialy\compressed`;
const tmpDir    = String.raw`C:\Temp\pdfcomp`;

mkdirSync(tmpDir,    { recursive: true });
mkdirSync(outputDir, { recursive: true });

const files = ['PROGNOZA PRO.pdf', 'PROGNOZA.pdf'];

for (const file of files) {
  const src    = join(inputDir, file);
  const dst    = join(outputDir, file);
  const before = statSync(src).size;

  console.log(`\nKompresuję: ${file} (${(before / 1024 / 1024).toFixed(2)} MB)`);

  const safe   = file.replace(/ /g, '_');
  const tmpIn  = join(tmpDir, `in_${safe}`);
  const tmpOut = join(tmpDir, `out_${safe}`);

  cpSync(src, tmpIn);

  const cmd = [
    `"${GS}"`,
    '-dBATCH', '-dNOPAUSE', '-dQUIET',
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.5',
    '-dPDFSETTINGS=/ebook',
    '-dEmbedAllFonts=true',
    '-dSubsetFonts=true',
    '-dColorImageDownsampleType=/Bicubic',
    '-dColorImageResolution=150',
    '-dGrayImageDownsampleType=/Bicubic',
    '-dGrayImageResolution=150',
    '-dMonoImageDownsampleType=/Subsample',
    '-dMonoImageResolution=150',
    `-sOutputFile="${tmpOut}"`,
    `"${tmpIn}"`,
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('GS error:', e.message);
  }

  if (existsSync(tmpOut)) {
    cpSync(tmpOut, dst);
    const after = statSync(dst).size;
    const ratio = (((before - after) / before) * 100).toFixed(1);
    console.log(`  Wynik: ${(after / 1024 / 1024).toFixed(2)} MB  (redukcja: ${ratio}%)`);
  } else {
    console.log('  BŁĄD: brak pliku wyjściowego');
  }
}

rmSync(tmpDir, { recursive: true, force: true });
console.log(`\nGotowe! Skompresowane pliki w:\n  ${outputDir}`);
