import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface Leaderboard {
    leaderBoardId: string;
    points: number;
    rank: number;
}

interface LeaderboardProps {
    leaderboard: Leaderboard[];
    yourId: string;
    yourRank: number;
    yourPoints: number;
    isMyDataPresent: boolean
}

export default function Leaderbaord({ leaderboard, yourId, yourRank, yourPoints, isMyDataPresent }: LeaderboardProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Points</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    isMyDataPresent &&
                    <TableRow key={yourId + yourRank + yourPoints}>
                        <TableCell>{yourId}</TableCell>
                        <TableCell>{yourRank}</TableCell>
                        <TableCell>{yourPoints}</TableCell>
                    </TableRow>
                }
                {leaderboard.map((leaderboard) => (
                    <TableRow key={leaderboard.leaderBoardId}>
                        <TableCell>{leaderboard.leaderBoardId}</TableCell>
                        <TableCell>{leaderboard.rank}</TableCell>
                        <TableCell>{leaderboard.points}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
