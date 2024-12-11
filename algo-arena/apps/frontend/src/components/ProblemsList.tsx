import { Button } from "@/components/ui/button"

interface Problem {
    id: string
    name: string
}

interface ProblemListProps {
    problems: Problem[]
    onAttemptProblem: (id: string) => void
}

export default function ProblemList({ problems, onAttemptProblem }: ProblemListProps) {
    return (
        <section className="w-full max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Problem List</h2>
            {problems.length === 0 ? (
                <p className="text-gray-500">No problems available.</p>
            ) : (
                <ul className="space-y-4">
                    {problems.map((problem) => (
                        <li key={problem.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                            <span className="text-lg">{problem.name}</span>
                            <Button
                                onClick={() => onAttemptProblem(problem.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Attempt Problem
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

