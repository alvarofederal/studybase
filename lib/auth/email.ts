import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "StudyBase <noreply@seudominio.com.br>";
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

export async function sendPasswordRecoveryEmail(
  email: string,
  nome: string,
  token: string
): Promise<void> {
  // Instanciado de forma lazy para não quebrar o build sem a var de ambiente
  const resend = new Resend(process.env.RESEND_API_KEY);
  const link = `${BASE_URL}/redefinir-senha/${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Recuperação de senha — StudyBase",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#059669">StudyBase</h2>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo:</p>
        <a href="${link}"
           style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Redefinir minha senha
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">
          O link expira em <strong>1 hora</strong>. Se você não solicitou isso, ignore este e-mail.
        </p>
        <p style="color:#6b7280;font-size:13px">
          Ou copie o link: <a href="${link}">${link}</a>
        </p>
      </div>
    `,
  });
}
