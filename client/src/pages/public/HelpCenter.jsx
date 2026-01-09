import { useNavigate } from "react-router-dom";
import PublicLayout from "../../components/layout/PublicLayout";
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
        <PublicLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-4 py-8">
                    <span className="text-brand-600 font-semibold tracking-wide uppercase text-sm bg-brand-50 px-3 py-1 rounded-full">Support</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">How can we help you?</h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">Browse our frequently asked questions or contact support for further assistance.</p>
                </div>

                <div className="grid gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-100 transition-all duration-300 group">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">{faq.question}</h3>
                            <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-3xl p-8 md:p-12 text-center space-y-6 border border-brand-100">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900">Still need help?</h3>
                        <p className="text-gray-600 text-lg">Contact the IT department or visit the Printing Room (Room 101).</p>
                    </div>
                    <div className="pt-2 flex justify-center gap-4">
                        <Button onClick={() => navigate('/')} variant="primary" className="shadow-xl shadow-brand-500/20">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default HelpCenter;
