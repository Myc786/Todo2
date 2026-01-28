import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DashboardContent from './dashboard-content'; // Client component for the interactive parts
import Header from '@/components/layout/header';
import MainContent from '@/components/layout/main-content';

export const metadata: Metadata = {
  title: 'Dashboard | Todo Application',
  description: 'Your Todo application dashboard',
};

// Server component that handles metadata and initial auth check
export default async function DashboardPage() {
  // Check if user is authenticated server-side
  // For now, we'll render the client component which will handle auth state
  // In a real app, you'd check the auth token server-side

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainContent>
        {/* Render the client component that handles auth state */}
        <DashboardContent />
      </MainContent>
    </div>
  );
}