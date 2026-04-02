import { Link, Outlet } from "react-router";
import clientPaths from "@/paths/client";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-slate-900/75 backdrop-blur'>
        <div className='hidden lg:block lg:col-span-5 bg-slate-800 p-10 relative'>
          <div className='absolute inset-0 opacity-20 bg-cover bg-center' style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80)' }} />
          <div className='relative z-10 flex h-full flex-col justify-between text-slate-100'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>Chào mừng trở lại</h2>
              <p className='mt-3 text-base text-slate-300'>Đăng nhập hoặc đăng ký để tiếp tục sử dụng app quản lý PC một cách an toàn và mượt mà.</p>
            </div>
            <div />
          </div>
        </div>

        <div className='col-span-1 lg:col-span-7 p-6 sm:p-8 md:p-10 bg-slate-950/95'>
          <div className='mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-2xl font-extrabold md:text-3xl'>Quản lý đăng nhập</h1>
              <p className='text-sm text-slate-400'>Lựa chọn đăng nhập hoặc tạo tài khoản mới</p>
            </div>
            <div className='flex gap-2'>
              <Link
                to={clientPaths.auth.login.getPath()}
                className='rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800'
              >
                Login
              </Link>
              <Link
                to={clientPaths.auth.register.getPath()}
                className='rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400'
              >
                Register
              </Link>
            </div>
          </div>

          <div className='rounded-xl border border-white/10 bg-slate-900/70 p-2'>
            {children || <Outlet />}
          </div>

          <div className='mt-2' />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
