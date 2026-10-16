import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Demande de devis · Composia" },
      { name: "description", content: "Demandez un devis pour votre terrasse ou votre façade en composite." },
      { property: "og:title", content: "Demande de devis · Composia" },
      { property: "og:description", content: "Un conseiller vous recontacte pour chiffrer votre projet composite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const field = "w-full rounded-md border bg-card px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring";

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="eyebrow">Devis</p>
      <h1 className="mt-3 text-4xl md:text-5xl">Parlons de votre projet</h1>
      {sent ? (
        <p className="mt-10 rounded-xl bg-card p-6 shadow-soft">Merci ! Votre demande a bien été enregistrée, nous revenons vers vous rapidement.</p>
      ) : (
        <form
          className="mt-10 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Nom" className={field} />
            <input required type="email" placeholder="Email" className={field} />
          </div>
          <input placeholder="Téléphone" className={field} />
          <select className={field} defaultValue="terrasse">
            <option value="terrasse">Terrasse / tour de piscine</option>
            <option value="facade">Bardage de façade</option>
          </select>
          <input placeholder="Surface approximative (m²)" className={field} />
          <textarea rows={5} placeholder="Votre projet" className={field} />
          <Button type="submit" size="lg">Envoyer ma demande</Button>
        </form>
      )}
    </div>
  );
}
