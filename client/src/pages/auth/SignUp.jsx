import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

const SignUp = () => {
    const { signup } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const form = new FormData(e.target);
        const data = Object.fromEntries(form.entries());

        if (data.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            await signup(data);
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
                        Start your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-indigo-200">Journey.</span>
                    </h1>
                    <p className="text-lg text-brand-100/80 leading-relaxed font-light">
                        Create your organization today and streamline your document management workflow.
                        Free for now, forever efficient.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-sm font-medium text-brand-200/60">
                    <span>&copy; {new Date().getFullYear()} <Link to="https://github.com/sh1vam-03" className="hover:text-white transition-colors" target="_blank">PrintPortal</Link></span>
                    <span className="h-1 w-1 rounded-full bg-brand-500"></span>
                    <a href="/help" className="hover:text-white transition-colors">Help Center</a>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex w-full flex-col justify-center bg-white px-8 lg:w-1/2 lg:px-24 relative overflow-hidden">
                <div className="mx-auto w-full max-w-md relative z-10 animate-fade-in">

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                            Get Started Free
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Register your organization in seconds.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 shadow-sm">
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Organization Name</label>
                            <input
                                name="orgName"
                                type="text"
                                placeholder="Hogwarts School of Witchcraft"
                                className="w-full rounded-xl border-gray-200 bg-gray-50/30 px-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50"
                                required
                            />
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Administrator Name</label>
                            <input
                                name="adminName"
                                type="text"
                                placeholder="Albus Dumbledore"
                                className="w-full rounded-xl border-gray-200 bg-gray-50/30 px-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50"
                                required
                            />
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="headmaster@hogwarts.edu"
                                className="w-full rounded-xl border-gray-200 bg-gray-50/30 px-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50"
                                required
                            />
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border-gray-200 bg-gray-50/30 px-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full py-4 text-base font-semibold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-[0.98] transition-all bg-gradient-to-r from-brand-600 to-indigo-600"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Organization"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
