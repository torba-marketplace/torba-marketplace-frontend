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
      <main className="flex w-full flex-1 flex-col bg-white pb-20 md:pb-0">
        <Container className="flex flex-1 flex-col">{children}</Container>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
