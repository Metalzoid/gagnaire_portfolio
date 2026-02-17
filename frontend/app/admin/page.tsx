"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/services/admin-api";
import { API_BASE_CLIENT } from "@/services/api-config";
import { Button } from "@/components/ui/button";
import styles from "./dashboard.module.scss";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    projects: number;
    skills: number;
    experience: number;
    testimonials: number;
  } | null>(null);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `${API_BASE_CLIENT}/api/health`,
      { signal: controller.signal },
    )
      .then((r) => r.ok)
      .then(setApiOk)
      .catch(() => setApiOk(false));

    Promise.all([
      adminApi.projects.list(),
      adminApi.skills.list(),
      adminApi.experience.list(),
      adminApi.testimonials.list(),
    ])
      .then(([projects, skills, exp, testimonials]) => {
        const skillCount = skills.reduce(
          (acc, cat) => acc + cat.skills.length,
          0,
        );
        setStats({
          projects: projects.length,
          skills: skillCount,
          experience: exp.length,
          testimonials: testimonials.length,
        });
      })
      .catch(() =>
        setStats({ projects: 0, skills: 0, experience: 0, testimonials: 0 }),
      );

    return () => controller.abort();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.sectionTitle}>Statistiques</h2>
      <div className={styles.grid}>
        <Link href="/admin/projects" className={styles.card}>
          <span className={styles.number}>{stats?.projects ?? "—"}</span>
          <span className={styles.label}>Projets</span>
        </Link>
        <Link href="/admin/skills" className={styles.card}>
          <span className={styles.number}>{stats?.skills ?? "—"}</span>
          <span className={styles.label}>Compétences</span>
        </Link>
        <Link href="/admin/experience" className={styles.card}>
          <span className={styles.number}>{stats?.experience ?? "—"}</span>
          <span className={styles.label}>Expériences</span>
        </Link>
        <Link href="/admin/testimonials" className={styles.card}>
          <span className={styles.number}>{stats?.testimonials ?? "—"}</span>
          <span className={styles.label}>Témoignages</span>
        </Link>
      </div>
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
      <h2 className={styles.sectionTitle}>État de l&apos;API</h2>
      <div className={styles.card}>
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
            ? "Vérification..."
            : apiOk
              ? "API disponible"
              : "API indisponible"}
        </span>
      </div>
    </div>
  );
}
