import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    let fileName = searchParams.get('file');
    const isDownload = searchParams.get('download') === '1';

    if (!fileName) {
      return new NextResponse('File parameter required', { status: 400 });
    }

    // Decode in case of double-encoding
    try {
      fileName = decodeURIComponent(fileName);
    } catch (e) {
      // keep original
    }

    // Strip leading slashes or /materials/ if passed as a full path
    fileName = fileName.replace(/^\/?materials\//i, '').replace(/^[/\\]+/, '');

    const materialsDir = path.join(process.cwd(), 'public', 'materials');
    let targetPath = path.join(materialsDir, fileName);

    // If file does not exist directly, attempt smart matching
    if (!fs.existsSync(targetPath)) {
      if (fs.existsSync(materialsDir)) {
        const allFiles = fs.readdirSync(materialsDir);
        // Try case-insensitive match
        const ciMatch = allFiles.find(
          (f) => f.toLowerCase() === fileName?.toLowerCase()
        );
        if (ciMatch) {
          targetPath = path.join(materialsDir, ciMatch);
        } else {
          // Try alphanumeric-only match (ignores spaces, dots, dashes, unicode ellipses)
          const cleanSearch = fileName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const fuzzyMatch = allFiles.find((f) => {
            const cleanFile = f.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return cleanFile === cleanSearch || cleanFile.includes(cleanSearch);
          });
          if (fuzzyMatch) {
            targetPath = path.join(materialsDir, fuzzyMatch);
          } else {
            console.warn(`[PDF API] File not found: "${fileName}" in ${materialsDir}`);
            return new NextResponse(`PDF "${fileName}" was not found in the materials library.`, {
              status: 404,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
          }
        }
      }
    }

    const fileBuffer = fs.readFileSync(targetPath);
    const actualName = path.basename(targetPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': isDownload
          ? `attachment; filename="${encodeURIComponent(actualName)}"`
          : `inline; filename="${encodeURIComponent(actualName)}"`,
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('[PDF API Error]', error);
    return new NextResponse(error.message || 'Error serving PDF', { status: 500 });
  }
}
