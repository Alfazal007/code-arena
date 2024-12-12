import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Contest } from "./Contest";

interface ContestListProps {
    contests: Contest[];
    onAttemptProblem: (problemId: string) => void;
}

export function ContestList({ contests, onAttemptProblem }: ContestListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
                <Card key={contest.id} className="flex flex-col justify-between h-full max-w-sm mx-auto w-full">
                    <CardContent className="pt-6 px-6">
                        <h3 className="font-semibold mb-2 text-2xl">Contest {contest.id}</h3>
                        <p className="text-sm text-gray-600 font-semibold text-lg">
                            {contest.completed ? "Completed" : contest.started ? "In Progress" : "Not Started"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {contest.createdAt.toLocaleString()}
                        </p>
                    </CardContent>
                    <CardFooter className="pb-6 px-6">
                        {contest.started && !contest.completed && (
                            <Button
                                onClick={() => onAttemptProblem(contest.id)}
                                size="lg"
                            >
                                Attempt Problem
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}



