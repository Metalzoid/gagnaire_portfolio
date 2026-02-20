"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/services/admin-api";
import { API_BASE_CLIENT } from "@/services/api-config";
import { Button } from "@/components/ui/button";
import type { Experience } from "shared";
import styles from "./dashboard.module.scss";

interface DashboardStats {
  projects: number;
  skills: number;
  experience: number;
  experienceWork: number;
  experienceEducation: number;
  experienceAlternance: number;
  testimonials: number;
  contacts: number;
  contactsPending: number;
  technologies: number;
}

function countByType(exp: Experience[], type: Experience["type"]) {
  return exp.filter((e) => e.type === type).length;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_CLIENT}/api/health`, { signal: controller.signal })
      .then((r) => r.ok)
      .then(setApiOk)
      .catch(() => setApiOk(false));

    Promise.all([
      adminApi.projects.list(),
      adminApi.skills.list(),
      adminApi.experience.list(),
      adminApi.testimonials.list(),
      adminApi.contacts.list(),
      adminApi.technologies.list(),
    ])
      .then(
        ([projects, skills, exp, testimonials, contacts, technologies]) => {
          const skillCount = skills.reduce(
            (acc, cat) => acc + cat.skills.length,
            0,
          );
          const contactsPending = contacts.filter(
            (c) => c.status === "pending",
          ).length;
          setStats({
            projects: projects.length,
            skills: skillCount,
            experience: exp.length,
            experienceWork: countByType(exp, "work"),
            experienceEducation: countByType(exp, "education"),
            experienceAlternance: countByType(exp, "alternance"),
            testimonials: testimonials.length,
            contacts: contacts.length,
            contactsPending,
            technologies: technologies.length,
          });
        },
      )
      .catch(() =>
        setStats({
          projects: 0,
          skills: 0,
          experience: 0,
          experienceWork: 0,
          experienceEducation: 0,
          experienceAlternance: 0,
          testimonials: 0,
          contacts: 0,
          contactsPending: 0,
          technologies: 0,
        }),
      )
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Tableau de bord</h1>
        <p className={styles.pageSubtitle}>
          Vue d&apos;ensemble du contenu et de l&apos;état du portfolio.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="stats-heading">
        <h2 id="stats-heading" className={styles.sectionTitle}>
          Statistiques
        </h2>
        <div className={styles.grid}>
          <Link href="/admin/projects" className={styles.card}>
            <span className={styles.number}>
              {loading ? "—" : stats?.projects ?? "—"}
            </span>
            <span className={styles.label}>Projets</span>
          </Link>
          <Link href="/admin/skills" className={styles.card}>
            <span className={styles.number}>
              {loading ? "—" : stats?.skills ?? "—"}
            </span>
            <span className={styles.label}>Compétences</span>
          </Link>
          <Link href="/admin/experience" className={styles.card}>
            <span className={styles.number}>
              {loading ? "—" : stats?.experience ?? "—"}
            </span>
            <span className={styles.label}>Expériences</span>
            {!loading && stats && stats.experience > 0 && (
              <span className={styles.cardMeta}>
                {stats.experienceWork} pro • {stats.experienceEducation} formation
                {stats.experienceAlternance > 0
                  ? ` • ${stats.experienceAlternance} alt.`
                  : ""}
              </span>
            )}
          </Link>
          <Link href="/admin/testimonials" className={styles.card}>
            <span className={styles.number}>
              {loading ? "—" : stats?.testimonials ?? "—"}
            </span>
            <span className={styles.label}>Témoignages</span>
          </Link>
          <Link href="/admin/contacts" className={styles.card}>
            <span className={styles.number}>
              {loading ? "—" : stats?.contacts ?? "—"}
            </span>
            <span className={styles.label}>Contacts</span>
            {!loading && stats && stats.contactsPending > 0 && (
              <span className={styles.cardBadge}>
                {stats.contactsPending} non lu
                {stats.contactsPending > 1 ? "s" : ""}
              </span>
            )}
          </Link>
          <Link href="/admin/technologies" className={styles.card}>
            <span className={styles.number}>
              {loading ? "—" : stats?.technologies ?? "—"}
            </span>
            <span className={styles.label}>Technologies</span>
          </Link>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="actions-heading">
        <h2 id="actions-heading" className={styles.sectionTitle}>
          Actions rapides
        </h2>
        <div className={styles.quickActions}>
          <Button href="/admin/projects" ariaLabel="Nouveau projet">
            Nouveau projet
          </Button>
          <Button href="/admin/experience" ariaLabel="Nouvelle expérience">
            Nouvelle expérience
          </Button>
          <Button href="/admin/testimonials" ariaLabel="Nouveau témoignage">
            Nouveau témoignage
          </Button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="api-heading">
        <h2 id="api-heading" className={styles.sectionTitle}>
          État du service
        </h2>
        <div
          className={`${styles.apiCard} ${
            apiOk === null
              ? styles.apiCardPending
              : apiOk
                ? styles.apiCardOk
                : styles.apiCardError
          }`}
        >
          <span className={styles.apiIcon} aria-hidden>
            {apiOk === null ? (
              <IconLoader />
            ) : apiOk ? (
              <IconCheck />
            ) : (
              <IconCross />
            )}
          </span>
          <div className={styles.apiContent}>
            <span
              className={
                apiOk === null
                  ? styles.statusPending
                  : apiOk
                    ? styles.statusOk
                    : styles.statusError
              }
            >
              {apiOk === null
                ? "Vérification en cours..."
                : apiOk
                  ? "API disponible"
                  : "API indisponible"}
            </span>
            <span className={styles.apiHint}>
              {apiOk === null
                ? "Connexion au backend en cours."
                : apiOk
                  ? "Le backend répond correctement."
                  : "Vérifiez que le serveur backend est démarré."}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function IconCheck() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCross() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconLoader() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.spinner}
    >
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}
