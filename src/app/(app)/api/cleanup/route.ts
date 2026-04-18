import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const processDir = process.cwd();
  try {
    const dirToDelete = path.join(processDir, 'src', 'app', '(app)', 'api', 'fix-errors');
    const selfDir = path.join(processDir, 'src', 'app', '(app)', 'api', 'cleanup');
    
    // Delete fix-errors
    if (fs.existsSync(dirToDelete)) {
      fs.rmSync(dirToDelete, { recursive: true, force: true });
    }
    
    // Schedule self-deletion by delaying 100ms so the response sends first!
    setTimeout(() => {
        if (fs.existsSync(selfDir)) {
           fs.rmSync(selfDir, { recursive: true, force: true });
        }
    }, 1000);
    
    return NextResponse.json({ success: true, message: "Cleaned up temp routes" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
