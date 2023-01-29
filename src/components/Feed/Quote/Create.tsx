import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Quote } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { SetStateAction, useState, Dispatch, useContext } from "react";
import { createPortal } from "react-dom";
import { trpc } from "../../../utils/trpc";
import AppContext from "../../AppContext";
import Button from "../../Button";

type Props = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  previousQuote?: Quote;
};

const CreateQuote = ({ setShowModal, previousQuote }: Props) => {
  const { data: session } = useSession();
  const { setRefreshFeed } = useContext(AppContext);

  const [content, setContent] = useState("");

  const { refetch: create } = trpc.quote.create.useQuery(
    { content, replyTo: previousQuote?.id },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: () => {
        setRefreshFeed?.(true);
        setShowModal(false);
      },
    }
  );

  return (
    <>
      {createPortal(
        <div className="animate__animated animate__fadeInTop   absolute inset-0 top-0 right-0 bottom-0 left-0 z-50 bg-black/50">
          <div className="m-24 flex justify-center">
            <div className=" min-h-[25%] w-1/2 space-y-2 rounded-xl bg-zinc-900/80 px-8 pb-6 pt-4 backdrop-blur-sm">
              {previousQuote ? (
                <div className="flex cursor-pointer items-center space-x-2 pl-4 hover:underline">
                  <Image
                    src={
                      previousQuote?.authorImage ||
                      "https://cdn.jacksta.dev/assets/newUser.png"
                    }
                    className="rounded-full"
                    width={18}
                    height={18}
                    alt="Your profile picture"
                  />
                  <h5 className="text-sm font-light tracking-wide text-gray-200">
                    {previousQuote?.authorName}
                  </h5>
                  <p className="w-2/3 overflow-hidden text-ellipsis whitespace-nowrap text-sm italic text-gray-200">
                    {previousQuote?.content}
                  </p>
                </div>
              ) : null}
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Image
                    src={
                      session?.user?.image ||
                      "https://cdn.jacksta.dev/assets/newUser.png"
                    }
                    className="h-max rounded-full"
                    width={64}
                    height={64}
                    alt="Your profile picture"
                  />

                  <textarea
                    placeholder="What's on your mind?"
                    onChange={(e) => setContent(e.target.value)}
                    className="h-max w-full resize-y rounded-xl bg-transparent px-4 py-2 text-xl text-white outline-0"
                  />
                </div>
                <div className="flex">
                  <Button onClick={() => create()}>
                    <PlusIcon className="w-5" />
                    <p>Post</p>
                  </Button>
                  <Button onClick={() => setShowModal(false)}>
                    <XMarkIcon className="w-5" />
                    <p>Close</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

  return null;
};

export default CreateQuote;
