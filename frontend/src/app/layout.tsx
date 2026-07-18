import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import AppGuard from '../components/AppGuard';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Duolingo - Learn Languages Free',
  description: 'Duolingo Clone Web Application. Learn languages with bite-sized lessons, interactive exercises, achievements, and weekly leaderboards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased bg-white text-gray-800`}>
        <Providers>
          <AppGuard>
            {children}
          </AppGuard>
        </Providers>
      </body>
    </html>
  );
}
