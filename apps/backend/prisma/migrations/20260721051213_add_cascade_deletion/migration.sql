-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
