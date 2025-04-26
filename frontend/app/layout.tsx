import { AuthProvider } from '@/context/authContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Load Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO and page information
export const metadata: Metadata = {
  title: 'TypeWriter',
  description: 'Typing speed test application',
  icons: {
    icon: '/logo.png',
  },
  
};

// Root layout for the entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: 'dark' }} // Set initial color scheme to dark
    >
      <body className={inter.className}>
        {/* Provide authentication context to the entire app */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
