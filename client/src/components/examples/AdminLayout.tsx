import AdminLayout from "../AdminLayout";

export default function AdminLayoutExample() {
  return (
    <AdminLayout onLogout={() => console.log("Logout clicked")}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
        <p className="text-slate-600">This is where the admin content goes.</p>
      </div>
    </AdminLayout>
  );
}
