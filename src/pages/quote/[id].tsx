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

  // find quote
  const quote = trpc.quote.find.useQuery(id as string, {
    refetchOnWindowFocus: false,
    enabled: !!id?.length,
  }).data;

  return (
    <Interface>
      <h1>Quote</h1>
      {quote && typeof quote !== "string" ? <Quote quote={quote} /> : null}
      {typeof quote !== "string"
        ? quote?.comments.map((comment) => (
            <Quote key={comment.id} quote={comment} hideAuthor={true} />
          ))
        : null}
    </Interface>
  );
};

export default QuotePage;
