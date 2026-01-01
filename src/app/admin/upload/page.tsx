import { CsvUploader } from '@/components/admin/CsvUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Upload CSV',
  description: 'Subir datos de eToro desde CSV',
};

export default function UploadPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload CSV</h1>
        <p className="text-muted-foreground">
          Importa datos de eToro desde un archivo CSV
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CsvUploader />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Guía Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                1. Exporta tus datos desde eToro
              </p>
              <p>
                2. Asegúrate de que tenga las columnas requeridas
              </p>
              <p>
                3. Arrastra el archivo o haz click para seleccionarlo
              </p>
              <p>
                4. Click en "Subir CSV" para importar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ejemplo CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
{`date,equity,daily_pnl,total_pnl,copiers,aum
2024-01-07,312.45,12.45,12.45,0,0
2024-01-08,315.20,2.75,15.20,0,0`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
