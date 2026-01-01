import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Login',
  description: 'Iniciar sesión en el panel de administración',
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
      <LoginForm />
    </div>
  );
}
