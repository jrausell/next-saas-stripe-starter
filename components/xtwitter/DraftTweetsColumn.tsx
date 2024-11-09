"use client";

import React, { useState } from "react";
import { Tweet, TweetDraft } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Loader2, Pencil, Save, Trash, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

const MAX_TWEET_LENGTH = 280;

interface DraftTweetsColumnProps {
  inspirationTweet: Tweet | null;
}

export function DraftTweetsColumn({
  inspirationTweet,
}: DraftTweetsColumnProps) {
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // TODO: Replace with actual API call
  const { data: drafts, isLoading } = useQuery({
    queryKey: ["tweet-drafts"],
    queryFn: async () => [] as TweetDraft[], // Replace with actual API call
  });

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted px-4 py-3">
        <h2 className="text-sm font-medium">Draft Tweets</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Implement create new draft
            console.log("Create new draft", { inspirationTweet });
          }}
        >
          New Draft
        </Button>
      </div>
      <div className="p-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : !drafts?.length ? (
          <div className="text-center text-muted-foreground">
            No draft tweets yet. Create one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <DraftCard
                key={draft.id.toString()}
                draft={draft}
                isEditing={editingDraftId === draft.id.toString()}
                onEdit={() => setEditingDraftId(draft.id.toString())}
                onSave={() => setEditingDraftId(null)}
                onCancel={() => setEditingDraftId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface DraftCardProps {
  draft: TweetDraft;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

function DraftCard({
  draft,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: DraftCardProps) {
  const [editedContent, setEditedContent] = useState(draft.description);
  const [editedDate, setEditedDate] = useState<Date>(draft.date_to_post);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const characterCount = editedContent.length;
  const isOverLimit = characterCount > MAX_TWEET_LENGTH;

  const handleSave = async () => {
    if (isOverLimit) return;
    // TODO: Implement save mutation
    console.log("Saving draft:", {
      id: draft.id,
      description: editedContent,
      date_to_post: editedDate,
    });
    onSave();
  };

  if (isEditing) {
    return (
      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-between text-xs">
            <span
              className={
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              }
            >
              {characterCount}/{MAX_TWEET_LENGTH}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                {editedDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={editedDate}
                onSelect={(date) => {
                  if (date) {
                    setEditedDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isOverLimit}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Scheduled for {new Date(draft.date_to_post).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              // TODO: Implement delete
              console.log("Delete draft:", draft.id);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm">{draft.description}</p>
      {draft.tweetInspired_id && (
        <p className="text-xs text-muted-foreground">
          Inspired by tweet #{draft.tweetInspired_id}
        </p>
      )}
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
