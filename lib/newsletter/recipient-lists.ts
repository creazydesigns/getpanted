export type RecipientList = {
  id: string;
  label: string;
  emails: string[];
  count: number;
};

type SubscriberLike = {
  email: string;
  source?: string | null;
};

export function buildRecipientLists(subscribers: SubscriberLike[]): RecipientList[] {
  const all = subscribers.map((s) => s.email.trim().toLowerCase()).filter(Boolean);

  const waitlist = subscribers
    .filter((s) => s.source === "waitlist")
    .map((s) => s.email.trim().toLowerCase())
    .filter(Boolean);

  const newsletter = subscribers
    .filter((s) => s.source !== "waitlist")
    .map((s) => s.email.trim().toLowerCase())
    .filter(Boolean);

  const lists: RecipientList[] = [];

  if (all.length) {
    lists.push({ id: "all", label: "All subscribers", emails: [...new Set(all)], count: new Set(all).size });
  }
  if (newsletter.length) {
    const unique = [...new Set(newsletter)];
    lists.push({ id: "newsletter", label: "Newsletter", emails: unique, count: unique.length });
  }
  if (waitlist.length) {
    const unique = [...new Set(waitlist)];
    lists.push({ id: "waitlist", label: "Waitlist", emails: unique, count: unique.length });
  }

  return lists;
}

export function resolveRecipients(
  selectedListIds: string[],
  manualEmails: string[],
  lists: RecipientList[]
): string[] {
  const fromLists = selectedListIds.flatMap(
    (id) => lists.find((l) => l.id === id)?.emails ?? []
  );
  const manual = manualEmails.map((e) => e.trim().toLowerCase()).filter(Boolean);
  return [...new Set([...fromLists, ...manual])];
}

export function recipientSummary(
  selectedListIds: string[],
  manualEmails: string[],
  lists: RecipientList[]
): number {
  return resolveRecipients(selectedListIds, manualEmails, lists).length;
}
