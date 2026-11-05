import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Container } from '@/components/ui/Container';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-(--color-canvas)">
      <Header />
      <Container as="main" className="flex flex-1 flex-col pb-20 md:pb-0">
        {children}
      </Container>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
