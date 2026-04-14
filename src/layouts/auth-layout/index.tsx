import { Outlet } from "react-router";
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Cpu,
  GraduationCap,
  Lock,
  Mail,
  NotebookPen,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='relative min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex items-center justify-center p-4 md:p-8 overflow-hidden'>
      <style>{`
        @keyframes floaty { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(0,-18px,0) } }
        @keyframes drift { 0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(26px,-18px,0) } }
        @keyframes spinSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>

      {/* Animated icon background (login + register look through) */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />

        <Sparkles className="absolute left-[8%] top-[18%] h-8 w-8 text-indigo-200/40" style={{ animation: "floaty 7s ease-in-out infinite" }} />
        <Shield className="absolute left-[14%] top-[58%] h-9 w-9 text-slate-200/30" style={{ animation: "floaty 9s ease-in-out infinite" }} />
        <Cpu className="absolute left-[42%] top-[12%] h-10 w-10 text-cyan-200/30" style={{ animation: "drift 12s ease-in-out infinite alternate" }} />
        <Lock className="absolute left-[72%] top-[28%] h-9 w-9 text-indigo-200/25" style={{ animation: "floaty 8.5s ease-in-out infinite" }} />
        <Mail className="absolute left-[78%] top-[62%] h-10 w-10 text-slate-200/25" style={{ animation: "drift 14s ease-in-out infinite alternate" }} />
        <User className="absolute left-[52%] top-[74%] h-9 w-9 text-cyan-200/20" style={{ animation: "spinSlow 38s linear infinite" }} />

        {/* Study / journal / notes / calendar icons */}
        <BookOpen className="absolute left-[6%] top-[38%] h-10 w-10 text-slate-200/20" style={{ animation: "drift 16s ease-in-out infinite alternate" }} />
        <NotebookPen className="absolute left-[28%] top-[82%] h-9 w-9 text-indigo-200/20" style={{ animation: "floaty 10.5s ease-in-out infinite" }} />
        <CalendarDays className="absolute left-[88%] top-[18%] h-10 w-10 text-cyan-200/20" style={{ animation: "drift 18s ease-in-out infinite alternate" }} />
        <GraduationCap className="absolute left-[64%] top-[8%] h-9 w-9 text-slate-200/15" style={{ animation: "floaty 11.5s ease-in-out infinite" }} />
        <CheckSquare className="absolute left-[90%] top-[78%] h-9 w-9 text-indigo-200/15" style={{ animation: "floaty 12.5s ease-in-out infinite" }} />
      </div>

      <div className='relative z-10 w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-slate-900/35 backdrop-blur-xl'>
        <div className='rounded-3xl border border-white/5 bg-slate-950/35 p-6 sm:p-8 md:p-10 backdrop-blur'>
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
