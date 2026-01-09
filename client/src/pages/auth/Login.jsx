import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Link from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [role, setRole] = useState("TEACHER");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());

        try {
            await login(data);
        } catch (err) {
            const msg = err.response?.data?.message || "An error occurred. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-gray-50 font-sans">
            {/* Left Side - Hero & Brand */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-900 p-16 text-white lg:flex">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 -m-20 h-96 w-96 rounded-full bg-brand-500 opacity-20 blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 -m-20 h-96 w-96 rounded-full bg-indigo-500 opacity-20 blur-3xl animate-float"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 to-brand-950/90 backdrop-blur-sm z-0"></div>

                <div className="relative z-10">
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
                        Printing made <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-indigo-200">Effortless.</span>
                    </h1>
                    <p className="text-lg text-brand-100/80 leading-relaxed font-light">
                        Experience the next generation of academic document management.
                        Secure, fast, and continuously optimized for your productivity.
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

            {/* Right Side - Login Form */}
            <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2 lg:px-24 relative overflow-hidden">
                {/* Mobile BG Decor */}
                <div className="absolute top-0 right-0 h-64 w-64 bg-brand-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 lg:hidden"></div>

                <div className="mx-auto w-full max-w-md relative z-10 animate-fade-in">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Sign in to access your print dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 animate-slide-up shadow-sm">
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1 transition-colors group-focus-within:text-brand-600">Email Address</label>
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@school.edu"
                                    className="w-full rounded-xl border-gray-200 bg-gray-50/30 pl-12 pr-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50"
                                    required
                                />
                                <div className="pointer-events-none absolute left-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1 transition-colors group-focus-within:text-brand-600">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border-gray-200 bg-gray-50/30 pl-12 pr-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50"
                                    required
                                />
                                <div className="pointer-events-none absolute left-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1 transition-colors group-focus-within:text-brand-600">I am a...</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full appearance-none rounded-xl border-gray-200 bg-gray-50/30 pl-12 pr-10 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50 cursor-pointer"
                                >
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="PRINTING">Printing Staff</option>
                                </select>
                                <div className="pointer-events-none absolute left-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center text-gray-400 group-focus-within:text-brand-500 transition-colors">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full py-4 text-base font-semibold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-[0.98] transition-all bg-gradient-to-r from-brand-600 to-indigo-600"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Checking credentials...
                                    </span>
                                ) : (
                                    "Sign In to Portal"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
