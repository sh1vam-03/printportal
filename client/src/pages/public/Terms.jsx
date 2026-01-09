import PublicLayout from "../../components/layout/PublicLayout";

const Terms = () => {
    return (
        <PublicLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 md:p-16 space-y-10">
                    <div className="border-b border-gray-100 pb-8 text-center md:text-left">
                        <span className="text-brand-600 font-semibold tracking-wide uppercase text-xs mb-3 block">Legal Documents</span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Terms of Service</h1>
                        <p className="text-gray-500 font-medium">Effective Date: January 2026</p>
                    </div>

                    <div className="space-y-10 max-w-none prose prose-lg prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">1</span>
                                Acceptance of Terms
                            </h2>
                            <p className="leading-relaxed text-gray-600 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                By accessing and using the School Print Portal, you agree to comply with and be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">2</span>
                                Usage Policy
                            </h2>
                            <p className="leading-relaxed text-gray-600">
                                This service is provided exclusively for school-related printing tasks.
                                Personal use or printing of copyrighted materials without permission is strictly prohibited. Violations may result in account suspension.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">3</span>
                                User Responsibilities
                            </h2>
                            <ul className="list-none space-y-4 pl-0">
                                <li className="flex gap-3 items-start">
                                    <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Ensure all uploaded files are free from viruses or malware.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Respect the print quota and resources of the institution.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Collect printed materials in a timely manner.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">4</span>
                                Service Availability
                            </h2>
                            <p className="leading-relaxed text-gray-600">
                                We strive to ensure the printing service is available during school hours. However, we are not liable for delays due to technical issues, maintenance, or resource shortages.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default Terms;
