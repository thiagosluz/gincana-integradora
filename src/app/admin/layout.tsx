import { cookies } from 'next/headers';
import Link from 'next/link';
import { AdminLogin } from '@/components/AdminLogin';
import { LogoutButton } from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLogged = (await cookies()).get('admin_token')?.value === 'true';

  if (!isLogged) {
    return (
      <main className="min-h-screen bg-[var(--background)] py-12 px-4">
        <AdminLogin />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row">
      {/* Sidebar Brutalista */}
      <aside className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Admin</h1>
          <p className="text-sm font-bold opacity-70">Gincana Jataí</p>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          <Link href="/admin/lancamentos" className="border-brutal bg-black text-white p-2 text-sm font-bold uppercase text-center hover:bg-zinc-800 transition-colors">
            Lançar Pontos
          </Link>
          <Link href="/admin/historico" className="border-brutal bg-white text-black p-2 text-sm font-bold uppercase text-center hover:bg-zinc-100 transition-colors shadow-brutal active:translate-y-1 active:shadow-none">
            Histórico
          </Link>
          <div className="mt-4 mb-2 border-b-2 border-black"></div>
          <Link href="/admin/atividades" className="border-brutal bg-yellow-200 text-black p-2 text-sm font-bold uppercase text-center hover:bg-yellow-300 transition-colors shadow-brutal active:translate-y-1 active:shadow-none">
            Atividades
          </Link>
          <Link href="/admin/equipes" className="border-brutal bg-blue-200 text-black p-2 text-sm font-bold uppercase text-center hover:bg-blue-300 transition-colors shadow-brutal active:translate-y-1 active:shadow-none">
            Equipes
          </Link>
          <div className="mt-4 mb-2 border-b-2 border-black"></div>
          <Link href="/admin/configuracoes" className="border-brutal bg-purple-200 text-black p-2 text-sm font-bold uppercase text-center hover:bg-purple-300 transition-colors shadow-brutal active:translate-y-1 active:shadow-none">
            Configurações
          </Link>
        </nav>

        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
