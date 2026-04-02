import { FormEvent, useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(`Đăng nhập: ${email} | Ghi nhớ: ${remember ? 'Có' : 'Không'}`);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='mb-1 block text-sm font-medium text-slate-200' htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30'
          placeholder='example@gmail.com'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-200' htmlFor='password'>Mật khẩu</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30'
          placeholder='********'
        />
      </div>

      <div className='flex items-center justify-between'>
        <label className='flex items-center gap-2 text-sm text-slate-300'>
          <input type='checkbox' checked={remember} onChange={(e) => setRemember(e.target.checked)} className='h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500' />
          Ghi nhớ đăng nhập
        </label>
        <a href='#' className='text-sm text-indigo-300 hover:text-indigo-100'>Quên mật khẩu?</a>
      </div>

      <button type='submit' className='w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'>Đăng nhập</button>
    </form>
  );
};

export default LoginPage;
