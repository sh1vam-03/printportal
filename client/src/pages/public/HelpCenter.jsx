import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const HelpCenter = () => {
    const navigate = useNavigate();

    const faqs = [
        {
            question: "How do I submit a print request?",
            answer: "Go to 'New Request', fill in the details, upload your file (PDF/Image), and click Submit. You can track its status in the Dashboard."
        },
        {
            question: "What types of files are supported?",
            answer: "We support PDF, DOC, DOCX, JPG, and PNG files up to 10MB."
        },
        {
            question: "Can I cancel a request?",
            answer: "Yes, you can delete a request if it is still 'PENDING'. Once approved, you must contact the admin."
        },
        {
            question: "How do I know when my print is ready?",
            answer: "The status of your request will change to 'COMPLETED'. If you requested room delivery, it will be brought to you."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Public Header */}
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

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-8">
                <div className="text-center space-y-4 py-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">How can we help you?</h1>
                    <p className="text-lg text-gray-600">Browse our frequently asked questions or contact support.</p>
                </div>

                <div className="grid gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-brand-50 rounded-2xl p-8 text-center space-y-4">
                    <h3 className="text-xl font-bold text-brand-900">Still need help?</h3>
                    <p className="text-brand-700">Contact the IT department or visit the Printing Room (Room 101).</p>
                    <div className="pt-2">
                        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; 2024 School Print Portal. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span onClick={() => navigate('/privacy')} className="hover:text-brand-600 cursor-pointer transition-colors">Privacy Policy</span>
                        <span onClick={() => navigate('/terms')} className="hover:text-brand-600 cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;
