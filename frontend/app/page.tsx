import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Home() {
  return (
    <main className="page page--home">
      <section>
        <h1>Portfolio Gagnaire</h1>
        <p>Bienvenue sur le portfolio.</p>
        <ThemeToggle />
      </section>
    </main>
  );
}
