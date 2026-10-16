import { describe, expect, it } from "vitest";
import { ATOUTS_PICTOS, CATEGORIES, TEINTES, getCategorie } from "@/lib/catalogue";

describe("gammes composite", () => {
  it("propose 5 teintes sur les sols et les façades", () => {
    expect(TEINTES).toHaveLength(5);
    for (const id of ["sols", "facades"]) {
      for (const p of getCategorie(id)!.produits) {
        expect(p.teintes).toHaveLength(5);
      }
    }
  });

  it("exclut le gris clair des clôtures et pergolas", () => {
    for (const id of ["clotures", "pergolas"]) {
      for (const p of getCategorie(id)!.produits) {
        expect(p.teintes.map((t) => t.id)).not.toContain("gris-clair");
        expect(p.teintes).toHaveLength(4);
      }
    }
  });

  it("couvre les quatre familles du catalogue", () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual(["sols", "facades", "clotures", "pergolas"]);
  });

  it("donne à chaque produit un visuel et au moins une photo de mise en situation", () => {
    for (const c of CATEGORIES) {
      for (const p of c.produits) {
        expect(p.visuel, p.id).toBeTruthy();
        expect(p.situation?.length, p.id).toBeGreaterThan(0);
      }
    }
  });

  it("affiche les 13 pictos des caractéristiques du composite", () => {
    expect(ATOUTS_PICTOS).toHaveLength(13);
  });
});
