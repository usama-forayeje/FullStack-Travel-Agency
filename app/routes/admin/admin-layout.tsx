import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <div className="admin-layout">
      mobile Sidebar
      <aside className="w-full max-w-[270px] hidden lg:block">sidebar</aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}

export default AdminLayout;
