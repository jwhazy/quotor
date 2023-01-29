import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "../../components/Spinner";
import Trending from "../../components/panes/TrendingPane";
import WelcomePane from "../../components/panes/WelcomePane";
import Interface from "../../components/Interface";
import { trpc } from "../../utils/trpc";
import Quote from "../../components/Feed/Quote";

const QuotePage: NextPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const { id } = router.query;

  if (!id) return null;

  // find quote
  const quote = trpc.quote.find.useQuery(id as string).data;

  return (
    <Interface>
      <h1>Quote</h1>
      {quote && typeof quote !== "string" ? <Quote quote={quote} /> : null}
      {typeof quote !== "string" ? (
        quote?.comments
          ?.slice(0)
          .reverse()
          .map((q) => <Quote key={q.id} quote={q} />)
      ) : (
        <p>{quote}</p>
      )}
    </Interface>
  );
};

export default QuotePage;
