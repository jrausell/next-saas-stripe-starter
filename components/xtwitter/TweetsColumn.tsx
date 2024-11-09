"use client";

import { Tweet } from "@prisma/client";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { TweetsResponse } from "@/lib/query/x-user";

import { TweetSort, TweetSortOption } from "./TweetSort";

interface TweetsColumnProps {
  tweets: Tweet[];
  selectedTweet: Tweet | null;
  onTweetSelect: (tweet: Tweet) => void;
  sortOrder: TweetSortOption;
  onSort: (value: TweetSortOption) => void;
  queryResult: Pick<
    UseInfiniteQueryResult<TweetsResponse>,
    "isLoading" | "isFetchingNextPage" | "hasNextPage"
  >;
  loadMoreRef: (node?: Element | null) => void;
}

export function TweetsColumn({
  tweets,
  selectedTweet,
  onTweetSelect,
  sortOrder,
  onSort,
  queryResult: { isLoading, isFetchingNextPage, hasNextPage },
  loadMoreRef,
}: TweetsColumnProps) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted px-4 py-3">
        <h2 className="text-sm font-medium">User Tweets</h2>
        <TweetSort value={sortOrder} onSort={onSort} />
      </div>
      <div className="p-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : tweets.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No tweets found for this user
          </div>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard
                key={tweet.id.toString()}
                tweet={tweet}
                onClick={() => onTweetSelect(tweet)}
                isSelected={selectedTweet?.id === tweet.id}
              />
            ))}

            <div ref={loadMoreRef} className="mt-4">
              {isFetchingNextPage && <LoadingSpinner />}
            </div>

            {!hasNextPage && tweets.length > 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No more tweets to load
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

interface TweetCardProps {
  tweet: Tweet;
  onClick?: () => void;
  isSelected?: boolean;
}

function TweetCard({ tweet, onClick, isSelected }: TweetCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
        isSelected ? "border-primary bg-muted/50" : ""
      }`}
      onClick={onClick}
    >
      <p className="mb-2 text-sm text-muted-foreground">
        {new Date(tweet.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-sm">{tweet.full_text}</p>
      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
        <span>👁️ {tweet.views_count.toLocaleString()}</span>
        <span>🔁 {tweet.retweet_count.toLocaleString()}</span>
        <span>❤️ {tweet.favorite_count.toLocaleString()}</span>
        <span>💬 {tweet.reply_count.toLocaleString()}</span>
      </div>
    </div>
  );
}
