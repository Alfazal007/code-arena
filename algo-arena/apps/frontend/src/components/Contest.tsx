import { UserContext } from '@/context/UserContext'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';
import { ContestList } from './ContestList';
import axios from "axios";
import { toast } from '@/hooks/use-toast';

export interface Contest {
    id: string;
    started: boolean;
    completed: boolean;
    problemId: string;
    createdAt: Date;
}

const Contest = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [contests, setContests] = useState<Contest[]>([]);

    useEffect(() => {
        if (!user) {
            navigate("/signin")
            return
        }
        getContests();
    }, [user])

    async function getContests() {
        const getContestsUrl = `http://localhost:3000/api/auth/contest/getContests`;
        const contestData = await axios.get(getContestsUrl, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
            }
        });
        if (contestData.status != 200) {
            toast({
                title: "Issue fetching contests"
            })
            navigate("/");
            return;
        }
        // @ts-ignore
        console.log(contestData.data.data);
        // @ts-ignore
        setContests(contestData.data.data);
    }

    function attemptProblem(contestId: string) {
        navigate(`/contest/${contestId}`);
        return
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-12 px-6 sm:px-12">
                <h1 className="text-2xl font-bold mb-6">Contests</h1>
                {contests.length > 0 &&
                    <ContestList contests={contests} onAttemptProblem={attemptProblem} />
                }
            </div>
        </>
    )
}

export default Contest
