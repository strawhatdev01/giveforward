import { prisma } from "./db";

export type Cause = {
  id: string;
  title: string;
  org: string;
  category: string;
  emoji: string;
  goal: number;
  raised: number;
  donorCount: number;
  daysLeft: number;
  verified: boolean;
  story: string;
  accountNumber: string;
  bankName: string;
};

export type Donation = {
  id: string;
  causeId: string;
  donorName: string;
  amount: number;
  timestamp: string;
  reference: string;
};

export async function getCauses(): Promise<Cause[]> {
  const causes = await prisma.cause.findMany({ orderBy: { createdAt: "desc" } });
  return causes.map((c) => ({ ...c, category: c.category }));
}

export async function getCause(id: string): Promise<Cause | null> {
  const c = await prisma.cause.findUnique({ where: { id } });
  if (!c) return null;
  return { ...c, category: c.category };
}

export async function getDonations(causeId?: string): Promise<Donation[]> {
  const where = causeId ? { causeId } : {};
  const donations = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return donations.map((d) => ({
    ...d,
    timestamp: timeAgo(d.createdAt),
  }));
}

export async function createDonation(data: {
  causeId: string;
  donorName: string;
  amount: number;
  email?: string;
  reference: string;
}) {
  const [donation] = await prisma.$transaction([
    prisma.donation.create({ data }),
    prisma.cause.update({
      where: { id: data.causeId },
      data: {
        raised: { increment: data.amount },
        donorCount: { increment: 1 },
      },
    }),
  ]);
  return donation;
}

export async function createCause(data: {
  title: string;
  org: string;
  category: string;
  emoji: string;
  goal: number;
  daysLeft: number;
  story: string;
  accountNumber: string;
  bankName: string;
}) {
  return prisma.cause.create({ data: { ...data, raised: 0, donorCount: 0, verified: true } });
}

export async function getStats() {
  const [totalRaised, totalDonors, causeCount] = await Promise.all([
    prisma.cause.aggregate({ _sum: { raised: true } }),
    prisma.cause.aggregate({ _sum: { donorCount: true } }),
    prisma.cause.count(),
  ]);
  return {
    totalRaised: totalRaised._sum.raised ?? 0,
    totalDonors: totalDonors._sum.donorCount ?? 0,
    causeCount,
  };
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
