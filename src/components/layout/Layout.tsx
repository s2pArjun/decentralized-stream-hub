import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  connected: boolean;
}

export const Layout = ({ children, connected }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header connected={connected} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
