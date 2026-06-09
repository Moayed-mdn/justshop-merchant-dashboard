/**
 * Lightweight UX event logger for merchant workspace instrumentation.
 *
 * Accumulates structured events in an in-memory buffer for the current session.
 * Individual events are visible in dev via logger.info; the session summary
 * is logged via logger.warn on beforeunload for production visibility.
 *
 * No external analytics SDK — practical, dependency-free measurement so the
 * team can assess whether navigation, loading, setup, and switching changes
 * (P0/P1/P2) are actually reducing friction.
 */

import { logger } from './logger';

export type UXEventName =
  | 'loader:fullscreen'
  | 'loader:soft'
  | 'redirect:bootstrap'
  | 'redirect:legacy-layout'
  | 'redirect:legacy-route'
  | 'switch:start'
  | 'switch:complete'
  | 'switch:failed'
  | 'provisioning:mount'
  | 'provisioning:complete'
  | 'setup:step-change';

export interface UXEvent {
  name: UXEventName;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

const MAX_EVENTS = 500;
const buffer: UXEvent[] = [];

let summaryLogged = false;

export function logUXEvent(name: UXEventName, metadata?: Record<string, unknown>): void {
  const event: UXEvent = { name, timestamp: Date.now(), metadata };
  buffer.push(event);

  if (buffer.length > MAX_EVENTS) buffer.shift();

  logger.info(`[UX] ${name}`, metadata);
}

export function getUXEvents(): readonly UXEvent[] {
  return buffer;
}

export function getUXSessionSummary(): string {
  const now = Date.now();
  if (buffer.length === 0) return 'No UX events recorded this session.';

  const fullscreen = buffer.filter((e) => e.name === 'loader:fullscreen');
  const soft = buffer.filter((e) => e.name === 'loader:soft');
  const redirects = buffer.filter(
    (e) => e.name === 'redirect:bootstrap' || e.name === 'redirect:legacy-layout' || e.name === 'redirect:legacy-route',
  );
  const switches = buffer.filter(
    (e) => e.name === 'switch:start' || e.name === 'switch:complete',
  );
  const switchDuration: number | null = (() => {
    const starts = buffer.filter((e) => e.name === 'switch:start');
    const completes = buffer.filter((e) => e.name === 'switch:complete');
    if (starts.length > 0 && completes.length > 0) {
      return completes[completes.length - 1].timestamp - starts[0].timestamp;
    }
    return null;
  })();
  const provisioning = buffer.filter(
    (e) => e.name === 'provisioning:mount' || e.name === 'provisioning:complete',
  );
  const provisioningDuration: number | null = (() => {
    const mount = buffer.find((e) => e.name === 'provisioning:mount');
    const complete = buffer.find((e) => e.name === 'provisioning:complete');
    if (mount && complete) return complete.timestamp - mount.timestamp;
    return null;
  })();

  const first = buffer[0].timestamp;
  const duration = ((now - first) / 1000).toFixed(1);

  const lines = [
    `UX Session Summary (${duration}s, ${buffer.length} events)`,
    `  Full-screen loaders:        ${fullscreen.length}`,
    `  Soft (in-shell) loaders:    ${soft.length}`,
    `  Legacy redirects:           ${redirects.length}`,
    `  Store switches:             ${switches.length > 0 ? Math.floor(switches.length / 2) : 0}`,
  ];

  if (switchDuration !== null) lines.push(`  Last switch duration:        ${switchDuration}ms`);
  if (provisioning.length > 0) {
    lines.push(`  Provisioning events:         ${provisioning.length}`);
    if (provisioningDuration !== null) lines.push(`  Provisioning duration:       ${provisioningDuration}ms`);
  }

  return lines.join('\n');
}

export function logUXSessionSummary(): void {
  if (summaryLogged) return;
  summaryLogged = true;
  const summary = getUXSessionSummary();
  if (buffer.length > 0) {
    logger.warn(summary);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => logUXSessionSummary(), { once: true });
  (window as unknown as Record<string, unknown>).__UX_EVENTS = buffer;
}

declare global {
  interface Window {
    __UX_EVENTS: readonly UXEvent[];
  }
}
