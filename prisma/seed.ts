import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@restaurant.com" },
    update: {},
    create: {
      email: "admin@restaurant.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create cooker user
  const cookerPassword = await bcrypt.hash("cooker123", 10);
  const cooker = await prisma.user.upsert({
    where: { email: "cooker@restaurant.com" },
    update: {},
    create: {
      email: "cooker@restaurant.com",
      name: "Cooker User",
      password: cookerPassword,
      role: "COOKER",
      careerPath: {
        create: {
          position: "หัวหน้าพนักงานครัว",
          salary: 25000,
          improvementPoints: 100,
          level: 2,
        },
      },
    },
  });

  // Create categories
  const category1 = await prisma.category.upsert({
    where: { id: "cat-1" },
    update: {},
    create: {
      id: "cat-1",
      name: "เมนูแนะนำ",
      nameEn: "Recommended",
      sortOrder: 1,
    },
  });

  const category2 = await prisma.category.upsert({
    where: { id: "cat-2" },
    update: {},
    create: {
      id: "cat-2",
      name: "อาหารจานหลัก",
      nameEn: "Main Course",
      sortOrder: 2,
    },
  });

  // Create menus
  await prisma.menu.upsert({
    where: { id: "menu-1" },
    update: {},
    create: {
      id: "menu-1",
      name: "ข้าวผัด",
      nameEn: "Fried Rice",
      description: "ข้าวผัดสุดอร่อย",
      price: 120,
      categoryId: category1.id,
    },
  });

  await prisma.menu.upsert({
    where: { id: "menu-2" },
    update: {},
    create: {
      id: "menu-2",
      name: "ผัดไทย",
      nameEn: "Pad Thai",
      description: "ผัดไทยสไตล์ไทยแท้",
      price: 150,
      categoryId: category1.id,
    },
  });

  // Create sample tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.upsert({
      where: { tableNumber: `A${i}` },
      update: {},
      create: {
        tableNumber: `A${i}`,
        qrCode: `QR-TABLE-A${i}-${Date.now()}`,
        capacity: 4,
      },
    });
  }

  console.log("Seeding completed!");
  console.log("\nDefault users:");
  console.log("Admin: admin@restaurant.com / admin123");
  console.log("Cooker: cooker@restaurant.com / cooker123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

