import DashboardView from '../../components/DashboardView';

export const metadata = {
  title: "Dashboard - Registry UI",
  description: "Manage your Docker registry images and settings."
};

export default function Dashboard() {
  return <DashboardView />;
}