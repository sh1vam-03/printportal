import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Left Side - Brand / Image */}
            <div className="hidden w-1/2 flex-col justify-between bg-indigo-600 p-12 text-white lg:flex">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-wide">SchoolPrint</span>
                    </div>
                </div>

                <div className="max-w-md">
                    <h1 className="mb-6 text-5xl font-bold leading-tight">
                        Manage School Printing Efficiently.
                    </h1>
                    <p className="text-lg text-indigo-100">
                        Streamline your document workflow with our centralized print management system. secure, fast, and reliable.
                    </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-indigo-200 hover:text-indigo-100 transition-colors">
                    <span>
                        &copy; {new Date().getFullYear()} <a href="https://github.com/sh1vam-03" target="_blank" rel="noopener noreferrer">sh1vam-03</a>
                    </span>
                    <span>•</span>
                    <span>Privacy Policy</span>
                    <span>•</span>
                    <span>Terms</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2 lg:px-24">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 animate-in slide-in-from-top-2">
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="name@school.edu"
                                    className="w-full rounded-lg border-gray-300 pl-11 pr-4 py-3 text-base shadow-sm ring-1 ring-gray-900/5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                />
                                <div className="pointer-events-none absolute left-0 top-1/2 flex h-full w-11 -translate-y-1/2 items-center justify-center text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border-gray-300 pl-11 pr-4 py-3 text-base shadow-sm ring-1 ring-gray-900/5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                />
                                <div className="pointer-events-none absolute left-0 top-1/2 flex h-full w-11 -translate-y-1/2 items-center justify-center text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Select Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full appearance-none rounded-lg border-gray-300 pl-11 pr-10 py-3 text-base shadow-sm ring-1 ring-gray-900/5 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white"
                                >
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="PRINTING">Printing Department</option>
                                </select>
                                <div className="pointer-events-none absolute left-0 top-1/2 flex h-full w-11 -translate-y-1/2 items-center justify-center text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full py-3 text-base shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 active:scale-[0.98]" disabled={loading} size="lg">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Running checks...
                                </span>
                            ) : (
                                "Sign In to Portal"
                            )}
                        </Button>
                    </form>
                    {/* Signup link removed */}
                </div>
            </div>
        </div>
    );
};

export default Login;
