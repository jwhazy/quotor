import { Like, Quote as QuoteType } from "@prisma/client";
import { NextPage } from "next";
import Quote from "../Feed/Quote";

type QuoteProps = {
  likes: Like[];
  comments: QuoteType[];
} & QuoteType;

const Trending: NextPage = () => {
  const q: QuoteProps = {
    id: "null",
    authorId: "1",
    likes: [],
    comments: [],
    content:
      "Quotor, proof of concept social media network. Built with the T3 stack.",
    replyFromId: null,
    authorName: "jacksta",
    authorImage:
      "https://avatars.githubusercontent.com/u/63988891?v=4&w=48&q=75",
    createdOn: new Date(),
    updatedOn: new Date(),
  };
  return (
    <>
      <h2 className="px-4">What&apos;s trending?</h2>
      <div className="space-y-4">
        <Quote
          quote={q}
          disableComments={true}
          disableLikes={true}
          disableViewing={true}
        />
      </div>
    </>
  );
};

export default Trending;
