import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test WebSocket server connection
    const websocketUrl = process.env.WEBSOCKET_URL || 'http://localhost:3001';
    
    const response = await fetch(`${websocketUrl}/health`);
    const healthData = await response.json();
    
    // Test broadcast functionality
    const broadcastResponse = await fetch(`${websocketUrl}/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateLeaderboard' })
    });
    
    const broadcastData = await broadcastResponse.json();
    
    return NextResponse.json({
      message: 'WebSocket Connection Test',
      websocket_url: websocketUrl,
      health_check: healthData,
      broadcast_test: broadcastData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'WebSocket test failed',
      message: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
