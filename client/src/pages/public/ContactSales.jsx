import PublicLayout from "../../components/layout/PublicLayout";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContactSales = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <PublicLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                    {!submitted ? (
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gray-900">Contact Sales</h2>
                                    <p className="mt-2 text-gray-600">
                                        Interested in our Enterprise plan or have specific requirements? Let's talk.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span>sales@printportal.com</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span>123 Innovation Dr, Tech City</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" required className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
                                    <input type="email" id="email" required className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none" placeholder="john@company.com" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" rows="4" required className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 transition-all outline-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <Button className="w-full shadow-lg shadow-brand-500/20 py-3">Send Message</Button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center py-16 space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Message Sent!</h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Thanks for reaching out. Our sales team will get back to you within 24 hours.
                            </p>
                            <Button onClick={() => navigate("/")} variant="secondary">Return Home</Button>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default ContactSales;
