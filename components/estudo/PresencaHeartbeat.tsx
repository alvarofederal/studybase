"use client";

import { useEffect } from "react";

const INTERVALO_MS = 45_000;

/**
 * Mantém o aluno "online" e detecta quando a conta foi aberta em outro aparelho
 * (sessão única): nesse caso encerra esta sessão e leva ao login.
 */
export default function PresencaHeartbeat() {
  useEffect(() => {
    let ativo = true;

    function encerrar(motivo: "outro-dispositivo" | "sessao") {
      if (!ativo) return;
      ativo = false;
      window.location.href = `/api/auth/sessao-encerrada?motivo=${motivo}`;
    }

    async function bater() {
      if (!ativo) return;
      try {
        let res = await fetch("/api/presenca", { method: "POST" });
        if (res.status === 401) {
          // access token expirou: tenta renovar; se o refresh foi apagado por outro login, encerra
          const r = await fetch("/api/auth/refresh", { method: "POST" });
          if (!r.ok) return encerrar("outro-dispositivo");
          res = await fetch("/api/presenca", { method: "POST" });
        }
        if (res.status === 409) encerrar("outro-dispositivo");
        else if (res.status === 401) encerrar("sessao");
      } catch {
        /* sem rede: tenta de novo no próximo ciclo */
      }
    }

    bater();
    const id = window.setInterval(bater, INTERVALO_MS);
    const aoVoltar = () => { if (!document.hidden) bater(); };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      ativo = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, []);

  return null;
}
