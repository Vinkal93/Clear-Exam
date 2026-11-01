import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'pass',
    service: 'clearexam-admin-web',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  });
}
