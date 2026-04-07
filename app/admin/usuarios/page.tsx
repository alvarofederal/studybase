"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: "ADMIN" | "USER";
  ativo: boolean;
  createdAt: string;
  _count: { materias: number };
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", role: "USER" });
  const [formErro, setFormErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);
    const res = await fetch("/api/admin/usuarios");
    const data = await res.json();
    setUsuarios(data.usuarios ?? []);
    setCarregando(false);
  }, []);

  useEffect(() => { carregarUsuarios(); }, [carregarUsuarios]);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  );

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setFormErro("");
    setSalvando(true);
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormErro(data.error ?? "Erro ao criar."); return; }
      setModalAberto(false);
      setForm({ nome: "", email: "", senha: "", role: "USER" });
      carregarUsuarios();
    } catch { setFormErro("Erro de conexão."); }
    finally { setSalvando(false); }
  }

  async function toggleAtivo(u: Usuario) {
    await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !u.ativo }),
    });
    carregarUsuarios();
  }

  async function deletarUsuario(u: Usuario) {
    if (!confirm(`Deletar ${u.nome}? Esta ação é irreversível.`)) return;
    await fetch(`/api/admin/usuarios/${u.id}`, { method: "DELETE" });
    carregarUsuarios();
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/admin" className="hover:text-gray-300 transition">Admin</Link>
              <span>/</span>
              <span className="text-gray-300">Usuários</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <span>+</span> Novo usuário
          </button>
        </div>

        {/* Busca */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm w-full max-w-xs"
          />
        </div>

        {/* Tabela */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-gray-500">Carregando...</div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Nenhum usuário encontrado.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Usuário</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Matérias</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Cadastro</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium text-sm">{u.nome}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === "ADMIN"
                          ? "bg-purple-900/40 text-purple-400 border border-purple-700/40"
                          : "bg-gray-700/40 text-gray-400 border border-gray-600/40"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{u._count.materias}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAtivo(u)}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border transition ${
                          u.ativo
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700/40"
                            : "bg-red-900/40 text-red-400 border-red-700/40 hover:bg-emerald-900/30 hover:text-emerald-400 hover:border-emerald-700/40"
                        }`}
                      >
                        {u.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/usuarios/${u.id}`}
                          className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition"
                        >
                          Perfil
                        </Link>
                        <button
                          onClick={() => deletarUsuario(u)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium transition"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Resumo */}
        <p className="mt-3 text-gray-500 text-xs">
          {usuariosFiltrados.length} usuário{usuariosFiltrados.length !== 1 ? "s" : ""} encontrado{usuariosFiltrados.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Modal Novo Usuário */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Novo usuário</h3>
            <form onSubmit={criarUsuario} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                required
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="password"
                required
                placeholder="Senha (mín. 6 caracteres)"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="USER">Usuário</option>
                <option value="ADMIN">Admin</option>
              </select>

              {formErro && (
                <p className="text-red-400 text-sm">{formErro}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setModalAberto(false); setFormErro(""); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
                >
                  {salvando ? "Salvando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
