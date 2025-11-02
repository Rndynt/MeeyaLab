import AdminLogin from "../AdminLogin";

export default function AdminLoginExample() {
  return (
    <AdminLogin
      onLogin={(email, password) => console.log("Login:", { email, password })}
    />
  );
}
