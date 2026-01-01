# Configuración de Supabase

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Configura:
   - **Name**: TradeKuant
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Elige la más cercana a ti
   - **Pricing Plan**: Free (suficiente para empezar)

5. Espera ~2 minutos mientras se crea el proyecto

## 2. Obtener Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** → **API**
2. Copia las siguientes credenciales:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (¡SECRETO!) → `SUPABASE_SERVICE_ROLE_KEY`

3. Actualiza el archivo `.env.local` en la raíz del proyecto con estos valores

## 3. Ejecutar Migrations

### Opción A: SQL Editor (Recomendado para empezar)

1. Ve a **SQL Editor** en el dashboard de Supabase
2. Ejecuta cada archivo de migration **en orden**:

   - `001_create_platforms.sql`
   - `002_create_snapshots.sql`
   - `003_create_trades.sql`
   - `004_create_metrics_cache.sql`
   - `005_create_rls_policies.sql`

3. Para cada archivo:
   - Abre el archivo en tu editor
   - Copia todo el contenido
   - Pega en el SQL Editor
   - Click en "Run"
   - Verifica que no haya errores

### Opción B: Supabase CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link con tu proyecto
supabase link --project-ref your-project-ref

# Ejecutar migrations
supabase db push
```

## 4. Verificar Instalación

1. Ve a **Database** → **Tables**
2. Deberías ver las siguientes tablas:
   - `platforms` (con 3 registros: Bitget, Darwinex, eToro)
   - `snapshots`
   - `trades`
   - `metrics_cache`
   - `global_metrics_cache`

3. Verifica los datos iniciales:
   ```sql
   SELECT * FROM platforms;
   ```
   Deberías ver Bitget, Darwinex y eToro.

## 5. Configurar Autenticación (Admin)

1. Ve a **Authentication** → **Policies** (ya configuradas via RLS)
2. Ve a **Authentication** → **Users**
3. Click en "Add user" → "Create new user"
4. Email: El que configuraste en `ADMIN_EMAIL`
5. Password: Crea una contraseña segura
6. **Important**: Verifica el email (revisa tu bandeja de entrada)

## Notas de Seguridad

- **NUNCA** compartas la `service_role` key públicamente
- Mantén `.env.local` en `.gitignore`
- Las políticas RLS están configuradas para:
  - ✅ Lectura pública de todas las métricas
  - ✅ Escritura solo para usuarios autenticados
  - ✅ Protección de datos sensibles

## Backup

Supabase hace backups automáticos, pero puedes hacer backups manuales:

1. **Database** → **Backups**
2. Click en "Create backup"

## Troubleshooting

### Error: "relation does not exist"
→ Las migrations no se ejecutaron correctamente. Revisa el orden.

### Error: "permission denied"
→ Verifica que RLS esté configurado correctamente (migration 005)

### No puedo autenticarme
→ Verifica que el email en `.env.local` coincida con el usuario creado en Supabase

## Próximos Pasos

Una vez configurado Supabase:

1. ✅ Actualiza `.env.local` con tus credenciales reales
2. ✅ Ejecuta `npm run dev` para probar la conexión
3. ✅ Continúa con la implementación de la app
