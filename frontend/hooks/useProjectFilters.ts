"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Project } from "@/types";

// --------------------------------------------------------------------------
// Hook - Logique de filtrage projets + sync URL params
// --------------------------------------------------------------------------
export function useProjectFilters(projects: Project[]) {
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => {
    const tech = searchParams.get("tech");
    if (tech) {
      return new Set(
        tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      );
    }
    return new Set();
  });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => {
      p.technologies?.forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedTags.size === 0) return projects;
    return projects.filter((p) =>
      p.technologies?.some((t) => selectedTags.has(t)),
    );
  }, [projects, selectedTags]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedTags.size > 0) {
      params.set("tech", Array.from(selectedTags).join(","));
    } else {
      params.delete("tech");
    }
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [selectedTags, searchParams]);

  return {
    allTags,
    selectedTags,
    filteredProjects,
    toggleTag,
    clearFilters,
  };
}
