import { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import Editor from '@monaco-editor/react';
import axios from "axios";
import { UserContext } from '@/context/UserContext'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'
import Leaderbaord, { Leaderboard } from './Leaderboard'

interface CodingScreenProps {
    problemDescription: string;
    rustCode: string;
    jSCode: string;
    setRustCode: React.Dispatch<React.SetStateAction<string>>;
    setJSCode: React.Dispatch<React.SetStateAction<string>>;
    problemId: string;
    contestId: string;
    started: boolean;
    ended: boolean;
}

interface MyData {
    yourRank: number,
    yourPoints: number,
    yourId: string
}

export default function ContestCodingScreen({ contestId, started, ended, problemDescription, rustCode, jSCode, setRustCode, setJSCode }: CodingScreenProps) {
    const [language, setLanguage] = useState<'rust' | 'javascript'>('javascript')
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [myLeaderBoardStatus, setMyLeaderBoardStatus] = useState<MyData | null>(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [myDataPresent, setMyDataPresent] = useState(false);

    useEffect(() => {
        if (!user || !started) {
            navigate("/")
            return;
        }

        fetchLeaderBoardData();
    }, [])

    const fetchLeaderBoardData = async () => {
        const allLeaderBoardDataUrl = `http://localhost:3000/api/auth/leaderboard/getLeaderboardFifty/${contestId}`;
        const myLeaderBoardDataUrl = `http://localhost:3000/api/auth/leaderboard/getSpecificUser/${contestId}`;
        try {
            const getAllLeaderBoardData = await axios.get(allLeaderBoardDataUrl, {
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`,
                }
            });
            if (getAllLeaderBoardData.status == 200) {
                //  @ts-ignore
                setLeaderboard(getAllLeaderBoardData.data.data);
            }
            const getMyData = await axios.get(myLeaderBoardDataUrl, {
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`,
                }
            });
            if (getMyData.status == 200) {
                console.log({ getMyData })
                setMyDataPresent(true);
                // @ts-ignore
                const data: MyData = { yourId: "123", points: getMyData.data.data.points, rank: getMyData.data.data.rank }
                setMyLeaderBoardStatus(data);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const submitCode = async () => {
        setIsSubmitting(true);

        const submitContestUrl = `http://localhost:3000/api/auth/contest/submitSolution`;
        try {
            if (!user) {
                navigate("/");
                return;
            }
            const responseOfSubmission = await axios.post(submitContestUrl, {
                language,
                code: language == "rust" ? rustCode : jSCode,
                contestId
            }, {
                headers: {
                    'Authorization': `Bearer ${user?.accessToken}`,
                }
            });
            if (responseOfSubmission.status != 200) {
                toast({
                    title: "Issue submitting the problem",
                    variant: "destructive"
                });
                return;
            }
            toast({
                title: "Successfully submitted to the contest, check again later or refresh to check your status on the leaderboard section",
            })
        } catch (err) {
            toast({
                title: "Issue submitting the problem",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateCode(newCode: string) {
        if (language == "rust") {
            setRustCode(newCode);
        } else {
            setJSCode(newCode);
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/2 p-4 overflow-y-auto bg-white shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {showLeaderboard ? "Leaderboard" : "Problem Description"}
                    </h2>
                    {showLeaderboard ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowLeaderboard(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setShowLeaderboard(true)}
                        >
                            Leaderboard
                        </Button>
                    )}
                </div>
                {showLeaderboard ? (
                    <Leaderbaord leaderboard={leaderboard} isMyDataPresent={myDataPresent} yourPoints={myLeaderBoardStatus?.yourPoints || 0} yourRank={myLeaderBoardStatus?.yourRank || 0} yourId="123" />
                ) : (
                    <ReactMarkdown className="prose">{problemDescription}</ReactMarkdown>
                )}
            </div>

            <div className="w-1/2 p-4 bg-gray-800">
                <div className="mb-4">
                    <div className='flex items-center justify-between space-x-4'>
                        <Select
                            value={language}
                            onValueChange={(value) => setLanguage(value as 'rust' | 'javascript')}
                        >
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="rust">Rust</SelectItem>
                            </SelectContent>
                        </Select>
                        {!isSubmitting && !ended && started && <Button variant="default" onClick={submitCode} className="bg-blue-500 hover:bg-blue-600 text-white">Submit</Button>}
                    </div>
                </div>
                <div className="bg-white h-full rounded-md p-4">
                    <p className="text-gray-500">
                        <Editor
                            theme='vs-dark'
                            height="60vh"
                            options={{
                                fontSize: 20,
                                scrollBeyondLastLine: false
                            }}
                            language={language}
                            value={language == "rust" ? rustCode : jSCode}
                            onChange={(newValue) => { updateCode(newValue as string) }}
                        />
                    </p>
                </div>
            </div>
        </div>
    )
}
