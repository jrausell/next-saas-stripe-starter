"use client";

import { useEffect, useState } from "react";
import { Tweet } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getXUserTweets, TweetsResponse } from "@/lib/query/x-user";

import { DraftTweetsColumn } from "./DraftTweetsColumn";
import { TweetsColumn } from "./TweetsColumn";
import { TweetSortOption } from "./TweetSort";
import { XUsersCombobox } from "./XUsersCombobox";

export function XUserDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<TweetSortOption>("newest");
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);

  // Reset when user or sort order changes
  useEffect(() => {
    if (selectedUserId) {
      refetch();
    }
  }, [selectedUserId, sortOrder]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<TweetsResponse>({
    queryKey: ["tweets", selectedUserId, sortOrder],
    queryFn: async ({ pageParam }) => {
      if (!selectedUserId) return { tweets: [] };
      return getXUserTweets(selectedUserId, {
        sortOrder,
        cursor: pageParam as string,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!selectedUserId,
  });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allTweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="max-w-lg">
          <div className="">
            <XUsersCombobox
              onSelect={(userId) => {
                setSelectedUserId(userId);
              }}
            />
          </div>
          {selectedUserId && (
            <TweetsColumn
              tweets={allTweets}
              selectedTweet={selectedTweet}
              onTweetSelect={setSelectedTweet}
              sortOrder={sortOrder}
              onSort={setSortOrder}
              queryResult={{ isLoading, isFetchingNextPage, hasNextPage }}
              loadMoreRef={loadMoreRef}
            />
          )}
        </div>

        <div className="max-w-lg">
          <DraftTweetsColumn inspirationTweet={selectedTweet} />
        </div>
      </div>
    </div>
  );
}
