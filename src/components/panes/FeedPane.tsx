import { useContext, useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import AppContext from "../AppContext";
import Quote from "../Feed/Quote";

const Feed = () => {
  const { refreshFeed, setRefreshFeed } = useContext(AppContext);

  const { data: quotes, refetch: fetch } = trpc.quote.all.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: refreshFeed,
    onSuccess: () => {
      setRefreshFeed?.(false);
    },
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="space-y-4">
      {typeof quotes !== "string" ? (
        quotes
          ?.slice(0)
          .reverse()
          .map((q) => <Quote key={q.id} quote={q} />)
      ) : (
        <p>{quotes}</p>
      )}
    </div>
  );
};

export default Feed;
