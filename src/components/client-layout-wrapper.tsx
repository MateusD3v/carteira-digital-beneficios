'use client';

import { OfflineIndicator } from './offline-indicator';
import { Toaster } from './ui/toaster';

export function ClientLayoutWrapper() {
  return (
    <>
      <OfflineIndicator />
      <Toaster />
    </>
  );
}