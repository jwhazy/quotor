/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { Like, Quote as QuoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { useState, useContext, useEffect } from "react";
import clsxm from "../../../utils/clsxm";
import getTimeAgo from "../../../utils/timeAgo";

import { trpc } from "../../../utils/trpc";
import AppContext from "../../AppContext";
import Button from "../../Button";
import Input from "../../Input";
import CreateQuote from "./Create";

type QuoteProps = {
  likes: Like[];
  comments: QuoteType[];
} & QuoteType;

type Props = {
  hideAuthor?: boolean;
  quote: QuoteProps;
  className?: string;
  disableLikes?: boolean;
  disableComments?: boolean;
  disableViewing?: boolean;
};

const Quote = ({
  hideAuthor,
  quote,
  className,
  disableComments,
  disableLikes,
  disableViewing,
}: Props) => {
  const { data: session } = useSession();

  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [likes, setLikes] = useState(quote.likes.length || 0);
  const [comments, setComments] = useState(quote?.comments?.length || 0);
  const [liked, setLiked] = useState(() => {
    const like = quote.likes.find((l) => l.authorId === session?.user?.id);
    if (like) return true;
    return false;
  });

  const {
    refetch: sendLike,
    error,
    isLoading,
  } = trpc.quote.like.useQuery(quote.id, {
    refetchOnWindowFocus: false,
    enabled: false,
    onError: (e) => console.log(e),
    onSuccess: (i) => {
      if (typeof i !== "number") return;

      setLiked(!liked);
      setLikes(i);
    },
  });

  const threadOrigin = trpc.quote.find.useQuery(quote.replyFromId || "", {
    refetchOnWindowFocus: false,
    enabled: !!quote.replyFromId,
  }).data;

  const expand = () => Router.push(`/quote/${quote.id}`);
  const expandOriginal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    Router.push(`/quote/${threadOrigin?.id}`);
  };

  return (
    <div
      className={clsxm(
        "flex cursor-pointer flex-col space-y-2 break-words rounded-xl px-6 py-2 hover:bg-slate-200/20",
        className
      )}
      onClick={!disableViewing ? expand : () => null}
    >
      {quote.replyFromId && !hideAuthor && typeof threadOrigin !== "string" && (
        <div
          className="-mb-2 flex cursor-pointer items-center space-x-2 pl-11 text-gray-200 hover:underline"
          onClick={expandOriginal}
        >
          <Image
            src={
              threadOrigin?.authorImage ||
              "https://cdn.jacksta.dev/assets/newUser.png"
            }
            className="rounded-full"
            width={18}
            height={18}
            alt="Your profile picture"
          />
          <h5 className="text-sm font-medium tracking-wide">
            {threadOrigin?.authorName}
          </h5>
          <p className="w-2/3 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal">
            {threadOrigin?.content}
          </p>
        </div>
      )}
      <div className=" space-y-3 py-2">
        <div className="flex  space-x-3 ">
          <div>
            <Image
              src={
                quote.authorImage ||
                "https://cdn.jacksta.dev/assets/newUser.png"
              }
              className="rounded-full"
              width={42}
              height={42}
              alt={`${quote.authorName}'s profile picture`}
            />
          </div>
          <div>
            <p className="font-medium">{quote.authorName}</p>
            <p className="text-xs">{getTimeAgo(quote.createdOn)}</p>
          </div>
        </div>
        <p>{quote.content}</p>

        <div className="z-50 flex space-x-2">
          {!disableLikes ? (
            <Button
              onClick={(e) => {
                if (e.stopPropagation) e.stopPropagation();
                sendLike();
              }}
              className="z-50"
            >
              {!liked ? (
                <HeartIcon className="w-5 cursor-pointer text-gray-200 duration-75" />
              ) : (
                <SolidHeartIcon className="animate__animated animate__zoomIn w-5 cursor-pointer text-red-400 duration-75" />
              )}

              <p>{likes}</p>
            </Button>
          ) : null}
          {!disableComments ? (
            <Button onClick={() => setShowCreateQuote(true)} className="z-50">
              <ChatBubbleLeftEllipsisIcon className="w-5 cursor-pointer text-gray-200 duration-75" />
              <p>{comments}</p>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Quote;
