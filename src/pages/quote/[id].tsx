import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Quote from "../../components/Feed/Quote";
import Spinner from "../../components/Spinner";
import Trending from "../../components/panes/TrendingPane";
import WelcomePane from "../../components/panes/WelcomePane";

const QuotePage: NextPage = () => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
          <h2 className="px-4">Quote</h2>
          <div className="space-y-4">
            <h1>Not implemented!</h1>
          </div>
        </div>
        <div className="col-span-1 px-6 py-4">
          <Trending />
        </div>
      </div>
    </main>
  );
};

export default QuotePage;
