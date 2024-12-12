import { UserContext } from "@/context/UserContext"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CodingScreen from "./CodingScreenDescription";
import { UserProblem } from "./PreviousSubmissions";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export const SingleProblem = () => {
    const { user } = useContext(UserContext);
    const { problemId } = useParams()
    const navigate = useNavigate();
    const [problemDescription, setProblemDescription] = useState<string>("");
    const [prevSubmissions, setPrevSubmissions] = useState<UserProblem[]>([]);
    const [rustCode, setRustCode] = useState("");
    const [jsCode, setJSCode] = useState("");
    const [startPolling, setStartPolling] = useState(false);
    const [submissionId, setSubmissionId] = useState("");

    async function getProblemAndPopulateData() {
        const problemFetchingUrl = `http://localhost:3000/api/auth/problems/getSingleProblem/${problemId}`;
        const resProblems = await axios.get(problemFetchingUrl, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
            }
        });
        if (resProblems.status != 200) {
            toast({
                title: "Issue fetching the problem data, try again later",
                variant: "destructive"
            });
            return;
        }
        console.log({ resProblems })
        // @ts-ignore
        setProblemDescription(resProblems.data.data.problemDescription);
        // @ts-ignore
        setPrevSubmissions(resProblems.data.data.userProblem)
        // @ts-ignore
        setRustCode(resProblems.data.data.halfCodeRust)
        // @ts-ignore
        setJSCode(resProblems.data.data.halfCodeJS)
    }

    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        getProblemAndPopulateData();
    }, []);

    useEffect(() => {
        if (startPolling) {
            toast({
                title: "Evaluating submission",
                description: "Wait for a few seconds while we are checking your solution"
            });
            const intervals = [2000, 6000, 12000];
            intervals.forEach((interval, index) => {
                setTimeout(async () => {
                    if (!startPolling) {
                        return;
                    }
                    await submissionUpdater();
                }, interval);
            })
        }
    }, [startPolling])


    async function submissionUpdater() {
        const checkSubmissionUrl = `http://localhost:3000/api/auth/problems/getProblemSubmissionById/${submissionId}`;
        const resProblems = await axios.get(checkSubmissionUrl, {
            headers: {
                'Authorization': `Bearer ${user?.accessToken}`,
            }
        });
        // @ts-ignore
        if (resProblems.data.data.isCompleted == true || resProblems.data.data.errorMessage) {
            setStartPolling(false);
            // @ts-ignore
            if (prevSubmissions.length > 0 && prevSubmissions[0].id == resProblems.data.data.id) {
                return;
            }
            // @ts-ignore
            setPrevSubmissions([resProblems.data.data, ...prevSubmissions])
        }
    }

    return (
        <>
            <CodingScreen setSubmissionId={setSubmissionId} setStartPolling={setStartPolling} problemId={problemId || ""} rustCode={rustCode} jSCode={jsCode} problemDescription={problemDescription} previousSubmissions={prevSubmissions} setRustCode={setRustCode} setJSCode={setJSCode} />
        </>
    )
}
