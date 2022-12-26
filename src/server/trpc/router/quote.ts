import { randomInt } from "crypto";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const quoteRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  create: protectedProcedure
    .input(z.object({ content: z.string(), replyTo: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      console.log(ctx.session.user.id);

      if (!ctx || !ctx.session.user.id) return "error";

      if (!input.content) return "error";

      if (input.replyTo) {
        const reply = await prisma?.quote.findFirst({
          where: {
            id: input.replyTo,
          },
        });

        if (!reply) return "error";

        const creation = await prisma?.quote.create({
          data: {
            content: input.content,
            createdOn: new Date(),
            updatedOn: new Date(),
            author: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            replyFrom: {
              connect: {
                id: reply.id,
              },
            },

            likes: {},
          },
        });

        if (creation) return "success";
        return "error";
      }

      const creation = await prisma?.quote.create({
        data: {
          content: input.content,
          createdOn: new Date(),
          updatedOn: new Date(),
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          likes: {},
        },
      });

      if (creation) return "success";
      return "error";
    }),

  all: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx || !ctx.session.user.id) return "error";

    const quotes = await prisma?.quote.findMany({
      include: {
        likes: {},
        comments: {},
      },
    });

    if (quotes) return quotes;
  }),

  like: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!ctx || !ctx.session.user.id || !input) return "error";

    const liked = await prisma?.like.findFirst({
      where: {
        quoteId: input,
        authorId: ctx.session.user.id,
      },
    });

    if (liked?.authorId === ctx.session.user.id) {
      try {
        await prisma?.like.delete({
          where: {
            id: liked.id,
          },
        });
      } catch (error) {
        console.log(error);
        return "error";
      }

      const likeCount = await prisma?.like.count({
        where: {
          quoteId: input,
        },
      });

      return likeCount || 0;
    }

    try {
      await prisma?.like.create({
        data: {
          quote: {
            connect: {
              id: input,
            },
          },
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return "error";
    }

    const likeCount = await prisma?.like.count({
      where: {
        quoteId: input,
      },
    });
    return likeCount || 0;
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!ctx || !ctx.session.user.id || !input) return "error";

    const quote = await prisma?.quote.findFirst({
      where: {
        id: input,
      },
      include: {
        likes: {},
        comments: {},
      },
    });

    if (quote) return quote;
  }),
});
