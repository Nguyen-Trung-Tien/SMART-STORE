import dayjs from "dayjs";

export function formatCurrency(value = 0, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value, pattern = "MMM D, YYYY") {
  if (!value) {
    return "--";
  }

  return dayjs(value).format(pattern);
}
