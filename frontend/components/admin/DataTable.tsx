"use client";

import { Button } from "@/components/ui/button";
import styles from "./DataTable.module.scss";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  editHref?: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  editHref,
  onEdit,
  onDelete,
  emptyMessage = "Aucun élément",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
            {(editHref || onEdit || onDelete) && (
              <th aria-label="Actions">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {(editHref || onEdit || onDelete) && (
                <td className={styles.actions}>
                  {(editHref || onEdit) && (
                    <Button
                      href={onEdit ? undefined : editHref?.(item)}
                      onClick={onEdit ? () => onEdit(item) : undefined}
                      variant="ghost"
                      size="sm"
                      ariaLabel="Modifier"
                    >
                      Modifier
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item)}
                      ariaLabel="Supprimer"
                    >
                      Supprimer
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
