import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";

export function formatMessageDate(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "HH:mm", { locale: fr });
  } else {
    return format(date, "MMM d", { locale: fr });
  }
}
