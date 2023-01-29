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
    <>
      <div
        className={
          (clsxm(
            "z-20 flex cursor-pointer flex-col space-y-2 rounded-xl px-4 py-2 hover:bg-zinc-900/80"
          ),
          quote.className)
        }
        onClick={expand}
      >
        {quote.replyFromId && typeof threadOrigin !== "string" && (
          <div className="flex cursor-pointer items-center space-x-2 px-2 hover:underline">
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
            <h5 className="text-sm font-light tracking-wide text-gray-200">
              {threadOrigin?.authorName}
            </h5>
            <p className="w-2/3 overflow-hidden text-ellipsis whitespace-nowrap text-sm italic text-gray-200">
              {threadOrigin?.content}
            </p>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Image
            src={
              quote.authorImage || "https://cdn.jacksta.dev/assets/newUser.png"
            }
            className="rounded-full"
            width={24}
            height={24}
            alt="Your profile picture"
          />
          <h5 className="font-light tracking-wide text-gray-200">
            {quote.authorName}
          </h5>
        </div>

        <p>{quote.content}</p>
        <div className="z-50 flex space-x-2">
          <Button onClick={() => sendLike()} className="z-50">
            {!liked ? (
              <HeartIcon className="w-5 cursor-pointer text-gray-200 duration-75" />
            ) : (
              <SolidHeartIcon className="animate__animated animate__zoomIn w-5 cursor-pointer text-red-400 duration-75" />
            )}

            <p>{likes}</p>
          </Button>
          <Button onClick={() => setShowCreateQuote(true)} className="z-50">
            <ChatBubbleLeftEllipsisIcon className="w-5 cursor-pointer text-gray-200 duration-75" />
            <p>{comments}</p>
          </Button>
        </div>
      </div>

      {showCreateQuote && (
        <CreateQuote previousQuote={quote} setShowModal={setShowCreateQuote} />
      )}
    </>
  );
};

export default Quote;
