
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface UserProblem {
    id: string;
    createdAt: Date;
    isCompleted: boolean;
    errorMessage: string;
    completedTestCases: number;
}

interface PreviousSubmissionsProps {
    submissions: UserProblem[];
}

export default function PreviousSubmissions({ submissions }: PreviousSubmissionsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed Test Cases</TableHead>
                    <TableHead>Error Message</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                        <TableCell>{submission.createdAt.toLocaleString()}</TableCell>
                        <TableCell>{submission.isCompleted ? "Completed" : "Failed"}</TableCell>
                        <TableCell>{submission.completedTestCases}</TableCell>
                        <TableCell>{submission.errorMessage || "N/A"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

