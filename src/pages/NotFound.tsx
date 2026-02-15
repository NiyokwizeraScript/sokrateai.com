import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center">
                <h1 className="text-8xl font-heading font-bold text-primary/20 mb-4">404</h1>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button asChild>
                    <Link to="/">
                        <Home className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}