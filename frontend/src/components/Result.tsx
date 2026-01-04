"use client";
import { IVoteResult } from "@/interfaces";
import { useEffect, useState } from "react";

export default function Result(
  { voteResult }: { voteResult: IVoteResult | null }
) {
  const [topVotes, setTopVotes] = useState<string[] | null>(null);

  useEffect(() => {
    if (!voteResult || voteResult.votes.length === 0) {
      setTopVotes(null);
      return;
    }

    let maxCount = 0;
    let topVotes: string[] = [];
    voteResult.votes.forEach(([vote, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topVotes = [vote];
      } else if (count === maxCount) {
        topVotes.push(vote);
      }
    });
    setTopVotes(topVotes);
  }, [voteResult]);

  return (
    <div className="">
      {topVotes &&
        <div className="flex flex-row items-center justify-center">
          { topVotes.map((vote) => {
            return (
              <div
                key={vote}
                className="flex items-center justify-center rounded-lg outline-2 outline-gray-400 bg-white w-16 h-24 m-2 text-2xl font-bold text-black"
              >
                {vote}
              </div>
            );
          })}
        </div>
      }
    </div>
  )
}