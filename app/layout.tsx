import type { Metadata } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from '@/lib/sw-register';

export const metadata: Metadata = {
  title: 'Aura Local AI Workspace',
  description: 'Privacy-first multimodal AI workspace running on-device in your browser.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="dot-grid bg-ink text-slate-100 antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
