"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, useUser, SignOutButton, UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: "/", label: "Library" },
  { href: "/books/new", label: "Add New" }
]

const Navbar = () => {
 const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. NOW you can check for loading/mounting
  // This prevents the hydration error AND follows the Rules of Hooks
  if (!mounted || !isLoaded) {
    return (
      <header className='w-full sticky z-50 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]'>
        <div className='wrapper navbar-height flex justify-between items-center'>
          <div className='flex gap-0.5 items-center'>
            <Image width={62} height={62} alt='Bookify' src={"/assets/logo.png"} />
          </div>

          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </header>
    );
  }

  return (
    <header className='w-full text-black sticky z-50 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]'>
      <div className='wrapper navbar-height flex justify-between items-center'>
        
        {/* Logo */}
        <Link href={"/"} className='flex gap-0.5 items-center'>
          <Image width={62} height={62} alt='Bookify' src={"/assets/logo.png"} />
        </Link>

        {/* Navigation */}
        <nav className='flex gap-6 md:gap-8 items-center h-20'>
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link 
                key={label} 
                href={href} 
                className={`nav-link-base ${isActive ? 'nav-link-active' : 'nav-btn'}`}
              >
                {label}
              </Link>
            )
          })}

          {/* Logic based on isSignedIn boolean */}
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="nav-btn cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div className="flex gap-2 justify-center items-center">
                <UserButton/>
              <Link href="/subscription" className="nav-user-link ">
                <span className="nav-user-name">
                  {user?.firstName || "User"}
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar