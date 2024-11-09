"use server";

import { prisma } from "@/lib/db";
import { TweetSortOption } from "@/components/xtwitter/TweetSort";

export type XUserQueryParams = {
  search?: string;
  sortBy?: "username" | "created_at";
  sortOrder?: "asc" | "desc";
};

export type XUserBasic = {
  id: bigint;
  screen_name: string | null;
  name: string | null;
  profile_image_url: string | null;
};

export async function getXUsers({
  search = "",
  sortBy = "username",
  sortOrder = "asc",
}: XUserQueryParams = {}): Promise<XUserBasic[]> {
  try {
    const users = await prisma.xUser.findMany({
      where: {
        OR: [
          { screen_name: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: {
        [sortBy === "username" ? "screen_name" : "created_at"]: sortOrder,
      },
      select: {
        id: true,
        screen_name: true,
        name: true,
        profile_image_url: true,
      },
      take: 50,
    });

    return users;
  } catch (error) {
    console.error("Error fetching XUsers:", error);
    return [];
  }
}

interface GetXUserTweetsOptions {
  sortOrder?: TweetSortOption;
}

interface GetXUserTweetsOptions {
  sortOrder?: TweetSortOption;
  cursor?: string; // Using tweet id as cursor
  limit?: number;
}

export type TweetsResponse = {
  tweets: Awaited<ReturnType<typeof prisma.tweet.findMany>>;
  nextCursor?: string;
};

export async function getXUserTweets(
  userId: string,
  options: GetXUserTweetsOptions = {},
): Promise<TweetsResponse> {
  try {
    const { sortOrder = "newest", cursor, limit = 10 } = options;

    const tweets = await prisma.tweet.findMany({
      where: {
        user_id: BigInt(userId),
        ...(cursor
          ? {
              id: {
                [sortOrder === "newest" ? "lt" : "gt"]: BigInt(cursor),
              },
            }
          : {}),
      },
      orderBy: {
        created_at: sortOrder === "newest" ? "desc" : "asc",
      },
      take: limit + 1, // Take one extra to determine if there's a next page
      include: {
        media: true,
        hashtags: {
          include: {
            hashtag: true,
          },
        },
      },
    });

    let nextCursor: string | undefined;

    // If we got more tweets than the limit, we have a next page
    if (tweets.length > limit) {
      const nextItem = tweets.pop(); // Remove the extra item
      nextCursor = nextItem!.id.toString();
    }

    return {
      tweets,
      nextCursor,
    };
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return { tweets: [] };
  }
}
