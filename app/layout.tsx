

import { siteConfig } from '@/config/site';
import '@/app/globals.css';
import MainNav from '@/components/main-nav';
import { cn } from "@udecode/cn";
import fonts from '@/config/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Footer from '@/components/footer';
import { MotionConfig } from 'framer-motion';
import MotionConfigWrapper from '@/components/motion-config-wrapper';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning={true} className="">
        <head />
        <body className={cn('bg-background-50 text-text-900 no-scrollbar font-mono', fonts.madeTommyLight.className)}>

          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
           <MotionConfigWrapper>
              <MainNav items={siteConfig.mainNav} />

              <div className='md:p-5 '>

                {children}


              </div>
              <Footer />
              </MotionConfigWrapper>
          </ThemeProvider>

          <Analytics />

        </body>
      </html >
    </>
  )
}
