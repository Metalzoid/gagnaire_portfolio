"use client";

import { useState } from "react";
import { FormField } from "@/components/admin/FormField";
import { OrderableList } from "@/components/admin/OrderableList";
import { Button } from "@/components/ui/button";
import type { CVData, CVItem } from "./types";
import type { Experience, Project, SocialLink } from "shared";
import styles from "./CVEditForm.module.scss";

type SectionKey = "profile" | "links" | "experience" | "projects" | null;

interface CVEditFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
  className?: string;
}

export function CVEditForm({ data, onChange, className }: CVEditFormProps) {
  const [expandedSection, setExpandedSection] = useState<SectionKey>("profile");
  const [expandedExperienceId, setExpandedExperienceId] = useState<
    string | null
  >(null);

  const toggleSection = (key: SectionKey) => {
    setExpandedSection((s) => (s === key ? null : key));
  };

  const updateProfile = (updates: Partial<CVData["profile"]>) => {
    onChange({ ...data, profile: { ...data.profile, ...updates } });
  };

  const setSocial = (social: SocialLink[]) => {
    onChange({ ...data, profile: { ...data.profile, social } });
  };

  const setExperience = (experience: CVItem<Experience>[]) => {
    onChange({ ...data, experience });
  };

  const setProjects = (projects: CVItem<Project>[]) => {
    onChange({ ...data, projects });
  };

  const updateExperienceItem = (
    index: number,
    updates: Partial<CVItem<Experience>>,
  ) => {
    const next = [...data.experience];
    const current = next[index];
    if (updates.visible !== undefined) {
      next[index] = { ...current, visible: updates.visible };
    } else if (updates.data) {
      next[index] = { ...current, data: { ...current.data, ...updates.data } };
    } else {
      next[index] = { ...current, ...updates };
    }
    setExperience(next);
  };

  const updateProjectItem = (
    index: number,
    updates: Partial<CVItem<Project>>,
  ) => {
    const next = [...data.projects];
    next[index] = { ...next[index], ...updates };
    setProjects(next);
  };

  const { profile, experience, projects } = data;
  const social = profile.social ?? [];

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <h3 className={styles.sectionTitle}>Modifier avant génération</h3>

      {/* Identité */}
      <div className={styles.accordion}>
        <button
          type="button"
          className={`${styles.accordionTrigger} ${expandedSection === "profile" ? styles.expanded : ""}`}
          onClick={() => toggleSection("profile")}
          aria-expanded={expandedSection === "profile"}
        >
          Identité
        </button>
        <div
          className={`${styles.accordionPanel} ${expandedSection === "profile" ? styles.accordionPanelExpanded : ""}`}
        >
          <div className={styles.accordionContent}>
            <FormField
              label="Prénom"
              name="firstName"
              value={profile.firstName}
              onChange={(e) => updateProfile({ firstName: e.target.value })}
            />
            <FormField
              label="Nom"
              name="lastName"
              value={profile.lastName}
              onChange={(e) => updateProfile({ lastName: e.target.value })}
            />
            <FormField
              label="Titre / Rôle"
              name="role"
              value={profile.role}
              onChange={(e) => updateProfile({ role: e.target.value })}
            />
            <FormField
              type="textarea"
              label="Bio"
              name="bio"
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Liens */}
      <div className={styles.accordion}>
        <button
          type="button"
          className={`${styles.accordionTrigger} ${expandedSection === "links" ? styles.expanded : ""}`}
          onClick={() => toggleSection("links")}
          aria-expanded={expandedSection === "links"}
        >
          Liens
        </button>
        <div
          className={`${styles.accordionPanel} ${expandedSection === "links" ? styles.accordionPanelExpanded : ""}`}
        >
          <div className={styles.accordionContent}>
            <OrderableList<SocialLink>
              items={social.map((s, i) => ({ id: `link-${i}`, data: s }))}
              onReorder={(items) => setSocial(items.map((i) => i.data))}
              renderItem={({ data, id }) => {
                const idx = social.findIndex((_, i) => `link-${i}` === id);
                return (
                  <div className={styles.socialRow}>
                    <FormField
                      label="Label"
                      name={`social.${idx}.label`}
                      value={data.label}
                      onChange={(e) => {
                        const next = [...social];
                        next[idx] = {
                          ...next[idx],
                          label: (e.target as HTMLInputElement).value,
                        };
                        setSocial(next);
                      }}
                    />
                    <FormField
                      label="URL"
                      name={`social.${idx}.url`}
                      value={data.url}
                      onChange={(e) => {
                        const next = [...social];
                        next[idx] = {
                          ...next[idx],
                          url: (e.target as HTMLInputElement).value,
                        };
                        setSocial(next);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSocial(social.filter((_, i) => i !== idx))
                      }
                      ariaLabel="Supprimer le lien"
                    >
                      Suppr.
                    </Button>
                  </div>
                );
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSocial([...social, { label: "", url: "" }])}
              ariaLabel="Ajouter un lien"
              className={styles.addBtn}
            >
              + Ajouter un lien
            </Button>
          </div>
        </div>
      </div>

      {/* Expériences */}
      <div className={styles.accordion}>
        <button
          type="button"
          className={`${styles.accordionTrigger} ${expandedSection === "experience" ? styles.expanded : ""}`}
          onClick={() => toggleSection("experience")}
          aria-expanded={expandedSection === "experience"}
        >
          Expériences
        </button>
        <div
          className={`${styles.accordionPanel} ${expandedSection === "experience" ? styles.accordionPanelExpanded : ""}`}
        >
          <div className={styles.accordionContent}>
            {experience.length === 0 ? (
              <p className={styles.empty}>
                Aucune expérience. Ajoutez-en dans le menu Expériences.
              </p>
            ) : (
              <OrderableList<CVItem<Experience>>
                items={experience.map((e) => ({ id: e.id, data: e }))}
                onReorder={(items) => setExperience(items.map((i) => i.data))}
                renderItem={({ data: item }) => {
                  const idx = experience.findIndex((e) => e.id === item.id);
                  const exp = item.data;
                  const isExpanded = expandedExperienceId === item.id;
                  return (
                    <div className={styles.itemRow}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={(e) =>
                            updateExperienceItem(idx, {
                              visible: e.target.checked,
                            })
                          }
                          aria-label="Visible sur le CV"
                        />
                        <span className={styles.itemSummary}>
                          {exp.title}
                          {exp.company ? ` — ${exp.company}` : ""}
                        </span>
                      </label>
                      <button
                        type="button"
                        className={styles.expandBtn}
                        onClick={() =>
                          setExpandedExperienceId(isExpanded ? null : item.id)
                        }
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Réduire" : "Modifier"}
                      </button>
                      <div
                        className={`${styles.experiencePanel} ${isExpanded ? styles.experiencePanelExpanded : ""}`}
                      >
                        <div className={styles.experienceBlock}>
                          <FormField
                            label="Titre"
                            name={`exp-${idx}-title`}
                            value={exp.title}
                            onChange={(e) =>
                              updateExperienceItem(idx, {
                                data: {
                                  ...exp,
                                  title: (e.target as HTMLInputElement).value,
                                },
                              })
                            }
                          />
                          <FormField
                            label="Entreprise / École"
                            name={`exp-${idx}-company`}
                            value={exp.company ?? ""}
                            onChange={(e) =>
                              updateExperienceItem(idx, {
                                data: {
                                  ...exp,
                                  company: (e.target as HTMLInputElement).value,
                                },
                              })
                            }
                          />
                          <FormField
                            label="Description"
                            type="textarea"
                            name={`exp-${idx}-description`}
                            value={exp.description}
                            onChange={(e) =>
                              updateExperienceItem(idx, {
                                data: {
                                  ...exp,
                                  description: (e.target as HTMLTextAreaElement)
                                    .value,
                                },
                              })
                            }
                          />
                          <div className={styles.dateRow}>
                            <FormField
                              label="Début"
                              name={`exp-${idx}-start`}
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperienceItem(idx, {
                                  data: {
                                    ...exp,
                                    startDate: (e.target as HTMLInputElement)
                                      .value,
                                  },
                                })
                              }
                              placeholder="YYYY-MM"
                            />
                            <FormField
                              label="Fin"
                              name={`exp-${idx}-end`}
                              value={exp.endDate ?? ""}
                              onChange={(e) =>
                                updateExperienceItem(idx, {
                                  data: {
                                    ...exp,
                                    endDate:
                                      (e.target as HTMLInputElement).value ||
                                      null,
                                  },
                                })
                              }
                              placeholder="YYYY-MM ou vide"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Projets */}
      <div className={styles.accordion}>
        <button
          type="button"
          className={`${styles.accordionTrigger} ${expandedSection === "projects" ? styles.expanded : ""}`}
          onClick={() => toggleSection("projects")}
          aria-expanded={expandedSection === "projects"}
        >
          Projets
        </button>
        <div
          className={`${styles.accordionPanel} ${expandedSection === "projects" ? styles.accordionPanelExpanded : ""}`}
        >
          <div className={styles.accordionContent}>
            {projects.length === 0 ? (
              <p className={styles.empty}>
                Aucun projet. Ajoutez-en dans le menu Projets.
              </p>
            ) : (
              <OrderableList<CVItem<Project>>
                items={projects.map((p) => ({ id: p.id, data: p }))}
                onReorder={(items) => setProjects(items.map((i) => i.data))}
                renderItem={({ data: item }) => {
                  const idx = projects.findIndex((p) => p.id === item.id);
                  return (
                    <div className={styles.itemRow}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={(e) =>
                            updateProjectItem(idx, {
                              visible: e.target.checked,
                            })
                          }
                          aria-label="Visible sur le CV"
                        />
                        <span className={styles.itemSummary}>
                          {item.data.title}
                        </span>
                      </label>
                    </div>
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
