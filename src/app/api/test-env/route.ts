import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Environment Variables Test',
    mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    websocket_url: process.env.WEBSOCKET_URL || 'Not Set',
    websocket_port: process.env.WEBSOCKET_PORT || 'Not Set',
    node_env: process.env.NODE_ENV || 'Not Set',
    timestamp: new Date().toISOString()
  });
}
