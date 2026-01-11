import { useNavigate } from "react-router-dom";
import PublicLayout from "../../components/layout/PublicLayout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            {/* 1️⃣ HERO SECTION */}
            <section className="relative py-20 lg:py-32 overflow-hidden text-center">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-brand-500 opacity-10 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500 opacity-10 blur-3xl animate-float"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 space-y-8 animate-fade-in">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4 border border-brand-100 shadow-sm">
                        <svg className="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Trusted by 500+ Schools & Colleges
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Smart Print Management <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                            for Modern Institutions
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Manage print requests, control permissions, and streamline workflows from one centralized, secure platform.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            onClick={() => navigate("/login")}
                            className="px-8 py-4 text-lg font-bold shadow-xl shadow-brand-500/20 bg-gradient-to-r from-brand-600 to-indigo-600 hover:scale-105 transition-transform"
                        >
                            Get Started Now
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 text-lg font-bold bg-white border border-gray-200 hover:bg-gray-50 hover:scale-105 transition-transform"
                        >
                            View Features
                        </Button>
                    </div>

                    {/* Dashboard Visual Placeholder */}
                    <div className="mt-16 rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden bg-gray-50 relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent z-10 lg:hidden"></div>
                        <div className="bg-gray-900/5 p-4 flex items-center gap-2 border-b border-gray-200/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 h-6 w-full max-w-xs bg-white rounded-md shadow-sm opacity-50"></div>
                        </div>
                        <div className="aspect-[16/9] bg-white flex items-center justify-center text-gray-400 font-medium">
                            <span className="group-hover:scale-110 transition-transform duration-500">
                                <svg className="h-20 w-20 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2 text-sm">Dashboard Interface Preview</p>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2️⃣ WHO IS IT FOR? */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                ),
                                title: "Schools & Colleges",
                                desc: "For effortless assignment submissions and exam paper management."
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                ),
                                title: "Companies & Firms",
                                desc: "Secure document handling with approval workflows for sensitive data."
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                ),
                                title: "Industries & Offices",
                                desc: "High-volume print tracking and cost optimization for large teams."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-white border border-gray-100/80 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                    <div className="group-hover:text-white transition-colors">{item.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3️⃣ THE PROBLEM */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <span className="text-brand-600 font-bold uppercase tracking-wider text-sm">The Challenge</span>
                        <h2 className="text-4xl font-bold text-gray-900">Stop Struggling with Manual Printing</h2>
                        <ul className="space-y-4">
                            {[
                                "No tracking of who printed what and when",
                                "Wasted paper and uncontrolled costs",
                                "Lack of approval workflows for important docs",
                                "Chaos in the print room with lost files"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg text-gray-700">
                                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Abstract Visual for Chaos */}
                    <div className="relative h-96 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-lg border border-red-100 flex items-center justify-center overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
                            <svg className="w-64 h-64 text-red-300" fill="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="text-center p-10 relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-red-100 max-w-xs">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chaos & Confusion</h3>
                            <p className="text-gray-500 text-sm">Lost files, unapproved prints, and wasted resources.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* 4️⃣ THE SOLUTION */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-brand-600 font-bold uppercase tracking-wider text-sm">Why PrintPortal?</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Everything You Need to Take Control</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Role-Based Access", desc: "Admin controls users, permissions, and approvals securely.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                            { title: "Centralized Requests", desc: "Users submit digital requests easily from anywhere.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
                            { title: "Print Dept. Panel", desc: "Dedicated interface to track, process, and complete jobs.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> },
                            { title: "Audit Trails", desc: "Every single print request is logged and trackable.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                        ].map((card, i) => (
                            <Card key={i} className="group hover:-translate-y-1 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-xl bg-white p-6">
                                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{card.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5️⃣ HOW IT WORKS */}
            <section className="py-20 bg-brand-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold">How PrintPortal Works</h2>
                        <p className="text-brand-200 mt-4 text-xl">Incredibly simple. Powerfully efficient.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                        {[
                            { step: "1", title: "Setup", desc: "Admin creates users roles & permissions." },
                            { step: "2", title: "Request", desc: "Teachers/Staff submit print files & details." },
                            { step: "3", title: "Process", desc: "Printing Dept. approves & prints the job." },
                            { step: "4", title: "Track", desc: "Everyone gets real-time status updates." }
                        ].map((s, i) => (
                            <div key={i} className="flex-1 text-center relative">
                                <div className="w-16 h-16 mx-auto rounded-full bg-brand-800 border-2 border-brand-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-glow">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                                <p className="text-brand-200/80">{s.desc}</p>
                                {i !== 3 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-brand-800 -z-10"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6️⃣ FEATURES SECTION */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold uppercase tracking-wider text-sm">Features</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Tailored for Every Role</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Admin */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">For Admins</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> User & Role Management</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Approval Workflows</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Usage Reporting</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Security Controls</li>
                            </ul>
                        </div>
                        {/* Users */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">For Employees</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 1-Click Request Submission</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Real-time Status Tracking</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Request History</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Mobile-Friendly Interface</li>
                            </ul>
                        </div>
                        {/* Print Dept */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">For Print Dept.</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Job Queue Management</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Priority Handling</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> One-Click Status Updates</li>
                                <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> File Preview before Printing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7️⃣ PRICING */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
                        <p className="text-gray-500 mt-4 text-lg">Choose the plan that fits your institution.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:border-brand-300 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900">Starter</h3>
                            <p className="text-gray-500 text-sm mt-1">Small schools / Teams</p>
                            <div className="my-6">
                                <span className="text-4xl font-bold text-gray-400 line-through">$49</span>
                                <span className="text-4xl font-bold text-brand-600 block">FREE</span>
                            </div>
                            <Button className="w-full mb-6" variant="secondary">Request Quote</Button>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Up to 100 Users</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Basic Reporting</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Email Support</li>
                            </ul>
                        </div>
                        {/* Pro */}
                        <div className="border-2 border-brand-500 rounded-2xl p-8 relative shadow-xl shadow-brand-500/10">
                            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                            <h3 className="text-xl font-bold text-gray-900">Professional</h3>
                            <p className="text-gray-500 text-sm mt-1">Colleges / Companies</p>
                            <div className="my-6">
                                <span className="text-4xl font-bold text-gray-400 line-through">$199</span>
                                <span className="text-4xl font-bold text-brand-600 block">FREE</span>
                            </div>
                            <Button className="w-full mb-6 shadow-lg shadow-brand-500/20">Get Started</Button>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Up to 1,000 Users</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Advanced Analytics</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Priority Support</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Custom Branding</li>
                            </ul>
                        </div>
                        {/* Enterprise */}
                        <div className="border border-gray-200 rounded-2xl p-8 hover:border-brand-300 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                            <p className="text-gray-500 text-sm mt-1">Large Organizations</p>
                            <div className="my-6">
                                <span className="text-4xl font-bold">Custom</span>
                            </div>
                            <Button className="w-full mb-6" variant="secondary" onClick={() => navigate("/contact-sales")}>Contact Sales</Button>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Unlimited Users</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Dedicated Manager</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> On-Premise Option</li>
                                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> SLA 99.9%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8️⃣ TRUST */}
            <section className="py-16 bg-gray-50 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-gray-500 font-semibold uppercase tracking-widest mb-8">Trusted by Education Leaders</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale">
                        {/* Mock Logos */}
                        <div className="text-2xl font-black text-gray-800">EDU<span className="text-brand-600">CORP</span></div>
                        <div className="text-2xl font-serif font-bold text-gray-800">Uni<span className="italic">Tech</span></div>
                        <div className="text-2xl font-mono font-bold text-gray-800">Global<span className="text-brand-600">School</span></div>
                        <div className="text-2xl font-bold text-gray-800 tracking-tighter">FUTURE<span className="font-light">ACADEMY</span></div>
                    </div>
                </div>
            </section>

            {/* 9️⃣ FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Is PrintPortal cloud-based?", a: "Yes! PrintPortal is fully cloud-based, meaning you can access it from any device without installing complex servers." },
                            { q: "Can workflows be customized?", a: "Absolutely. Admins can configure approval rules, user roles, and department settings to fit your specific needs." },
                            { q: "Is our data secure?", a: "Security is our priority. We use industry-standard encryption and role-based access control to protect your sensitive documents." },
                            { q: "Do you provide training?", a: "Yes, our Enterprise and Pro plans include dedicated onboarding sessions to get your team up and running quickly." }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-gray-50 p-6 rounded-xl cursor-pointer">
                                <summary className="flex justify-between items-center font-bold text-gray-900 list-none">
                                    {faq.q}
                                    <span className="transition-transform group-open:rotate-180">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🔟 FINAL CTA */}
            <section className="py-24 bg-brand-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-indigo-900 opacity-50"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl font-bold mb-6">Ready to Simplify Your Printing?</h2>
                    <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">Join hundreds of institutions that have switched to a smarter, more efficient workflow today.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => navigate("/login")}
                            className="px-8 py-4 text-lg font-bold shadow-xl shadow-brand-500/30 bg-white text-brand-900 hover:bg-gray-100 scale-100 hover:scale-105"
                        >
                            Get Started Free
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => navigate("/contact-sales")}
                            className="px-8 py-4 text-lg font-bold text-white border border-white/20 hover:bg-white/10"
                        >
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
};

export default LandingPage;
