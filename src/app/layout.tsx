import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LearnerProgressProvider } from '@/hooks/useLearnerProgress';
import { ThemeProvider } from '@/hooks/useTheme';
import { AppShell } from '@/components/layout/AppShell';

const THEME_INIT_SCRIPT = `(function(){try{var k='ai-llm-ed-center-theme';var s=localStorage.getItem(k);var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AI & LLM Engineering Education Center',
    template: '%s | AI & LLM Engineering Education Center',
  },
  description:
    'Interactive production AI & LLM engineering handbook covering foundational discipline, career roadmaps, 6-layer RAG/agent architecture, fine-tuning diagnostic gates, cross-cloud mapping, and portfolio verification.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink-primary antialiased">
        <ThemeProvider>
          <LearnerProgressProvider>
            <AppShell>{children}</AppShell>
          </LearnerProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
