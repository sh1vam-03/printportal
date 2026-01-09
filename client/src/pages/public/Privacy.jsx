import PublicLayout from "../../components/layout/PublicLayout";

const Privacy = () => {
    return (
        <PublicLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 md:p-16 space-y-10">
                    <div className="border-b border-gray-100 pb-8 text-center md:text-left">
                        <span className="text-brand-600 font-semibold tracking-wide uppercase text-xs mb-3 block">Legal Documents</span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                        <p className="text-gray-500 font-medium">Last updated: January 2026</p>
                    </div>

                    <div className="space-y-10 max-w-none prose prose-lg prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">1</span>
                                Information We Collect
                            </h2>
                            <p className="leading-relaxed text-gray-600 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                We collect basic account information (name, email) and the files you upload for printing.
                                These files are stored securely and are only accessible by you, the administrators, and the printing department staff.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">2</span>
                                How We Use Your Information
                            </h2>
                            <p className="leading-relaxed text-gray-600">
                                The documents you upload are used solely for the purpose of fulfilling your print requests.
                                We do not share your documents with any third parties. We value your privacy and trust above all else.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 text-sm font-bold">3</span>
                                Data Retention
                            </h2>
                            <p className="leading-relaxed text-gray-600">
                                Files are retained for a limited time to facilitate printing and record-keeping.
                                You may delete your pending/completed requests at any time. System purges occur automatically every 30 days for completed jobs.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default Privacy;
