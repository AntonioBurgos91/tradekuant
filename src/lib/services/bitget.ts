/**
 * Bitget API client
 * Docs: https://www.bitget.com/api-doc/
 */

import crypto from 'crypto';

interface BitgetConfig {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
  traderId: string;
}

interface BitgetSnapshot {
  date: string;
  equity: number;
  daily_pnl: number;
  total_pnl: number;
  copiers: number;
  aum: number;
}

export class BitgetClient {
  private config: BitgetConfig;
  private baseUrl = 'https://api.bitget.com';

  constructor(config?: BitgetConfig) {
    this.config = config || {
      apiKey: process.env.BITGET_API_KEY || '',
      apiSecret: process.env.BITGET_API_SECRET || '',
      passphrase: process.env.BITGET_API_PASSPHRASE || '',
      traderId: process.env.BITGET_TRADER_ID || '',
    };
  }

  /**
   * Generate HMAC signature for Bitget API
   */
  private generateSignature(
    timestamp: string,
    method: string,
    requestPath: string,
    body: string = ''
  ): string {
    const message = timestamp + method.toUpperCase() + requestPath + body;
    return crypto
      .createHmac('sha256', this.config.apiSecret)
      .update(message)
      .digest('base64');
  }

  /**
   * Make authenticated request to Bitget API
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const timestamp = Date.now().toString();
    const requestPath = `/api/v2${endpoint}`;
    const bodyStr = body ? JSON.stringify(body) : '';

    const signature = this.generateSignature(timestamp, method, requestPath, bodyStr);

    const headers = {
      'Content-Type': 'application/json',
      'ACCESS-KEY': this.config.apiKey,
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': this.config.passphrase,
    };

    const response = await fetch(`${this.baseUrl}${requestPath}`, {
      method,
      headers,
      body: bodyStr || undefined,
    });

    if (!response.ok) {
      throw new Error(`Bitget API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.code !== '00000') {
      throw new Error(`Bitget API error: ${data.msg}`);
    }

    return data.data as T;
  }

  /**
   * Get trader profit summary (MOCK for now)
   */
  async getTraderProfitSummary(): Promise<BitgetSnapshot> {
    // TODO: Uncomment when you have real API keys
    // const data = await this.request<any>('GET', '/copy/spot-trader/profit-summarys');

    // MOCK DATA for development
    const mockData = {
      date: new Date().toISOString().split('T')[0],
      equity: 350.75,
      daily_pnl: 5.25,
      total_pnl: 50.75,
      copiers: 12,
      aum: 2500.0,
    };

    return mockData;
  }

  /**
   * Get current followers count (MOCK for now)
   */
  async getCurrentFollowers(): Promise<number> {
    // TODO: Uncomment when you have real API keys
    // const data = await this.request<any>('GET', '/copy/spot-trader/current-track-total');
    // return data.totalFollowers || 0;

    // MOCK DATA
    return 12;
  }

  /**
   * Get order history (MOCK for now)
   */
  async getOrderHistory(limit: number = 50): Promise<any[]> {
    // TODO: Uncomment when you have real API keys
    // const data = await this.request<any>('GET', `/copy/spot-trader/order-history?limit=${limit}`);
    // return data.orders || [];

    // MOCK DATA
    return [
      {
        symbol: 'BTCUSDT',
        side: 'long',
        entry_price: 42000,
        exit_price: 43500,
        quantity: 0.01,
        pnl: 15.0,
        opened_at: '2024-12-25T10:00:00Z',
        closed_at: '2024-12-26T15:30:00Z',
      },
      {
        symbol: 'ETHUSDT',
        side: 'long',
        entry_price: 2200,
        exit_price: 2250,
        quantity: 0.5,
        pnl: 25.0,
        opened_at: '2024-12-27T08:00:00Z',
        closed_at: '2024-12-28T12:00:00Z',
      },
    ];
  }

  /**
   * Sync latest data and return snapshot
   */
  async syncData(): Promise<BitgetSnapshot> {
    try {
      const snapshot = await this.getTraderProfitSummary();
      return snapshot;
    } catch (error) {
      console.error('Error syncing Bitget data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const bitgetClient = new BitgetClient();
