import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowLeftOnRectangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

import Router from "next/router";
import { useEffect, useState } from "react";
import Button from "../components/Button";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionData?.user) {
      Router.push("/");
    } else {
      setLoading(true);
    }
  }, [sessionData]);

  if (!loading) return <div>Loading...</div>;
  return (
    <div className="grid h-screen place-items-center">
      <main className="mx-auto space-y-4 rounded-2xl px-8 py-10">
        <div>
          <h1>Quotor</h1>
          <p>Your new un-Elon&apos;d social network.</p>
        </div>
        <p className="font-medium">
          Get started by logging in with a provider below.
        </p>
        <div className="flex space-x-2 ">
          {!sessionData ? (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => signIn("github")}>
                <FontAwesomeIcon icon={faGithub} className="w-5" />
                <p>Log in with GitHub</p>
              </Button>
              <Button>
                <InformationCircleIcon className="w-5" />
                <p>Learn more</p>
              </Button>
            </div>
          ) : (
            <Button onClick={() => signOut()}>
              <ArrowLeftOnRectangleIcon className="w-5" />
              <p>Log out</p>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
