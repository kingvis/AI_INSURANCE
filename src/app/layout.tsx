import './globals.css';
import type { Metadata } from 'next';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'WishInsured - Global Financial Intelligence Platform',
  description: 'Smart Insurance, Investment Planning & Wealth Building',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <CurrencyProvider initialCountry="usa">
            {children}
          </CurrencyProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
