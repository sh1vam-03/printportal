import { Link, useNavigate } from "react-router-dom";

const AuthLayout = ({ title, subtitle, children }) => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen w-full bg-gray-50 font-sans">
            {/* Left Side - Hero & Brand */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-900 p-16 text-white lg:flex">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 -m-20 h-96 w-96 rounded-full bg-brand-500 opacity-20 blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 -m-20 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl animate-float"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 to-brand-950/90 backdrop-blur-sm z-0"></div>

                <div className="relative z-10" onClick={() => navigate('/')}>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-glow ring-1 ring-white/20">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Print<span className="text-brand-300 font-light">Portal</span></span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-brand-100/80 leading-relaxed font-light">
                        {subtitle}
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-sm font-medium text-brand-200/60">
                    <span>&copy; {new Date().getFullYear()} <Link to="https://github.com/sh1vam-03" className="hover:text-white transition-colors" target="_blank">PrintPortal</Link></span>
                    <span className="h-1 w-1 rounded-full bg-brand-500"></span>
                    <a href="/help" className="hover:text-white transition-colors">Help Center</a>
                    <span className="h-1 w-1 rounded-full bg-brand-500"></span>
                    <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                    <span className="h-1 w-1 rounded-full bg-brand-500"></span>
                    <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2 lg:px-24 relative overflow-hidden">
                {/* Mobile BG Decor */}
                <div className="absolute top-0 right-0 h-64 w-64 bg-brand-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 lg:hidden"></div>

                <div className="mx-auto w-full max-w-md relative z-10 animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
