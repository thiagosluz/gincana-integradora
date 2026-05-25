'use client';

import { logout } from '@/app/actions';

export function LogoutButton() {
  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <button 
      onClick={handleLogout} 
      className="font-bold underline uppercase text-sm hover:text-red-500 cursor-pointer text-left"
    >
      Deslogar (Sair)
    </button>
  );
}
