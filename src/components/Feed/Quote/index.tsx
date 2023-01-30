/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { Like, Quote as QuoteType } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { useState, useContext } from "react";
import clsxm from "../../../utils/clsxm";
import getTimeAgo from "../../../utils/timeAgo";

import { trpc } from "../../../utils/trpc";
import AppContext from "../../AppContext";
import Button from "../../Button";
import Input from "../../Input";
import CreateQuote from "./Create";

type Props = {
  likes: Like[];
  comments: QuoteType[];
  className?: string;
} & QuoteType;

const Quote = ({ quote }: { quote: Props }) => {
  const { data: session } = useSession();

  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [likes, setLikes] = useState(quote.likes.length || 0);
  const [comments, setComments] = useState(quote?.comments?.length || 0);
  const [liked, setLiked] = useState(() => {
    const like = quote.likes.find((l) => l.authorId === session?.user?.id);
    if (like) return true;
    return false;
  });

  const { refetch: sendLike } = trpc.quote.like.useQuery(quote.id, {
    refetchOnWindowFocus: false,
    enabled: false,
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
  return (
    <div className="h-48 w-full space-y-2 rounded-xl bg-slate-200/20 px-6 py-2">
      {quote.replyFromId && typeof threadOrigin !== "string" && (
        <div className="-mb-2 flex cursor-pointer items-center space-x-2 pl-16 text-gray-200 hover:underline">
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
      <div className="flex space-x-4 py-2 ">
        <div>
          <Image
            src={
              quote.authorImage || "https://cdn.jacksta.dev/assets/newUser.png"
            }
            className="rounded-full"
            width={54}
            height={54}
            alt="Your profile picture"
          />
        </div>
        <div>
          <h3>{quote.authorName}</h3>
          <p className="text-sm">{getTimeAgo(quote.createdOn)}</p>
        </div>
      </div>
      <div className="h-full w-full text-ellipsis whitespace-nowrap">
        <p>{quote.content}</p>
      </div>
    </div>
  );
};

export default Quote;
