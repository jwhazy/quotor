/* eslint-disable react/prop-types */
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { useState, useMemo } from "react";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "animate.css";
import "../styles/globals.css";
import AppContext from "../components/AppContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [refreshFeed, setRefreshFeed] = useState(false);

  const value = useMemo(
    () => ({ refreshFeed, setRefreshFeed }),
    [refreshFeed, setRefreshFeed]
  );

  return (
    <AppContext.Provider value={value}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AppContext.Provider>
  );
};

export default trpc.withTRPC(MyApp);
