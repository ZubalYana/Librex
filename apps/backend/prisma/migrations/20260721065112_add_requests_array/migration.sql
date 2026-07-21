-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requestedBookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestedBookId_fkey" FOREIGN KEY ("requestedBookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
