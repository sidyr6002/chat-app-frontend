import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='h-screen flex justify-center items-center p-4 sm:p-6 bg-neutral-800'>
        <Outlet />
    </div>
  )
}

export default AuthLayout