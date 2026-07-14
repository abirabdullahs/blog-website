import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata();

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
