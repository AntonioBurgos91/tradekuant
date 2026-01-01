import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Descargo de Responsabilidad',
  description: 'Aviso legal y descargo de responsabilidad financiera de TradeKuant. Información importante sobre riesgos de inversión.',
};

export default function DisclaimerPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </Link>

      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Descargo de Responsabilidad</h1>
        <p className="text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Important Warning Box */}
        <div className="not-prose mb-8 p-6 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Aviso Importante de Riesgo</h2>
              <p className="text-sm text-destructive/90">
                El trading con apalancamiento en criptomonedas, forex y CFDs conlleva un alto nivel de riesgo
                y puede resultar en la pérdida de todo tu capital. Antes de operar, asegúrate de comprender
                completamente los riesgos involucrados y busca asesoramiento financiero independiente si es necesario.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. No Constituye Asesoramiento Financiero</h2>
          <p className="text-muted-foreground mb-4">
            <strong className="text-foreground">TradeKuant NO proporciona asesoramiento financiero, de inversión,
            fiscal ni legal.</strong> La información mostrada en este sitio es puramente informativa y tiene
            como único propósito mostrar de forma transparente el track record de trading del operador.
          </p>
          <p className="text-muted-foreground">
            Nada de lo contenido en este sitio debe interpretarse como una recomendación para comprar,
            vender o mantener cualquier instrumento financiero, criptomoneda o activo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Resultados Pasados No Garantizan Resultados Futuros</h2>
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
            <p className="text-yellow-500 font-medium">
              Los resultados históricos mostrados en este dashboard NO garantizan ni predicen rendimientos futuros.
            </p>
          </div>
          <p className="text-muted-foreground mb-4">
            El rendimiento pasado de cualquier estrategia de trading no es indicativo de resultados futuros.
            Los mercados financieros son inherentemente impredecibles y están sujetos a múltiples factores
            que pueden afectar drásticamente los resultados.
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Las condiciones del mercado cambian constantemente.</li>
            <li>Los eventos macroeconómicos pueden causar movimientos inesperados.</li>
            <li>Las regulaciones pueden cambiar y afectar las operaciones.</li>
            <li>El rendimiento pasado positivo puede convertirse en pérdidas en el futuro.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Riesgos del Trading con Apalancamiento</h2>
          <p className="text-muted-foreground mb-4">
            El trading con apalancamiento (incluido copy trading, forex, CFDs y criptomonedas) implica riesgos significativos:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Pérdida total del capital:</strong> Puedes perder todo el dinero invertido.</li>
            <li><strong>Pérdidas superiores al depósito:</strong> En algunos casos, las pérdidas pueden exceder tu depósito inicial.</li>
            <li><strong>Alta volatilidad:</strong> Los precios pueden fluctuar drásticamente en cortos períodos.</li>
            <li><strong>Riesgo de liquidez:</strong> Puede no ser posible cerrar posiciones cuando lo desees.</li>
            <li><strong>Riesgo de contraparte:</strong> Las plataformas de trading pueden enfrentar problemas operativos o financieros.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Copy Trading - Riesgos Específicos</h2>
          <p className="text-muted-foreground mb-4">
            Si decides copiar a otros traders (en plataformas como Bitget, eToro, etc.):
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Estás asumiendo el mismo riesgo que el trader copiado.</li>
            <li>No hay garantía de que el trader mantenga su rendimiento histórico.</li>
            <li>Eres el único responsable de tus decisiones de inversión.</li>
            <li>Las comisiones y spreads pueden afectar tus resultados de forma diferente.</li>
            <li>Los tiempos de ejecución pueden variar y afectar el resultado.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Precisión de los Datos</h2>
          <p className="text-muted-foreground mb-4">
            Aunque nos esforzamos por mostrar datos precisos y actualizados:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Los datos provienen de APIs de terceros que pueden experimentar retrasos o errores.</li>
            <li>Pueden existir discrepancias temporales entre los datos mostrados y los datos reales.</li>
            <li>Los cálculos de métricas (Sharpe, Sortino, etc.) son aproximaciones basadas en datos disponibles.</li>
            <li>No garantizamos la exactitud, integridad ni oportunidad de la información.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Tu Responsabilidad</h2>
          <p className="text-muted-foreground mb-4">
            Como usuario de este sitio, reconoces y aceptas que:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Cualquier decisión de inversión es únicamente tu responsabilidad.</li>
            <li>Debes realizar tu propia investigación (DYOR - Do Your Own Research).</li>
            <li>Debes consultar con asesores financieros profesionales antes de invertir.</li>
            <li>Solo debes invertir dinero que puedas permitirte perder completamente.</li>
            <li>Debes entender los productos financieros antes de operar con ellos.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
          <p className="text-muted-foreground mb-4">
            En la máxima medida permitida por la ley aplicable:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>TradeKuant y su operador no serán responsables de ninguna pérdida financiera.</li>
            <li>No asumimos responsabilidad por decisiones de inversión basadas en este sitio.</li>
            <li>No garantizamos ningún resultado de trading.</li>
            <li>No somos responsables de errores en datos de terceros.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Regulación</h2>
          <p className="text-muted-foreground">
            TradeKuant es un sitio web informativo y no opera como entidad financiera regulada.
            Las plataformas de trading mencionadas (Bitget, Darwinex, eToro) tienen sus propias
            regulaciones y licencias. Consulta directamente con cada plataforma para información
            sobre su regulación y protección al inversor.
          </p>
        </section>

        {/* Final Warning Box */}
        <div className="not-prose mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              <strong className="text-foreground">Recuerda:</strong> El trading es una actividad de alto riesgo.
              Nunca inviertas dinero que no puedas permitirte perder. Los rendimientos mostrados son históricos
              y no garantizan resultados futuros. Este sitio no proporciona asesoramiento financiero.
            </p>
            <p className="text-xs text-muted-foreground">
              Al utilizar este sitio, confirmas que has leído y comprendido este descargo de responsabilidad.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
