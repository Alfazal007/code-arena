import { useContext, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import PreviousSubmissions from './PreviousSubmissions'
import Editor from '@monaco-editor/react';
import axios from "axios";
import { UserContext } from '@/context/UserContext'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'

interface UserProblem {
    id: string;
    createdAt: Date;
    isCompleted: boolean;
    errorMessage: string;
    completedTestCases: number;
}

interface CodingScreenProps {
    problemDescription: string;
    previousSubmissions: UserProblem[];
    rustCode: string;
    jSCode: string;
    setRustCode: React.Dispatch<React.SetStateAction<string>>;
    setJSCode: React.Dispatch<React.SetStateAction<string>>;
    problemId: string;
    setStartPolling: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmissionId: React.Dispatch<React.SetStateAction<string>>;
}

export default function CodingScreen({ setSubmissionId, setStartPolling, problemId, problemDescription, previousSubmissions, rustCode, jSCode, setRustCode, setJSCode }: CodingScreenProps) {
    const [language, setLanguage] = useState<'rust' | 'javascript'>('javascript')
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const submitCode = async () => {
        setIsSubmitting(true);

        const submitProblemUrl = `http://localhost:3000/api/auth/problems/submit`;
        try {
            if (!user) {
                navigate("/");
                return;
            }
            const responseOfSubmission = await axios.post(submitProblemUrl, {
                language,
                code: language == "rust" ? rustCode : jSCode,
                problemId
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
            // @ts-ignore
            setSubmissionId(responseOfSubmission.data.data.problemSubmissionId)
            setStartPolling(true);
            toast({
                title: "Successfully submitted problem",
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
                        {showSubmissions ? "Previous Submissions" : "Problem Description"}
                    </h2>
                    {showSubmissions ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSubmissions(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmissions(true)}
                        >
                            Previous Submissions
                        </Button>
                    )}
                </div>
                {showSubmissions ? (
                    <PreviousSubmissions submissions={previousSubmissions} />
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
                        {!isSubmitting && <Button variant="default" onClick={submitCode} className="bg-blue-500 hover:bg-blue-600 text-white">Submit</Button>}
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

