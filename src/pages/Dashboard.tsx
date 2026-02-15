import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScanLine, FileText, Trophy, History, ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const tools = [
    {
        title: "The Solver",
        description: "Upload a problem and get a step-by-step AI solution",
        icon: ScanLine,
        href: "/solver",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "The Synthesizer",
        description: "Upload documents and get AI-powered explanations",
        icon: FileText,
        href: "/synthesizer",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "The Quizzes",
        description: "Generate quizzes from your documents",
        icon: Trophy,
        href: "/quizzes",
        gradient: "from-amber-500 to-orange-500",
    },
];

export default function Dashboard() {
    const { data: session } = useSession();
    const userName = session?.user?.name || "Student";

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900">
                    Welcome back, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-gray-600 mt-2">
                    What would you like to study today?
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {tools.map((tool) => (
                    <Link key={tool.title} to={tool.href}>
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3`}>
                                    <tool.icon className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg font-heading flex items-center gap-2">
                                    {tool.title}
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{tool.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-heading">Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/history" className="flex items-center gap-1">
                            <History className="h-4 w-4" />
                            View All
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-medium text-gray-600 mb-2">No activity yet</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Start solving problems, synthesizing documents, or taking quizzes!
                        </p>
                        <Button asChild>
                            <Link to="/solver">
                                Get Started
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}