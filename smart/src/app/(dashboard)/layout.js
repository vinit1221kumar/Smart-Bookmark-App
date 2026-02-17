import Navbar from '@/components/navbar/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="py-8">{children}</main>
    </div>
  );
}
