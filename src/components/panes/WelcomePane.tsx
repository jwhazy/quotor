import {
  ArrowLeftOnRectangleIcon,
  Cog8ToothIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Button from "../Button";
import CreateQuote from "../Feed/Quote/Create";
import Link from "../Link";

const WelcomePane: NextPage = () => {
  const { data: session } = useSession();

  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div>
        <Link href="/">
          <h1>Quotor</h1>
          <p>Time for a new quote, perhaps?</p>
        </Link>
      </div>
      <div className="flex flex-col space-y-2">
        {showCreate && <CreateQuote setShowModal={setShowCreate} />}
        <Button onClick={() => setShowCreate(true)}>
          <PlusIcon className="w-5" />
          <p>Post</p>
        </Button>

        <Button onClick={() => signOut()}>
          <Cog8ToothIcon className="w-5" />
          <p>Settings</p>
        </Button>
        <Button onClick={() => signOut()}>
          <ArrowLeftOnRectangleIcon className="w-5" />
          <p>Log out</p>
        </Button>
      </div>

      <Button>
        <div className="flex items-center space-x-2">
          <Image
            src={
              session?.user?.image ||
              "https://cdn.jacksta.dev/assets/newUser.png"
            }
            className="rounded-full"
            width={24}
            height={24}
            alt="Your profile picture"
          />
          <h5 className="font-light tracking-wide text-gray-200">
            {session?.user?.name}
          </h5>
          <EllipsisHorizontalIcon className="w-5" />
        </div>
      </Button>
    </>
  );
};

export default WelcomePane;
