import { useLocation } from "wouter";
import AdminLogin from "@/components/AdminLogin";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
    
    if (email === "admin@skinlite.co" && password === "admin123") {
      alert("Login successful!");
      setLocation("/admin/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  return <AdminLogin onLogin={handleLogin} />;
}
