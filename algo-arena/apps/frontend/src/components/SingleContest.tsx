import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContestCodingScreen from "./ContestCodingScreen";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface ContestDataWithProblemData {
    id: string;
    started: boolean;
    completed: boolean;
    problemId: string;
    Problems: {
        id: string;
        testCases: number;
        name: string;
        halfCodeRust: string;
        halfCodeJS: string;
        problemDescription: string;
    };
}

export default function SingleContestScreen() {
    const [contest, setContest] = useState<ContestDataWithProblemData | null>(null);
    const { user } = useContext(UserContext);
    const { contestId } = useParams()
    const [jsCode, setJsCode] = useState("");
    const [rustCode, setRustCode] = useState("");
    const navigate = useNavigate()

    async function fetchContestData() {
        console.log("caled")
        const fetchContestDetailsUrl = `http://localhost:3000/api/auth/contest/getSingleContest/${contestId}`
        try {
            const contestFetchData = await axios.get(fetchContestDetailsUrl,
                {
                    headers: {
                        'Authorization': `Bearer ${user?.accessToken}`,
                    }
                }
            );
            if (contestFetchData.status != 200) {
                toast({
                    title: "Issue fetching contest data",
                    variant: "destructive"
                });
                navigate("/")
                return;
            }
            // @ts-ignore
            setContest(contestFetchData.data.data);
        } catch (err) {
            toast({
                title: "Issue fetching contest data",
                variant: "destructive"
            });
            navigate("/")
            return;
        }
    }

    useEffect(() => {
        if (contest) {
            if (contest.started == false || contest.completed == true) {
                navigate("/");
                return;
            }
            if (jsCode == "" && rustCode == "") {
                setJsCode(contest.Problems.halfCodeJS);
                setRustCode(contest.Problems.halfCodeRust);
            }
        }
    }, [contest])

    useEffect(() => {
        if (!user) {
            navigate("/")
            return;
        }
        fetchContestData()
    }, [])

    return (
        <>
            {
                contest &&
                <ContestCodingScreen
                    contestId={contest?.id}
                    jSCode={jsCode}
                    rustCode={rustCode}
                    problemId={contest.problemId}
                    problemDescription={contest.Problems.problemDescription}
                    setJSCode={setJsCode}
                    setRustCode={setRustCode}
                />
            }
        </>
    )
}
