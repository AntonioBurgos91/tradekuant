import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de TradeKuant. Información sobre cómo recopilamos, usamos y protegemos tus datos.',
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </Link>

      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Información que Recopilamos</h2>
          <p className="text-muted-foreground mb-4">
            TradeKuant es un dashboard público de métricas de trading. Recopilamos información mínima:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Datos de navegación:</strong> Información anónima sobre el uso del sitio (páginas visitadas, tiempo de permanencia).</li>
            <li><strong>Datos técnicos:</strong> Tipo de navegador, sistema operativo, dirección IP (anonimizada).</li>
            <li><strong>Cookies:</strong> Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y preferencias de idioma/tema.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Uso de la Información</h2>
          <p className="text-muted-foreground mb-4">
            La información recopilada se utiliza exclusivamente para:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Mejorar la experiencia de usuario del sitio web.</li>
            <li>Analizar el tráfico y uso del sitio de forma agregada.</li>
            <li>Garantizar la seguridad y funcionamiento del sitio.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Datos de Trading Mostrados</h2>
          <p className="text-muted-foreground mb-4">
            Los datos de trading que se muestran en el dashboard son datos propios del operador de TradeKuant,
            obtenidos directamente de las APIs oficiales de las plataformas (Bitget, Darwinex, eToro).
            Estos datos son públicos y verificables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Panel de Administración</h2>
          <p className="text-muted-foreground mb-4">
            El panel de administración (/admin) está protegido por autenticación. Solo el administrador
            del sitio tiene acceso a esta sección. Los datos de autenticación se gestionan a través
            de Supabase Auth con encriptación de extremo a extremo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Terceros</h2>
          <p className="text-muted-foreground mb-4">
            No vendemos, alquilamos ni compartimos información personal con terceros para fines comerciales.
            Los servicios de terceros utilizados son:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Vercel:</strong> Hosting del sitio web.</li>
            <li><strong>Supabase:</strong> Base de datos y autenticación.</li>
            <li><strong>APIs de trading:</strong> Bitget, Darwinex y eToro para obtener datos de trading.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Tus Derechos</h2>
          <p className="text-muted-foreground mb-4">
            Como visitante del sitio, tienes derecho a:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Acceder a la información que tenemos sobre ti.</li>
            <li>Solicitar la eliminación de cualquier dato personal.</li>
            <li>Desactivar cookies en tu navegador.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Contacto</h2>
          <p className="text-muted-foreground">
            Para cualquier consulta relacionada con esta política de privacidad,
            puedes contactarnos a través de los canales indicados en el sitio web.
          </p>
        </section>

        <section className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Esta política de privacidad puede actualizarse periódicamente.
            Te recomendamos revisarla regularmente para estar informado sobre cómo protegemos tu información.
          </p>
        </section>
      </article>
    </div>
  );
}
