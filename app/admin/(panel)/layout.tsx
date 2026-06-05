import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminToastProvider } from "@/components/admin/admin-toast";
import "../admin.css";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <AdminToastProvider>
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-main">{children}</main>
        </div>
      </AdminToastProvider>
    </div>
  );
}
