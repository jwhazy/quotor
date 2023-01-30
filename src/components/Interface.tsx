import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect, useState } from "react";
import Feed from "./panes/FeedPane";
import Spinner from "./Spinner";
import Trending from "./panes/TrendingPane";
import WelcomePane from "./panes/WelcomePane";

type Props = {
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
  requireAuth?: boolean;
};

const Interface = ({ requireAuth, leftPanel, rightPanel, children }: Props) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requireAuth && !session) {
      Router.push("/welcome");
    } else {
      setLoading(true);
    }
  }, [requireAuth, session]);

  if (!loading)
    return (
      <div className="grid h-screen place-items-center">
        <Spinner />
      </div>
    );

  return (
    <main className="px-2 pt-12 xl:px-24">
      <div className="grid grid-cols-3">
        <div className="col-span-1 space-y-4 border-r border-zinc-800 py-4 px-6">
          {leftPanel || <WelcomePane />}
        </div>
        <div className="col-span-1 space-y-4  border-r border-zinc-800 px-2 py-4">
          {children || <Feed />}
        </div>
        <div className="col-span-1 px-6 py-4">{rightPanel || <Trending />}</div>
      </div>
    </main>
  );
};

export default Interface;
