import Logo from '@/components/Logo';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='h-screen grid grid-cols-1 lg:grid-cols-2'>
            
            <div className='relative hidden lg:flex flex-col justify-between p-10 text-white'>
                <div className='w-full h-[30%] bg-gradient-to-t from-transparent to-orange-700/50 absolute top-0 left-0 z-10'/>
                <div className='w-full h-[20%] bg-gradient-to-b from-transparent to-black/50 absolute bottom-0 left-0 z-10'/>

                <div className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: 'url(/images/bg-2.jpg)' }}>
                </div>

                
                <div className="relative z-20 flex items-center">
                    <Logo/>
                </div>

                <div className='relative z-20 mt-auto'>
                    <blockquote className='space-y-2'>
                        <p className='text-lg'>
                            &ldquo;For a long time i could'nt be able to get a headshot for my LinkedIn profile but with Kraven AI I have been able to generate high quality headshot within minutes. Thanks! Kraven.&rdquo;
                        </p>
                        <footer className='text-sm'>
                            John Doe
                        </footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex justify-center items-center p-8 relative flex-col h-full">
                {children}
            </div>
        </main>
    );
};

export default Layout;
