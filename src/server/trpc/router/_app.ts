import { router } from "../trpc";
import { profileRouter } from "./profile";
import { quoteRouter } from "./quote";

export const appRouter = router({
  quote: quoteRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
