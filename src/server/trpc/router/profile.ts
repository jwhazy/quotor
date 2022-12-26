import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const profileRouter = router({
  get: publicProcedure
    .input(z.object({ name: z.string().nullish(), id: z.string().nullish() }))
    .query(async ({ input }) => {
      if (input.name) {
        const user = await prisma?.user.findFirst({
          where: {
            name: input.name,
          },
          include: {
            quotes: {},
          },
        });

        if (!user) return "error";

        return user;
      }

      if (input.id) {
        const user = await prisma?.user.findFirst({
          where: {
            id: input.id,
          },
          include: {
            quotes: {},
          },
        });

        if (!user) return "error";

        return user;
      }
    }),
});
