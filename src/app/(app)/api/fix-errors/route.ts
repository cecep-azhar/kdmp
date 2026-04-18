import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const processDir = process.cwd();
  const res: string[] = [];

  try {
    const layoutPath1 = path.join(processDir, 'src', 'app', 'layout.tsx');
    if (fs.existsSync(layoutPath1)) {
      fs.unlinkSync(layoutPath1);
      res.push('Deleted src/app/layout.tsx');
    }

    const layoutPath2 = path.join(processDir, 'src', 'app', '(payload)', 'layout.tsx');
    if (fs.existsSync(layoutPath2)) {
      fs.unlinkSync(layoutPath2);
      res.push('Deleted src/app/(payload)/layout.tsx');
    }

    // Try to delete .next cache but it might be locked by the running server
    const nextPath = path.join(processDir, '.next');
    if (fs.existsSync(nextPath)) {
      fs.rmSync(nextPath, { recursive: true, force: true });
      res.push('Deleted .next cache');
    }
    
    return NextResponse.json({ success: true, log: res });
  } catch (error: any) {
    return NextResponse.json({ success: false, log: res, error: error.message });
  }
}
