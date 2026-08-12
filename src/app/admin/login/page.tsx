"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-surface border border-border p-8 rounded-xl shadow-sm"
      >
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-tight text-heading block mb-2">
            muse<span className="text-xl font-normal ml-2">by Kashish</span>
          </span>
          <p className="text-sm text-foreground/70 uppercase tracking-widest font-semibold">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@musebykashish.com" 
              required
              className="w-full px-4 py-3 bg-transparent border border-border rounded-md text-sm text-heading placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 py-3 bg-transparent border border-border rounded-md text-sm text-heading placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full hover:bg-primary-hover transition-colors uppercase disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
