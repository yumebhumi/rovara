export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));

export const formatDateRange = (start: string | Date, end: string | Date) =>
  `${formatDate(start)} – ${formatDate(end)}`;

export const durationInDays = (start: string | Date, end: string | Date) => {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};
