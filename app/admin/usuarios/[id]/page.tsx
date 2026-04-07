"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Materia {
  id: string;
  nome: string;
  slug: string;
  icone?: string;
  cor?: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: "ADMIN" | "USER";
  ativo: boolean;
  createdAt: string;
  materias: { materia: Materia }[];
}

export default function PerfilUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [todasMaterias, setTodasMaterias] = useState<Materia[]>([]);
  const [materiasAtivas, setMateriasAtivas] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(true);
  const [salvandoMaterias, setSalvandoMaterias] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({ nome: "", email: "", role: "USER", senha: "" });
  const [salvandoEdit, setSalvandoEdit] = useState(false);
  const [erroEdit, setErroEdit] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    const [resUser, resMaterias] = await Promise.all([
      fetch(`/api/admin/usuarios/${id}`),
      fetch("/api/admin/materias"),
    ]);

    const dataUser = await resUser.json();
    const dataMaterias = await resMaterias.json();

    if (dataUser.user) {
      setUsuario(dataUser.user);
      setFormEdit({
        nome: dataUser.user.nome,
        email: dataUser.user.email,
        role: dataUser.user.role,
        senha: "",
      });
      const ids = new Set<string>(
        dataUser.user.materias.map((m: { materia: Materia }) => m.materia.id)
      );
      setMateriasAtivas(ids);
    }

    if (dataMaterias.materias) {
      setTodasMaterias(dataMaterias.materias);
    }

    setCarregando(false);
  }, [id]);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  function toggleMateria(materiaId: string) {
    setMateriasAtivas((prev) => {
      const next = new Set(prev);
      if (next.has(materiaId)) next.delete(materiaId);
      else next.add(materiaId);
      return next;
    });
  }

  async function salvarMaterias() {
    setSalvandoMaterias(true);
    const res = await fetch(`/api/admin/usuarios/${id}/materias`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materiaIds: Array.from(materiasAtivas) }),
    });
    setSalvandoMaterias(false);
    if (res.ok) {
      setMensagem("Matérias salvas com sucesso!");
      setTimeout(() => setMensagem(""), 3000);
    }
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    setErroEdit("");
    setSalvandoEdit(true);
    const body: Record<string, string> = {
      nome: formEdit.nome,
      email: formEdit.email,
      role: formEdit.role,
    };
    if (formEdit.senha) body.senha = formEdit.senha;

    const res = await fetch(`/api/admin/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSalvandoEdit(false);

    if (!res.ok) { setErroEdit(data.error ?? "Erro ao salvar."); return; }
    setEditando(false);
    carregarDados();
    setMensagem("Dados atualizados!");
    setTimeout(() => setMensagem(""), 3000);
  }

  async function toggleAtivo() {
    if (!usuario) return;
    await fetch(`/api/admin/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !usuario.ativo }),
    });
    carregarDados();
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin" className="hover:text-gray-300 transition">Admin</Link>
          <span>/</span>
          <Link href="/admin/usuarios" className="hover:text-gray-300 transition">Usuários</Link>
          <span>/</span>
          <span className="text-gray-300">{usuario.nome}</span>
        </div>

        {/* Toast */}
        {mensagem && (
          <div className="mb-4 bg-emerald-900/30 border border-emerald-700/50 rounded-lg px-4 py-3 text-emerald-400 text-sm">
            {mensagem}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda — dados do usuário */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-2xl mb-3">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-white font-semibold text-lg">{usuario.nome}</h2>
                <p className="text-gray-400 text-sm">{usuario.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    usuario.role === "ADMIN"
                      ? "bg-purple-900/40 text-purple-400 border border-purple-700/40"
                      : "bg-gray-700/40 text-gray-400 border border-gray-600/40"
                  }`}>
                    {usuario.role}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    usuario.ativo
                      ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40"
                      : "bg-red-900/40 text-red-400 border border-red-700/40"
                  }`}>
                    {usuario.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center mb-4">
                Cadastrado em {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setEditando(true)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition"
                >
                  Editar dados
                </button>
                <button
                  onClick={toggleAtivo}
                  className={`w-full py-2 rounded-lg text-sm transition ${
                    usuario.ativo
                      ? "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/40"
                      : "bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-700/40"
                  }`}
                >
                  {usuario.ativo ? "Desativar conta" : "Reativar conta"}
                </button>
              </div>
            </div>
          </div>

          {/* Coluna direita — matérias */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Matérias liberadas</h3>
                  <p className="text-gray-400 text-sm">
                    {materiasAtivas.size} de {todasMaterias.length} matérias
                  </p>
                </div>
                <button
                  onClick={salvarMaterias}
                  disabled={salvandoMaterias}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {salvandoMaterias ? "Salvando..." : "Salvar"}
                </button>
              </div>

              {todasMaterias.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma matéria cadastrada.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todasMaterias.map((m) => {
                    const ativa = materiasAtivas.has(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMateria(m.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                          ativa
                            ? "bg-emerald-900/20 border-emerald-600/40 text-emerald-300"
                            : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        <span className="text-xl">{m.icone ?? "📖"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{m.nome}</p>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          ativa
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-600"
                        }`}>
                          {ativa && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar */}
      {editando && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Editar usuário</h3>
            <form onSubmit={salvarEdicao} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formEdit.nome}
                  onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={formEdit.email}
                  onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Role</label>
                <select
                  value={formEdit.role}
                  onChange={(e) => setFormEdit({ ...formEdit, role: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Nova senha <span className="text-gray-600">(deixe em branco para manter)</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formEdit.senha}
                  onChange={(e) => setFormEdit({ ...formEdit, senha: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              {erroEdit && <p className="text-red-400 text-sm">{erroEdit}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditando(false); setErroEdit(""); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoEdit}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
                >
                  {salvandoEdit ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
