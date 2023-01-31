import { type NextPage } from "next";
import Feed from "../components/panes/FeedPane";
import Interface from "../components/Interface";
import Popup from "../components/Popup";

const Home: NextPage = () => {
  return (
    <Interface>
      <Feed />
    </Interface>
  );
};

export default Home;
