import type { Metadata } from 'next';
import './globals.css';
import ParticleBackground from '@/components/ui/ParticleBackground';

export const metadata: Metadata = {
  title: 'Perceptron Learning Simulator | Interactive AI Lab',
  description: 'Watch a single-layer Perceptron learn logic gates automatically. Interactive step-by-step training with live charts, animated weight updates, and mathematical explanations.',
  keywords: 'perceptron, neural network, machine learning, soft computing, AI education, logic gates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#050510] text-[#E8E8F0] antialiased">
        <ParticleBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
