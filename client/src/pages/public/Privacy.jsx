import { useNavigate } from "react-router-dom";

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-brand-600 cursor-pointer" onClick={() => navigate('/')}>
                        <svg className="h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>PrintPortal</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-8 text-gray-800">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
                    <div className="border-b border-gray-100 pb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-gray-500">Last updated: January 2026</p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
                        <p className="leading-relaxed text-gray-600">
                            We collect basic account information (name, email) and the files you upload for printing.
                            These files are stored securely and are only accessible by you, the administrators, and the printing department staff.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
                        <p className="leading-relaxed text-gray-600">
                            The documents you upload are used solely for the purpose of fulfilling your print requests.
                            We do not share your documents with any third parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">3. Data Retention</h2>
                        <p className="leading-relaxed text-gray-600">
                            Files are retained for a limited time to facilitate printing and record-keeping.
                            You may delete your pending/completed requests at any time.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Privacy;
