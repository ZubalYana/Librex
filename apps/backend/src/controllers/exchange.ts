import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";
import { getResend } from "../utils/resend.js";

export async function requestExchange(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const resend = getResend();
    const userId = req.user?.userId;
    const bookId = req.params.bookId;

    const bookForExchange = await prisma.book.findUnique({
      where: { id: String(bookId) },
      include: { owner: true },
    });

    if (!bookForExchange) {
      res.status(404).json({ message: "Book for exchange not found" });
      return;
    }

    if (bookForExchange.ownerId === userId) {
      res
        .status(400)
        .json({ message: "You cannot request an exchange for your own book" });
      return;
    }

    const requester = await prisma.user.findUnique({
      where: { id: String(userId) },
      include: { books: true },
    });

    if (!requester) {
      res.status(404).json({ message: "Requester not found" });
      return;
    }

    await prisma.request.create({
      data: {
        requestedBookId: bookForExchange.id,
        requesterId: requester.id,
      },
    });

    const bookListHtml = requester.books
      .map((b) => `<li>${b.name} — ${b.author}</li>`)
      .join("");

    await resend.emails.send({
      from: "Librex <exchange@librex.pictureboooks.homes>",
      to: bookForExchange.owner.email,
      subject: `Exchange request for "${bookForExchange.name}"`,
      html: `
        <p><strong>${requester.name}</strong> (${
        requester.email
      }) wants to exchange for your book "<strong>${
        bookForExchange.name
      }</strong>".</p>
        <p>Their books available for exchange:</p>
        <ul>${bookListHtml || "<li>No books listed</li>"}</ul>
      `,
    });

    res.status(200).json({ message: "Exchange request sent and saved" });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error while requesting exchange";
    res.status(500).json({ message: message });
  }
}
