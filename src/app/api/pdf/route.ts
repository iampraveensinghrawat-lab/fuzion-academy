import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseServer } from '@/lib/supabaseServer';

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

    // Strip path traversal attempts and isolate filename
    fileName = path.basename(fileName.replace(/^\/?materials\//i, '').replace(/^[/\\]+/, ''));

    const materialsDir = path.resolve(process.cwd(), 'public', 'materials');
    let targetPath = path.resolve(materialsDir, fileName);

    // Security check: strictly restrict filesystem access to materials directory
    if (!targetPath.startsWith(materialsDir)) {
      return new NextResponse('Access denied: Invalid file path', { status: 403 });
    }

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
          }
        }
      }

      // If file does not exist on local disk, check Supabase Cloud Storage & Database
      if (!fs.existsSync(targetPath)) {
        try {
          // 1. Query study_materials table
          const { data: dbMatches } = await supabaseServer
            .from('study_materials')
            .select('*')
            .ilike('file_name', `%${fileName}%`)
            .limit(1);

          if (dbMatches && dbMatches.length > 0 && dbMatches[0].file_url) {
            return NextResponse.redirect(dbMatches[0].file_url);
          }

          // 2. Query storage bucket directly
          const cleanSearch = fileName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const { data: storageFiles } = await supabaseServer.storage.from('study-materials').list();
          if (storageFiles && storageFiles.length > 0) {
            const found = storageFiles.find((f: any) => {
              const cleanF = f.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              return cleanF.includes(cleanSearch) || cleanSearch.includes(cleanF);
            });
            if (found) {
              const { data: pUrl } = supabaseServer.storage.from('study-materials').getPublicUrl(found.name);
              if (pUrl?.publicUrl) {
                return NextResponse.redirect(pUrl.publicUrl);
              }
            }
          }
        } catch (cloudErr) {
          console.warn('[PDF API] Supabase cloud fallback notice:', cloudErr);
        }

        console.warn(`[PDF API] File not found: "${fileName}" in ${materialsDir} or Supabase cloud`);
        return new NextResponse(`PDF "${fileName}" was not found in the materials library.`, {
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
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
