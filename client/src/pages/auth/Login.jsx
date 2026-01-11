import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";

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
        <AuthLayout
            title={
                <>
                    Printing made <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-indigo-200">Effortless.</span>
                </>
            }
            subtitle="Experience the next generation of academic document management. Secure, fast, and continuously optimized for your productivity."
        >
            {/* Mobile Branding (Visible only on small screens inside AuthLayout's content area if needed, but AuthLayout handles desktop side) */}
            {/* AuthLayout's right side is purely the form container. We need to ensure mobile branding is here if AuthLayout doesn't handle it for mobile.
                AuthLayout structure:
                Desktop: Left (Hero) | Right (Children)
                Mobile: Right (Children) taking full width.
                So we should keep the mobile branding header here.
            */}

            <div className="flex lg:hidden items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 shadow-lg shadow-brand-500/20">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">Print<span className="text-brand-600 font-light">Portal</span></span>
            </div>

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

                <div className="mt-6 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                            Get Started Free
                        </Link>
                    </p>
                </div>
            </form>

            {/* Mobile Footer Links */}
            <div className="mt-12 lg:hidden flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-400">
                <span>&copy; {new Date().getFullYear()} <Link to="https://github.com/sh1vam-03" className="hover:text-brand-600 transition-colors" target="_blank">PrintPortal</Link></span>
                <a href="/help" className="hover:text-brand-600 transition-colors">Help Center</a>
                <a href="/privacy" className="hover:text-brand-600 transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-brand-600 transition-colors">Terms</a>
            </div>
        </AuthLayout>
    );
};

export default Login;
