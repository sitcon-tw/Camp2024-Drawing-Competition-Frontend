import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Spinner,
    getKeyValue,
} from "@nextui-org/react";
import { SubmissionData } from "../../../utils/fakeData";
import { useQuery } from "@tanstack/react-query";
import { ChallengeSubmissionType } from "../../../types/challenges";
import { useState } from "react";
import ViewSubmission from "./ViewSubmission";
import StatusChip from "./StatusChip";

interface TeamSubmissionsProps {
    challengeId: string;
}

export default function TeamSubmissions({ challengeId }: TeamSubmissionsProps) {
    const [viewingSubmission, setViewingSubmission] =
        useState<ChallengeSubmissionType | null>(null);

    const submissionQuery = useQuery({
        queryKey: ["submissions", challengeId],
        queryFn: () =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(SubmissionData);
                }, 3000);
            }).then((data: any) => {
                return data.map((sub: any) => ({
                    id: sub.id,
                    code: sub.code,
                    time: new Date(sub.time).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                    status: <StatusChip status={sub.status} />,
                    statusEnum: sub.status,
                    fitness: sub.status === "success" ? sub.fitness : "-",
                    wordCount: sub.status === "success" ? sub.wordCount : "-",
                    score: sub.status === "success" ? sub.score : "-",
                    execute_time:
                        sub.status === "success" ? sub.execute_time : "-",
                    stdout: sub.stdout,
                    stderr: sub.stderr,
                }));
            }),
        refetchInterval: 3000,
    });

    return (
        <>
            <h3 className="mt-4 mb-2 font-semibold">你的投稿</h3>
            <Table removeWrapper className="border rounded-md border-zinc-600">
                <TableHeader>
                    <TableColumn key="time">投稿時間</TableColumn>
                    <TableColumn key="status">執行狀態</TableColumn>
                    <TableColumn key="fitness">吻合度</TableColumn>
                    <TableColumn key="wordCount">程式字數</TableColumn>
                    <TableColumn key="score">分數</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={submissionQuery.isPending}
                    items={submissionQuery.data ?? []}
                    loadingContent={<Spinner label="Loading" />}
                >
                    {(item: any) => (
                        <TableRow
                            key={item.id}
                            className={`${item.statusEnum === "success" || item.statusEnum === "fail" ? "cursor-pointer" : ""}`}
                            onClick={() => {
                                if (
                                    item.statusEnum !== "success" &&
                                    item.statusEnum !== "fail"
                                )
                                    return;
                                setViewingSubmission(item);
                            }}
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {getKeyValue(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ViewSubmission
                subData={viewingSubmission}
                onClose={() => setViewingSubmission(null)}
            />
        </>
    );
}
