import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Quote from "../components/Feed/Quote";
import Spinner from "../components/Spinner";
import Trending from "../components/panes/TrendingPane";
import WelcomePane from "../components/panes/WelcomePane";
import { trpc } from "../utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "../components/Avatar";

const UserPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { user: name } = router.query;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, [session]);

  const user = trpc.profile.get.useQuery({ name: name?.toString() }).data;

  if (!loading || !user || typeof user !== "object")
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
        <div className="col-span-1 space-y-4  border-r border-zinc-800 px-6 py-4">
          <div className="space-y-4 ">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2>{user.name}</h2>
              <p>{user.id}</p>
            </div>
            <div>
              <h3>Quotes</h3>
              <div className="space-y-4">
                {typeof user.quotes !== "string" ? (
                  user.quotes
                    ?.slice(0)
                    .reverse()
                    .map((q) => <Quote key={q.id} quote={q} />)
                ) : (
                  <p>{user.quotes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 px-6 py-4">
          <Trending />
        </div>
      </div>
    </main>
  );
};

export default UserPage;
