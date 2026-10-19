import { recoveryNotice, type AdminContent } from "../lib/admin-contract.ts";
export const adminContent: AdminContent = {
  testOnly: false,
  brand: "Priva",
  welcome: "Bienvenido de nuevo",
  introduction:
    "Inicia sesión para acceder al panel administrativo y gestionar la comunidad.",
  recoveryNotice,
  passwordPolicy:
    "Usa entre 15 y 128 caracteres. Se permiten espacios y Unicode; evita contraseñas comunes. No se recortan ni transforman los caracteres.",
  revision: "006-2026-10-19",
};
