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

      if (!ctx || !ctx.session.user.id) throw new Error("Unauthorized.");

      if (!input.content) throw new Error("No quote content provided.");

      if (input.replyTo) {
        const reply = await prisma?.quote.findFirst({
          where: {
            id: input.replyTo,
          },
        });

        if (!reply) throw new Error("No user found with this ID.");

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

        if (creation) return true;
        throw new Error("Error creating your reply.");
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

      if (creation) return true;
      throw new Error("Error creating your quote.");
    }),

  all: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx || !ctx.session.user.id) throw new Error("Unauthorized.");

    const quotes = await prisma?.quote.findMany({
      include: {
        likes: {},
        comments: {},
      },
    });

    if (quotes) return quotes;
  }),

  like: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!ctx || !ctx.session.user.id || !input)
      throw new Error("Unauthorized.");

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
        throw new Error("Error while performing this action.");
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
      throw new Error("Error while performing this action.");
    }

    const likeCount = await prisma?.like.count({
      where: {
        quoteId: input,
      },
    });
    return likeCount || 0;
  }),

  find: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!ctx || !ctx.session.user.id || !input)
      throw new Error("Could not find this quote.");

    const quote = await prisma?.quote.findFirst({
      where: {
        id: input,
      },
      include: {
        likes: {},
        comments: {
          include: {
            comments: {},
            author: {},
            likes: {},
            replyFrom: {},
          },
        },
      },
    });

    if (quote) return quote;
  }),
});
