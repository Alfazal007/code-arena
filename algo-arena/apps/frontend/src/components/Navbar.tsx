import { Home, PlusCircle, LogOut, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export default function Navbar() {
    const { setUser } = useContext(UserContext);
    const { toast } = useToast();
    const navigate = useNavigate()
    const handleLogout = async () => {
        setUser(null)
        toast({
            title: "Logged out successfully",
        })
        navigate('/signin')
    }

    return (
        <nav className="bg-background shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-foreground">Code Arena</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                            >
                                <Home className="mr-1 h-5 w-5" />
                                Home
                            </Link>
                            <Link
                                to="/contests"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                            >
                                <Trophy className="mr-1 h-5 w-5" />
                                Contest
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
