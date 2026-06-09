export type RecipientList = {
  id: string;
  label: string;
  emails: string[];
  count: number;
};

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
