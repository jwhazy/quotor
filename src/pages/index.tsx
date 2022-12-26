import {
  ArrowLeftOnRectangleIcon,
  Cog8ToothIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Feed from "../components/panes/FeedPane";
import Quote from "../components/Feed/Quote";
import CreateQuote from "../components/Feed/Quote/Create";
import Spinner from "../components/Spinner";
import Trending from "../components/panes/TrendingPane";
import WelcomePane from "../components/panes/WelcomePane";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const [showCreate, setShowCreate] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      Router.push("/welcome");
    } else {
      setLoading(true);
    }
  }, [session]);

  if (!loading)
    return (
      <div className="grid h-screen place-items-center">
        <Spinner />
      </div>
    );

  return (
    <main className="px-24 pt-12">
      <div className="grid grid-cols-3">
        <div className="col-span-1 space-y-4 border-r border-zinc-800 py-4 px-6">
          <WelcomePane />
        </div>
        <div className="col-span-1 space-y-4  border-r border-zinc-800 px-2 py-4">
          <h2 className="px-4">Your Feed</h2>
          <Feed />
        </div>
        <div className="col-span-1 px-6 py-4">
          <Trending />
        </div>
      </div>
    </main>
  );
};

export default Home;
