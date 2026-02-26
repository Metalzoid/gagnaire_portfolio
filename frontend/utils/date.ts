const FRENCH_MONTHS: Record<string, string> = {
  "01": "Jan",
  "02": "Fév",
  "03": "Mar",
  "04": "Avr",
  "05": "Mai",
  "06": "Juin",
  "07": "Juil",
  "08": "Août",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Déc",
};

/** Format court mois-année (ex. "Jan 2024") pour labels timeline */
export function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const monthLabel = FRENCH_MONTHS[month] || month;
  return `${monthLabel} ${year}`;
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
  current: boolean,
): string {
  const [year, month] = startDate.split("-");
  const start = `${FRENCH_MONTHS[month] || month} ${year}`;
  const end = current
    ? "Présent"
    : endDate
      ? (() => {
          const [ey, em] = endDate.split("-");
          return `${FRENCH_MONTHS[em] || em} ${ey}`;
        })()
      : "";
  return end ? `${start} - ${end}` : start;
}
