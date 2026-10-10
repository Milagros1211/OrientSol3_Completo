export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export function createBadge(text: string, variant: BadgeVariant = 'neutral', id?: string): HTMLElement {
  const badge = document.createElement('span');
  if (id) badge.id = id;
  badge.className = `badge badge-${variant}`;
  badge.textContent = text;
  return badge;
}
