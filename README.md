# TradeKuant - Trading Performance Dashboard

> **La K de Kuantificable** - Dashboard profesional para mostrar resultados de trading verificables

Dashboard público que muestra métricas de rendimiento unificadas de múltiples plataformas de copy trading (Bitget, Darwinex, eToro).

## 🚀 Características

- ✅ **Multi-plataforma**: Integración con Bitget, Darwinex y eToro
- ✅ **Datos en tiempo real**: Sincronización automática vía API (Bitget, Darwinex)
- ✅ **Import manual**: Subida de CSV para eToro
- ✅ **Métricas profesionales**: Sharpe, Sortino, Calmar, Max Drawdown, Win Rate, etc.
- ✅ **Gráficos interactivos**: Equity curve, drawdown charts, retornos mensuales
- ✅ **Transparencia total**: Datos públicos para atraer copiadores
- ✅ **Panel admin**: Gestión de datos y configuración

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel
- **CRON**: Vercel Cron Jobs

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase (gratuita)
- API keys de Bitget y/o Darwinex (opcional para empezar)

## 🏁 Inicio Rápido

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd tradekuant
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a las instrucciones detalladas en `supabase/README.md`
3. Ejecuta las migrations en orden (001 → 005)

### 3. Configurar variables de entorno

Copia `.env.example` a `.env.local` y completa tus credenciales:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales:

```env
# Supabase (obligatorio)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Bitget (opcional - usar mock inicialmente)
BITGET_API_KEY=...
# ... etc
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📊 Métricas Calculadas

- **Retorno**: Total Return %, CAGR, Retorno mensual promedio
- **Riesgo**: Max Drawdown, Volatilidad
- **Ratios**: Sharpe, Sortino, Calmar, Profit Factor
- **Trading**: Win Rate, Avg Win/Loss, Total operaciones

## 📚 Más Información

Ver documentación completa en `/docs` o consulta:
- [Supabase Setup](supabase/README.md)
- [API Documentation](#api-endpoints)

## 📄 Licencia

MIT
