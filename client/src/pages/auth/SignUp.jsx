import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";

const SignUp = () => {
    const { signup } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState("STARTER");

    useEffect(() => {
        const planParam = searchParams.get("plan");
        if (planParam === "STARTER" || planParam === "PROFESSIONAL") {
            setSelectedPlan(planParam);
        }
    }, [searchParams]);

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
            let msg = "An error occurred. Please try again.";
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={
                <>
                    Start your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-indigo-200">Journey.</span>
                </>
            }
            subtitle="Create your organization today and streamline your document management workflow. Free for now, forever efficient."
        >
            {/* Mobile Branding */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 shadow-lg shadow-brand-500/20">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">Print<span className="text-brand-600 font-light">Portal</span></span>
            </div>

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

                <div className="space-y-2 group">
                    <label className="block text-sm font-medium text-gray-700 ml-1">Subscription Plan</label>
                    <div className="relative">
                        <select
                            name="subscriptionPlan"
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="w-full rounded-xl border-gray-200 bg-gray-50/30 px-4 py-3.5 text-base shadow-sm ring-1 ring-transparent transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 hover:bg-gray-50 appearance-none"
                            required
                        >
                            <option value="STARTER">Starter (Free - 20 Employees)</option>
                            <option value="PROFESSIONAL">Professional (Free - 100 Employees)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
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

export default SignUp;
