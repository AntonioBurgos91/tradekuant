import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Términos de Uso',
  description: 'Términos y condiciones de uso de TradeKuant.',
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </Link>

      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Términos de Uso</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Aceptación de los Términos</h2>
          <p className="text-muted-foreground mb-4">
            Al acceder y utilizar TradeKuant (el "Sitio"), aceptas cumplir con estos términos de uso.
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar el sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Descripción del Servicio</h2>
          <p className="text-muted-foreground mb-4">
            TradeKuant es un dashboard público que muestra métricas de trading del operador del sitio.
            Los datos provienen de APIs oficiales de plataformas de trading (Bitget, Darwinex, eToro)
            y se actualizan automáticamente.
          </p>
          <p className="text-muted-foreground">
            El sitio tiene un propósito exclusivamente informativo y de transparencia.
            No ofrece servicios de inversión, asesoramiento financiero ni gestión de capital de terceros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Uso Permitido</h2>
          <p className="text-muted-foreground mb-4">
            Puedes utilizar este sitio para:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Consultar las métricas de trading públicas.</li>
            <li>Verificar el track record del operador.</li>
            <li>Acceder a información sobre las plataformas utilizadas.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Uso Prohibido</h2>
          <p className="text-muted-foreground mb-4">
            No está permitido:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Intentar acceder a áreas restringidas del sitio sin autorización.</li>
            <li>Realizar ataques técnicos (DDoS, inyección, etc.).</li>
            <li>Copiar, reproducir o redistribuir el contenido sin autorización.</li>
            <li>Utilizar los datos del sitio para fines comerciales sin consentimiento.</li>
            <li>Suplantar la identidad del operador de TradeKuant.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Propiedad Intelectual</h2>
          <p className="text-muted-foreground mb-4">
            El diseño, código, marca y contenido de TradeKuant son propiedad del operador del sitio.
            Los logos de Bitget, Darwinex y eToro pertenecen a sus respectivos propietarios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Disponibilidad del Servicio</h2>
          <p className="text-muted-foreground mb-4">
            Nos esforzamos por mantener el sitio disponible 24/7, pero no garantizamos su disponibilidad
            ininterrumpida. El sitio puede estar temporalmente no disponible por:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Mantenimiento programado o de emergencia.</li>
            <li>Problemas técnicos con proveedores externos.</li>
            <li>Circunstancias fuera de nuestro control.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
          <p className="text-muted-foreground mb-4">
            TradeKuant se proporciona "tal cual" sin garantías de ningún tipo.
            No nos hacemos responsables de:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Decisiones de inversión basadas en los datos mostrados.</li>
            <li>Pérdidas financieras de cualquier tipo.</li>
            <li>Inexactitudes temporales en los datos por fallos de APIs externas.</li>
            <li>Daños derivados del uso o imposibilidad de uso del sitio.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Enlaces a Terceros</h2>
          <p className="text-muted-foreground">
            El sitio puede contener enlaces a plataformas de trading externas.
            No somos responsables del contenido, políticas o prácticas de estos sitios de terceros.
            Te recomendamos leer sus términos y condiciones antes de usar sus servicios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Modificaciones</h2>
          <p className="text-muted-foreground">
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.
            El uso continuado del sitio después de cualquier cambio constituye tu aceptación de los nuevos términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Ley Aplicable</h2>
          <p className="text-muted-foreground">
            Estos términos se rigen por las leyes españolas.
            Cualquier disputa se resolverá en los tribunales de España.
          </p>
        </section>

        <section className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Al utilizar TradeKuant, confirmas que has leído, entendido y aceptado estos términos de uso.
          </p>
        </section>
      </article>
    </div>
  );
}
