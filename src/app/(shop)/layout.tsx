import { AppShell } from '@/components/layout/AppShell';

export default function ShopLayout({ children }: LayoutProps<'/'>) {
  return <AppShell>{children}</AppShell>;
}
