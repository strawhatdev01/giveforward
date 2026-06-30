import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.cause.count();
  if (existing > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  await prisma.cause.createMany({
    data: [
      {
        id: "musa-water",
        title: "Help Musa's community get clean water",
        org: "Kano State Community Trust",
        category: "Water",
        emoji: "💧",
        goal: 1000000,
        raised: 450000,
        donorCount: 147,
        daysLeft: 18,
        verified: true,
        story: "Musa's village in Kano State has walked over 4km daily for clean water for the past decade. This campaign funds a borehole and water pump serving over 500 families, giving children time to attend school instead of fetching water.",
        accountNumber: "9012345678",
        bankName: "Nomba MFB",
      },
      {
        id: "girls-scholarship",
        title: "Scholarship fund for 50 rural girls",
        org: "Educate Africa Initiative",
        category: "Education",
        emoji: "📚",
        goal: 1000000,
        raised: 720000,
        donorCount: 203,
        daysLeft: 9,
        verified: true,
        story: "Fifty girls across rural Kaduna and Niger states risk dropping out of secondary school due to unpaid fees. This fund covers a full academic year of tuition, books, and uniforms.",
        accountNumber: "9012345679",
        bankName: "Nomba MFB",
      },
      {
        id: "masjid-rebuild",
        title: "Rebuild Masjid Al-Noor — Lagos",
        org: "Lagos Muslim Community",
        category: "Mosque",
        emoji: "🕌",
        goal: 2000000,
        raised: 1200000,
        donorCount: 318,
        daysLeft: 25,
        verified: true,
        story: "Masjid Al-Noor was damaged in seasonal flooding and has been closed for repairs. This campaign rebuilds the prayer hall and ablution area so the community can return.",
        accountNumber: "9012345680",
        bankName: "Nomba MFB",
      },
    ],
  });

  await prisma.donation.createMany({
    data: [
      { id: "d1", causeId: "musa-water", donorName: "Ahmed", amount: 5000, reference: "GF-2026-08471", status: "confirmed" },
      { id: "d2", causeId: "musa-water", donorName: "Sarah A.", amount: 10000, reference: "GF-2026-08465", status: "confirmed" },
      { id: "d3", causeId: "musa-water", donorName: "Anonymous", amount: 2000, reference: "GF-2026-08452", status: "confirmed" },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
