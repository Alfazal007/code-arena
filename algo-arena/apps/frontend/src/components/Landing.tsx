import { UserContext } from '@/context/UserContext'
import { toast } from '@/hooks/use-toast';
import axios from "axios";
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProblemList from './ProblemsList';

const Landing = () => {
    const navigate = useNavigate()
    const [problems, setProblems] = useState<{ id: string, name: string }[]>([]);
    const { user } = useContext(UserContext)
    async function getProblems() {
        const getProblemsUrl = "http://localhost:3000/api/auth/problems/getProblems/0/50";
        const resProblems = await axios.get(getProblemsUrl, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
            }
        });
        if (resProblems.status != 200) {
            toast({
                title: "Error fetching problems",
                variant: "destructive"
            });
            return;
        }
        // @ts-ignore
        setProblems(resProblems.data.data)
    }

    async function attemptProblem(problemId: string) {
        navigate(`/problem/${problemId}`)
    }

    useEffect(() => {
        if (!user) {
            navigate("/signin")
            return
        }
        getProblems()

    }, [user])


    return (
        <>
            <ProblemList problems={problems} onAttemptProblem={attemptProblem} />
        </>
    )
}

export default Landing
