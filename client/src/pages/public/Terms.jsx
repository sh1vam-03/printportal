import { useNavigate } from "react-router-dom";

const Terms = () => {
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                        <p className="text-gray-500">Effective Date: January 2026</p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed text-gray-600">
                            By accessing and using the School Print Portal, you agree to comply with and be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">2. Usage Policy</h2>
                        <p className="leading-relaxed text-gray-600">
                            This service is provided exclusively for school-related printing tasks.
                            Personal use or printing of copyrighted materials without permission is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">3. User Responsibilities</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                            <li>Ensure all uploaded files are free from viruses or malware.</li>
                            <li>Respect the print quota and resources of the institution.</li>
                            <li>Collect printed materials in a timely manner.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">4. Service Availability</h2>
                        <p className="leading-relaxed text-gray-600">
                            We strive to ensure the printing service is available during school hours. However, we are not liable for delays due to technical issues, maintenance, or resource shortages.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Terms;
