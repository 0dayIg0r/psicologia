import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600"] });
export const metadata: Metadata = { title: "PsicoEncontre | Encontre o psicólogo certo para você", description: "Encontre psicólogos para terapia online ou presencial de forma simples e acolhedora." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}><body>{children}</body></html>; }
