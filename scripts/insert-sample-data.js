const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://iuqcbtmpaethobtxandh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1cWNidG1wYWV0aG9idHhhbmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI3MDkwNiwiZXhwIjoyMDgyODQ2OTA2fQ.3fV0OBVSlU4h20zO7E1Yx16gS44HOi3Qq8rjfBCHd_w'
);

async function insertSampleData() {
  console.log('Insertando datos de ejemplo...\n');

  // Generate dates for last 12 months
  const dates = [];
  const today = new Date();
  for (let i = 365; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  // Sample snapshots for each platform
  const snapshots = [];

  // Bitget - Started with 300, now ~350
  let bitgetEquity = 300;
  let bitgetPeak = 300;
  dates.forEach((date, i) => {
    const dailyChange = (Math.random() - 0.45) * 3;
    bitgetEquity = Math.max(250, bitgetEquity + dailyChange);
    bitgetPeak = Math.max(bitgetPeak, bitgetEquity);
    const drawdown = ((bitgetPeak - bitgetEquity) / bitgetPeak) * 100;

    snapshots.push({
      platform_id: 1,
      date,
      equity: parseFloat(bitgetEquity.toFixed(2)),
      daily_pnl: parseFloat(dailyChange.toFixed(2)),
      total_pnl: parseFloat((bitgetEquity - 300).toFixed(2)),
      total_pnl_percent: parseFloat(((bitgetEquity - 300) / 300 * 100).toFixed(4)),
      peak_equity: parseFloat(bitgetPeak.toFixed(2)),
      drawdown: parseFloat(drawdown.toFixed(4)),
      copiers: Math.floor(10 + Math.random() * 5 + i/30),
      aum: parseFloat((4000 + Math.random() * 2000 + i * 5).toFixed(2)),
      source: 'api'
    });
  });

  // Darwinex - Started with 300, now ~318
  let darwinexEquity = 300;
  let darwinexPeak = 300;
  dates.forEach((date, i) => {
    const dailyChange = (Math.random() - 0.47) * 2;
    darwinexEquity = Math.max(270, darwinexEquity + dailyChange);
    darwinexPeak = Math.max(darwinexPeak, darwinexEquity);
    const drawdown = ((darwinexPeak - darwinexEquity) / darwinexPeak) * 100;

    snapshots.push({
      platform_id: 2,
      date,
      equity: parseFloat(darwinexEquity.toFixed(2)),
      daily_pnl: parseFloat(dailyChange.toFixed(2)),
      total_pnl: parseFloat((darwinexEquity - 300).toFixed(2)),
      total_pnl_percent: parseFloat(((darwinexEquity - 300) / 300 * 100).toFixed(4)),
      peak_equity: parseFloat(darwinexPeak.toFixed(2)),
      drawdown: parseFloat(drawdown.toFixed(4)),
      copiers: Math.floor(25 + Math.random() * 8 + i/50),
      aum: parseFloat((7000 + Math.random() * 3000 + i * 8).toFixed(2)),
      source: 'api'
    });
  });

  // eToro - Started with 300, now ~315
  let etoroEquity = 300;
  let etoroPeak = 300;
  dates.forEach((date, i) => {
    const dailyChange = (Math.random() - 0.48) * 1.5;
    etoroEquity = Math.max(280, etoroEquity + dailyChange);
    etoroPeak = Math.max(etoroPeak, etoroEquity);
    const drawdown = ((etoroPeak - etoroEquity) / etoroPeak) * 100;

    snapshots.push({
      platform_id: 3,
      date,
      equity: parseFloat(etoroEquity.toFixed(2)),
      daily_pnl: parseFloat(dailyChange.toFixed(2)),
      total_pnl: parseFloat((etoroEquity - 300).toFixed(2)),
      total_pnl_percent: parseFloat(((etoroEquity - 300) / 300 * 100).toFixed(4)),
      peak_equity: parseFloat(etoroPeak.toFixed(2)),
      drawdown: parseFloat(drawdown.toFixed(4)),
      copiers: Math.floor(1 + Math.random() * 3),
      aum: parseFloat((1000 + Math.random() * 800).toFixed(2)),
      source: 'manual'
    });
  });

  // Insert snapshots in batches
  console.log('Insertando', snapshots.length, 'snapshots...');
  for (let i = 0; i < snapshots.length; i += 100) {
    const batch = snapshots.slice(i, i + 100);
    const { error } = await supabase.from('snapshots').insert(batch);
    if (error) {
      console.log('Error inserting snapshots batch:', error.message);
      return;
    }
    process.stdout.write('.');
  }
  console.log('\n✅ Snapshots insertados');

  // Insert sample trades
  const trades = [
    // Bitget trades
    { platform_id: 1, symbol: 'BTC/USDT', side: 'long', entry_price: 42150.50, exit_price: 43280.00, quantity: 0.05, leverage: 10, pnl: 56.47, pnl_percent: 2.68, fees: 2.15, status: 'closed', opened_at: '2024-12-01T10:30:00Z', closed_at: '2024-12-03T14:20:00Z' },
    { platform_id: 1, symbol: 'ETH/USDT', side: 'long', entry_price: 2280.00, exit_price: 2450.00, quantity: 0.5, leverage: 5, pnl: 85.00, pnl_percent: 7.46, fees: 1.80, status: 'closed', opened_at: '2024-12-05T08:00:00Z', closed_at: '2024-12-10T16:45:00Z' },
    { platform_id: 1, symbol: 'SOL/USDT', side: 'short', entry_price: 98.50, exit_price: 92.30, quantity: 10, leverage: 3, pnl: 62.00, pnl_percent: 6.29, fees: 1.20, status: 'closed', opened_at: '2024-12-12T11:00:00Z', closed_at: '2024-12-14T09:30:00Z' },
    { platform_id: 1, symbol: 'BTC/USDT', side: 'long', entry_price: 44500.00, exit_price: null, quantity: 0.03, leverage: 5, pnl: null, pnl_percent: null, fees: 0.85, status: 'open', opened_at: '2024-12-28T14:00:00Z', closed_at: null },
    { platform_id: 1, symbol: 'XRP/USDT', side: 'long', entry_price: 0.62, exit_price: 0.71, quantity: 500, leverage: 5, pnl: 45.00, pnl_percent: 14.52, fees: 0.90, status: 'closed', opened_at: '2024-11-20T09:00:00Z', closed_at: '2024-11-28T15:30:00Z' },
    { platform_id: 1, symbol: 'DOGE/USDT', side: 'long', entry_price: 0.082, exit_price: 0.095, quantity: 2000, leverage: 3, pnl: 26.00, pnl_percent: 15.85, fees: 0.50, status: 'closed', opened_at: '2024-11-10T14:00:00Z', closed_at: '2024-11-18T11:00:00Z' },

    // Darwinex trades
    { platform_id: 2, symbol: 'EUR/USD', side: 'long', entry_price: 1.0850, exit_price: 1.0920, quantity: 10000, leverage: 30, pnl: 70.00, pnl_percent: 0.64, fees: 0.50, status: 'closed', opened_at: '2024-12-02T09:00:00Z', closed_at: '2024-12-04T17:00:00Z' },
    { platform_id: 2, symbol: 'GBP/USD', side: 'short', entry_price: 1.2750, exit_price: 1.2680, quantity: 5000, leverage: 20, pnl: 35.00, pnl_percent: 0.55, fees: 0.30, status: 'closed', opened_at: '2024-12-08T10:30:00Z', closed_at: '2024-12-11T15:00:00Z' },
    { platform_id: 2, symbol: 'USD/JPY', side: 'long', entry_price: 149.50, exit_price: 151.20, quantity: 8000, leverage: 25, pnl: 91.00, pnl_percent: 1.14, fees: 0.45, status: 'closed', opened_at: '2024-12-15T08:00:00Z', closed_at: '2024-12-20T12:00:00Z' },
    { platform_id: 2, symbol: 'EUR/GBP', side: 'short', entry_price: 0.8520, exit_price: 0.8480, quantity: 6000, leverage: 15, pnl: 24.00, pnl_percent: 0.47, fees: 0.25, status: 'closed', opened_at: '2024-11-25T08:30:00Z', closed_at: '2024-12-01T16:00:00Z' },
    { platform_id: 2, symbol: 'AUD/USD', side: 'long', entry_price: 0.6580, exit_price: null, quantity: 8000, leverage: 20, pnl: null, pnl_percent: null, fees: 0.35, status: 'open', opened_at: '2024-12-27T10:00:00Z', closed_at: null },

    // eToro trades
    { platform_id: 3, symbol: 'AAPL', side: 'long', entry_price: 178.50, exit_price: 185.20, quantity: 10, leverage: 1, pnl: 67.00, pnl_percent: 3.75, fees: 0, status: 'closed', opened_at: '2024-11-15T14:30:00Z', closed_at: '2024-12-10T20:00:00Z' },
    { platform_id: 3, symbol: 'TSLA', side: 'long', entry_price: 242.00, exit_price: 258.50, quantity: 5, leverage: 1, pnl: 82.50, pnl_percent: 6.82, fees: 0, status: 'closed', opened_at: '2024-12-01T15:00:00Z', closed_at: '2024-12-18T16:00:00Z' },
    { platform_id: 3, symbol: 'NVDA', side: 'long', entry_price: 485.00, exit_price: null, quantity: 2, leverage: 1, pnl: null, pnl_percent: null, fees: 0, status: 'open', opened_at: '2024-12-20T14:30:00Z', closed_at: null },
    { platform_id: 3, symbol: 'MSFT', side: 'long', entry_price: 378.00, exit_price: 390.50, quantity: 3, leverage: 1, pnl: 37.50, pnl_percent: 3.31, fees: 0, status: 'closed', opened_at: '2024-10-15T15:00:00Z', closed_at: '2024-11-20T16:00:00Z' },
    { platform_id: 3, symbol: 'GOOGL', side: 'long', entry_price: 138.20, exit_price: 142.80, quantity: 8, leverage: 1, pnl: 36.80, pnl_percent: 3.33, fees: 0, status: 'closed', opened_at: '2024-11-01T14:30:00Z', closed_at: '2024-11-28T20:00:00Z' },
  ];

  const { error: tradesError } = await supabase.from('trades').insert(trades);
  if (tradesError) {
    console.log('Error inserting trades:', tradesError.message);
  } else {
    console.log('✅ Trades insertados:', trades.length);
  }

  // Insert metrics cache
  const metricsCache = [
    // Bitget
    { platform_id: 1, period: 'all', total_return: 16.92, max_drawdown: -4.2, sharpe_ratio: 2.8, sortino_ratio: 3.5, calmar_ratio: 4.03, profit_factor: 2.1, win_rate: 0.72, total_trades: 156, winning_trades: 112, losing_trades: 44, avg_win: 45.50, avg_loss: -22.30, current_copiers: 15, total_aum: 5800, volatility: 12.5, best_month: 8.2, worst_month: -2.1, positive_months: 10, negative_months: 2 },
    { platform_id: 1, period: 'ytd', total_return: 14.5, max_drawdown: -3.8, sharpe_ratio: 2.6, sortino_ratio: 3.2, calmar_ratio: 3.82, profit_factor: 2.0, win_rate: 0.70, total_trades: 89, winning_trades: 62, losing_trades: 27, avg_win: 42.00, avg_loss: -20.50, current_copiers: 15, total_aum: 5800, volatility: 11.8, best_month: 7.5, worst_month: -1.8, positive_months: 9, negative_months: 3 },
    { platform_id: 1, period: '1m', total_return: 3.2, max_drawdown: -1.5, sharpe_ratio: 3.1, sortino_ratio: 4.0, calmar_ratio: 2.13, profit_factor: 2.4, win_rate: 0.75, total_trades: 12, winning_trades: 9, losing_trades: 3, avg_win: 38.00, avg_loss: -18.00, current_copiers: 15, total_aum: 5800, volatility: 8.2, best_month: 3.2, worst_month: 0, positive_months: 1, negative_months: 0 },

    // Darwinex
    { platform_id: 2, period: 'all', total_return: 6.17, max_drawdown: -6.1, sharpe_ratio: 1.9, sortino_ratio: 2.4, calmar_ratio: 1.01, profit_factor: 1.6, win_rate: 0.65, total_trades: 234, winning_trades: 152, losing_trades: 82, avg_win: 28.50, avg_loss: -18.20, current_copiers: 32, total_aum: 9500, volatility: 8.5, best_month: 4.2, worst_month: -3.5, positive_months: 8, negative_months: 4 },
    { platform_id: 2, period: 'ytd', total_return: 5.8, max_drawdown: -5.5, sharpe_ratio: 1.85, sortino_ratio: 2.3, calmar_ratio: 1.05, profit_factor: 1.55, win_rate: 0.64, total_trades: 145, winning_trades: 93, losing_trades: 52, avg_win: 26.00, avg_loss: -17.50, current_copiers: 32, total_aum: 9500, volatility: 8.0, best_month: 3.8, worst_month: -3.2, positive_months: 8, negative_months: 4 },
    { platform_id: 2, period: '1m', total_return: 1.8, max_drawdown: -2.0, sharpe_ratio: 2.0, sortino_ratio: 2.5, calmar_ratio: 0.9, profit_factor: 1.7, win_rate: 0.68, total_trades: 18, winning_trades: 12, losing_trades: 6, avg_win: 24.00, avg_loss: -15.00, current_copiers: 32, total_aum: 9500, volatility: 6.5, best_month: 1.8, worst_month: 0, positive_months: 1, negative_months: 0 },

    // eToro
    { platform_id: 3, period: 'all', total_return: 5.07, max_drawdown: -3.8, sharpe_ratio: 2.1, sortino_ratio: 2.7, calmar_ratio: 1.33, profit_factor: 1.8, win_rate: 0.68, total_trades: 45, winning_trades: 31, losing_trades: 14, avg_win: 52.00, avg_loss: -28.50, current_copiers: 3, total_aum: 1650, volatility: 10.2, best_month: 3.5, worst_month: -2.8, positive_months: 9, negative_months: 3 },
    { platform_id: 3, period: 'ytd', total_return: 4.5, max_drawdown: -3.2, sharpe_ratio: 2.0, sortino_ratio: 2.5, calmar_ratio: 1.41, profit_factor: 1.75, win_rate: 0.67, total_trades: 28, winning_trades: 19, losing_trades: 9, avg_win: 48.00, avg_loss: -25.00, current_copiers: 3, total_aum: 1650, volatility: 9.5, best_month: 3.2, worst_month: -2.5, positive_months: 8, negative_months: 4 },
    { platform_id: 3, period: '1m', total_return: 1.2, max_drawdown: -1.0, sharpe_ratio: 2.3, sortino_ratio: 2.9, calmar_ratio: 1.2, profit_factor: 1.9, win_rate: 0.70, total_trades: 5, winning_trades: 4, losing_trades: 1, avg_win: 45.00, avg_loss: -22.00, current_copiers: 3, total_aum: 1650, volatility: 7.0, best_month: 1.2, worst_month: 0, positive_months: 1, negative_months: 0 },
  ];

  const { error: metricsError } = await supabase.from('metrics_cache').insert(metricsCache);
  if (metricsError) {
    console.log('Error inserting metrics:', metricsError.message);
  } else {
    console.log('✅ Metrics cache insertado:', metricsCache.length);
  }

  // Insert global metrics
  const globalMetrics = [
    { period: 'all', total_equity: 983.50, total_pnl: 83.50, total_return: 9.28, combined_max_drawdown: -8.5, total_copiers: 50, total_aum: 16950 },
    { period: 'ytd', total_equity: 983.50, total_pnl: 74.80, total_return: 8.24, combined_max_drawdown: -7.2, total_copiers: 50, total_aum: 16950 },
    { period: '1m', total_equity: 983.50, total_pnl: 18.70, total_return: 2.07, combined_max_drawdown: -2.5, total_copiers: 50, total_aum: 16950 },
    { period: '3m', total_equity: 983.50, total_pnl: 45.20, total_return: 4.82, combined_max_drawdown: -4.8, total_copiers: 50, total_aum: 16950 },
    { period: '6m', total_equity: 983.50, total_pnl: 62.30, total_return: 6.76, combined_max_drawdown: -6.1, total_copiers: 50, total_aum: 16950 },
    { period: '1y', total_equity: 983.50, total_pnl: 78.90, total_return: 8.72, combined_max_drawdown: -7.8, total_copiers: 50, total_aum: 16950 },
  ];

  const { error: globalError } = await supabase.from('global_metrics_cache').insert(globalMetrics);
  if (globalError) {
    console.log('Error inserting global metrics:', globalError.message);
  } else {
    console.log('✅ Global metrics insertado:', globalMetrics.length);
  }

  // Final verification
  console.log('\n--- Verificación final ---');

  const { count: snapshotsCount } = await supabase.from('snapshots').select('*', { count: 'exact', head: true });
  const { count: tradesCount } = await supabase.from('trades').select('*', { count: 'exact', head: true });
  const { count: metricsCount } = await supabase.from('metrics_cache').select('*', { count: 'exact', head: true });
  const { count: globalCount } = await supabase.from('global_metrics_cache').select('*', { count: 'exact', head: true });

  console.log('Snapshots:', snapshotsCount);
  console.log('Trades:', tradesCount);
  console.log('Metrics cache:', metricsCount);
  console.log('Global metrics:', globalCount);

  console.log('\n✅ Todos los datos de ejemplo insertados correctamente!');
}

insertSampleData().catch(console.error);
