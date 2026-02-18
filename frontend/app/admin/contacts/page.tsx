"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/contexts/ToastContext";
import type { ContactRequest } from "shared";
import styles from "./contacts.module.scss";

const STATUS_OPTIONS: { value: ContactRequest["status"]; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Traité" },
];

type FilterStatus = ContactRequest["status"] | "all";

export default function AdminContactsPage() {
  const toast = useToast();
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(
    null,
  );

  const load = useCallback(() => {
    adminApi.contacts
      .list()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems =
    filter === "all" ? items : items.filter((c) => c.status === filter);

  const handleStatusChange = useCallback(
    async (id: string, status: ContactRequest["status"]) => {
      try {
        const updated = await adminApi.contacts.updateStatus(id, status);
        setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
        if (selectedContact?.id === id) {
          setSelectedContact(updated);
        }
        toast.success("Statut mis à jour");
      } catch {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    },
    [toast, selectedContact],
  );

  const statusCellClass = (status: ContactRequest["status"]) => {
    const map: Record<ContactRequest["status"], string> = {
      pending: styles.statusPending,
      in_progress: styles.statusInProgress,
      done: styles.statusDone,
    };
    return `${styles.statusCell} ${map[status]}`;
  };

  const columns = [
    { key: "name", header: "Nom", render: (c: ContactRequest) => c.name },
    { key: "email", header: "Email", render: (c: ContactRequest) => c.email },
    {
      key: "createdAt",
      header: "Date",
      render: (c: ContactRequest) =>
        new Date(c.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "status",
      header: "Statut",
      render: (c: ContactRequest) => (
        <span
          className={statusCellClass(c.status)}
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <select
            className={styles.statusSelect}
            value={c.status}
            onChange={(e) =>
              handleStatusChange(c.id, e.target.value as ContactRequest["status"])
            }
            aria-label={`Statut de la demande de ${c.name}`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div className={styles.filters}>
          <span className={styles.filterLabel}>Statut :</span>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterStatus)}
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DataTable<ContactRequest>
          columns={columns}
          data={filteredItems}
          onRowClick={(c) => setSelectedContact(c)}
          emptyMessage="Aucune demande de contact"
        />
      )}
      <Modal
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title={selectedContact ? `Demande de ${selectedContact.name}` : undefined}
        size="md"
      >
        {selectedContact && (
          <div className={styles.detail}>
            <dl className={styles.detailList}>
              <div className={styles.detailRow}>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${selectedContact.email}`}>
                    {selectedContact.email}
                  </a>
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Date</dt>
                <dd>
                  {new Date(selectedContact.createdAt).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Statut</dt>
                <dd>
                  <select
                    className={styles.statusSelect}
                    value={selectedContact.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedContact.id,
                        e.target.value as ContactRequest["status"],
                      )
                    }
                    aria-label="Statut"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className={styles.detailRowMessage}>
                <dt>Message</dt>
                <dd className={styles.messageBlock}>{selectedContact.message}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
