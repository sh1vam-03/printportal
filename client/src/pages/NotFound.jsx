import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
            <div className="flex max-w-lg flex-col items-center text-center">
                {/* 404 Icon / Illustration Placeholder */}
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 shadow-inner">
                    <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="mb-2 text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">
                    Page Not Found
                </h1>

                <p className="mb-8 text-lg text-gray-600">
                    Sorry, the page you are looking for doesn't exist or has been moved to another URL.
                </p>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </Button>

                    <Button
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </Button>
                </div>
            </div>

            <div className="mt-12 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Obzen Technolabs
            </div>
        </div>
    );
};

export default NotFound;
