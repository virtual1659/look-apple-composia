import { describe, expect, it } from "vitest";
import { CATEGORIES, TEINTES, getCategorie } from "@/lib/catalogue";

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
});
