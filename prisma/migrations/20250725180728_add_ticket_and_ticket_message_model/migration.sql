-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'open';

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,
    "ticketId" TEXT NOT NULL,
    "authorEmail" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TicketMessage_ticketId_createdAt_idx" ON "TicketMessage"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
