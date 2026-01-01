# TradeKuant - Tareas de Desarrollo

## FASE 1: FRONTEND PÚBLICO
| # | Tarea | Estado |
|---|-------|--------|
| 1.1 | Landing page con branding TradeKuant | ✅ Completado |
| 1.2 | Header/Footer con navegación | ✅ Completado |
| 1.3 | Página "Sobre mí" o "Estrategia" | ✅ Completado |
| 1.4 | Links a perfiles de plataformas | ✅ Completado |
| 1.5 | Responsive móvil | ✅ Completado |
| 1.6 | Dark/Light mode | ✅ Completado |

## FASE 2: PANEL ADMIN
| # | Tarea | Estado |
|---|-------|--------|
| 2.1 | Autenticación con Supabase Auth | ✅ Completado |
| 2.2 | Página login /admin protegida | ✅ Completado |
| 2.3 | Upload CSV para eToro | ✅ Completado |
| 2.4 | Tabla para ver/editar snapshots | ✅ Completado |
| 2.5 | Formulario añadir snapshot manual | ✅ Completado |

## FASE 3: CRON JOBS (APIs)
| # | Tarea | Estado |
|---|-------|--------|
| 3.1 | Endpoint /api/cron/bitget | ✅ Completado |
| 3.2 | Endpoint /api/cron/darwinex | ✅ Completado |
| 3.3 | Verificación con CRON_SECRET | ✅ Completado |
| 3.4 | Configurar vercel.json para CRON | ✅ Completado |

## FASE 4: TESTING
| # | Tarea | Estado |
|---|-------|--------|
| 4.1 | Probar todos los endpoints API | ⏳ Pendiente |
| 4.2 | Probar upload CSV | ⏳ Pendiente |
| 4.3 | Probar responsive en móvil | ⏳ Pendiente |
| 4.4 | Probar cálculos de métricas | ⏳ Pendiente |
| 4.5 | Verificar RLS de Supabase | ⏳ Pendiente |

## FASE 5: DEPLOY A VERCEL
| # | Tarea | Estado |
|---|-------|--------|
| 5.1 | Crear cuenta Vercel | 👤 Usuario |
| 5.2 | Conectar repositorio GitHub | 👤 Usuario |
| 5.3 | Configurar variables de entorno | ✅ Documentado |
| 5.4 | Primer deploy | 👤 Usuario |
| 5.5 | Verificar producción | 👤 Usuario |

## FASE 6: CONECTAR DOMINIO
| # | Tarea | Estado |
|---|-------|--------|
| 6.1 | Añadir tradekuant.io en Vercel | 👤 Usuario |
| 6.2 | Configurar DNS en Porkbun | 👤 Usuario |
| 6.3 | Redirección .com → .io | 👤 Usuario |
| 6.4 | Verificar SSL/HTTPS | 👤 Usuario |

## FASE 7: POST-LANZAMIENTO
| # | Tarea | Estado |
|---|-------|--------|
| 7.1 | SEO básico (meta tags, OG image) | ✅ Completado |
| 7.2 | Google Analytics / Plausible | ⏳ Opcional |
| 7.3 | Crear usuario admin en Supabase | 👤 Usuario |
| 7.4 | Documentar proceso de actualización | ✅ Completado |

---

## Resumen de Completado

### Funcionalidades implementadas:
- Landing page con diseño fintech oscuro
- Dashboard con datos reales de Supabase
- Gráfico de Equity Curve interactivo con filtros
- Página de Estrategia multi-idioma
- Modo Dark/Light toggle
- Sistema de autenticación con Supabase Auth
- Panel Admin protegido con gestión de snapshots
- Upload de CSV para eToro
- CRON jobs configurados para Bitget y Darwinex
- SEO completo (meta tags, OG, robots.txt, sitemap.xml)
- Soporte para 6 idiomas (ES, EN, DE, FR, ZH, AR)

### Variables de entorno necesarias:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
CRON_SECRET=tu_secret_aleatorio
NEXT_PUBLIC_APP_URL=https://tradekuant.io
```
