"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  materiaId: string;
  nomeMateria: string;
}

export default function RevogarAcessoBtn({ materiaId, nomeMateria }: Props) {
  const [confirmando, setConfirmando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function revogar() {
    setCarregando(true);
    await fetch("/api/estudo/revogar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materiaId }),
    });
    setCarregando(false);
    setConfirmando(false);
    router.refresh();
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
        <p className="text-xs text-gray-400 flex-1 leading-snug">
          Tem certeza? Precisará solicitar novamente para acessar.
        </p>
        <button
          onClick={() => setConfirmando(false)}
          className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={revogar}
          disabled={carregando}
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
        >
          {carregando ? (
            <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : null}
          Confirmar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-800">
      <button
        onClick={() => setConfirmando(true)}
        className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/10 active:text-red-400 py-1.5 rounded-lg border border-transparent hover:border-red-500/20 transition-all"
        title={`Remover acesso a ${nomeMateria}`}
      >
        ✕ Remover acesso
      </button>
    </div>
  );
}
