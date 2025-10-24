import './admin.css';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
