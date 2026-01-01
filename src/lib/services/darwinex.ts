/**
 * Darwinex API client
 * Docs: https://api.darwinex.com/
 */

interface DarwinexConfig {
  apiToken: string;
  darwinName: string;
}

interface DarwinexSnapshot {
  date: string;
  equity: number;
  daily_pnl: number;
  total_pnl: number;
  copiers: number;
  aum: number;
}

export class DarwinexClient {
  private config: DarwinexConfig;
  private baseUrl = 'https://api.darwinex.com';

  constructor(config?: DarwinexConfig) {
    this.config = config || {
      apiToken: process.env.DARWINEX_API_TOKEN || '',
      darwinName: process.env.DARWINEX_DARWIN_NAME || '',
    };
  }

  /**
   * Make authenticated request to Darwinex API
   */
  private async request<T>(endpoint: string): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiToken}`,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Darwinex API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get Darwin info (MOCK for now)
   */
  async getDarwinInfo(): Promise<any> {
    // TODO: Uncomment when you have real API keys
    // const data = await this.request<any>(`/darwininfo/${this.config.darwinName}`);
    // return data;

    // MOCK DATA
    return {
      darwin: this.config.darwinName,
      return: 18.5,
      maxDrawdown: -6.2,
      investorsCount: 28,
      aum: 12500,
    };
  }

  /**
   * Get quotes/equity curve (MOCK for now)
   */
  async getQuotes(
    resolution: string = '1d',
    from?: number,
    to?: number
  ): Promise<any[]> {
    // TODO: Uncomment when you have real API keys
    // const endpoint = `/quotes/${this.config.darwinName}?resolution=${resolution}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`;
    // const data = await this.request<any>(endpoint);
    // return data.quotes || [];

    // MOCK DATA
    return [
      { date: '2024-12-01', close: 305.0 },
      { date: '2024-12-15', close: 315.5 },
      { date: '2024-12-30', close: 318.5 },
    ];
  }

  /**
   * Get Darwin badges/metrics (MOCK for now)
   */
  async getBadges(): Promise<any> {
    // TODO: Uncomment when you have real API keys
    // const data = await this.request<any>(`/darwin/${this.config.darwinName}/badges`);
    // return data;

    // MOCK DATA
    return {
      experience: 'A',
      risk_stability: 'B+',
      return: 'A-',
    };
  }

  /**
   * Sync latest data and return snapshot
   */
  async syncData(): Promise<DarwinexSnapshot> {
    try {
      const info = await this.getDarwinInfo();
      const quotes = await this.getQuotes();

      const latestQuote = quotes[quotes.length - 1];
      const previousQuote = quotes[quotes.length - 2];

      const dailyPnl = latestQuote && previousQuote
        ? latestQuote.close - previousQuote.close
        : 0;

      const initialCapital = parseFloat(process.env.INITIAL_CAPITAL || '300');
      const totalPnl = latestQuote ? latestQuote.close - initialCapital : 0;

      return {
        date: new Date().toISOString().split('T')[0],
        equity: latestQuote?.close || initialCapital,
        daily_pnl: dailyPnl,
        total_pnl: totalPnl,
        copiers: info.investorsCount || 0,
        aum: info.aum || 0,
      };
    } catch (error) {
      console.error('Error syncing Darwinex data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const darwinexClient = new DarwinexClient();
