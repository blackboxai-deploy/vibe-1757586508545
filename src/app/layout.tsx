import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaskFlow - Modern Task Management',
  description: 'A comprehensive task management dashboard built with Next.js and shadcn/ui',
  keywords: 'tasks, productivity, management, dashboard, kanban, todo',
  authors: [{ name: 'TaskFlow Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}