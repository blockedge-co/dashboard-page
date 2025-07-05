import { ComprehensiveDashboard } from '@/components/comprehensive-dashboard';
import { MainLayout } from '@/components/main-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comprehensive Dashboard - BlockEdge Carbon Credits',
  description: 'Complete carbon credit analytics dashboard with retirement tracking, tokenization metrics, and project distribution',
  keywords: ['carbon credits', 'comprehensive dashboard', 'retirement tracking', 'tokenization', 'blockchain analytics'],
};

export default function ComprehensivePage() {
  return (
    <MainLayout>
      <ComprehensiveDashboard />
    </MainLayout>
  );
}