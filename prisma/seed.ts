import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.highlightItem.deleteMany();
  await prisma.dailyHighlight.deleteMany();
  await prisma.ritualReflection.deleteMany();
  await prisma.timerSession.deleteMany();
  await prisma.workingSession.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.weeklyObjective.deleteMany();
  await prisma.contextChannel.deleteMany();
  await prisma.context.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.integrationConnection.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const user = await prisma.user.create({
    data: {
      email: "demo@tempo.app",
      name: "Demo User",
      timezone: "America/New_York",
    },
  });

  // Create user settings
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      workingDays: [1, 2, 3, 4, 5],
      dailyPlanningTime: "08:30",
      dailyShutdownTime: "17:00",
      weeklyPlanningDay: 1,
      weeklyPlanningTime: "09:00",
      weeklyReviewDay: 5,
      weeklyReviewTime: "16:00",
    },
  });

  // Create channels
  const workChannel = await prisma.channel.create({
    data: {
      userId: user.id,
      name: "Work",
      colour: "#6366f1",
      type: "WORK",
      sortOrder: 0,
    },
  });

  const sideProjectChannel = await prisma.channel.create({
    data: {
      userId: user.id,
      name: "Side Project",
      colour: "#f59e0b",
      type: "WORK",
      sortOrder: 1,
    },
  });

  const personalChannel = await prisma.channel.create({
    data: {
      userId: user.id,
      name: "Personal",
      colour: "#10b981",
      type: "PERSONAL",
      sortOrder: 2,
    },
  });

  // Create contexts
  const workContext = await prisma.context.create({
    data: {
      userId: user.id,
      name: "Work",
      sortOrder: 0,
    },
  });

  const personalContext = await prisma.context.create({
    data: {
      userId: user.id,
      name: "Personal",
      sortOrder: 1,
    },
  });

  // Link channels to contexts
  await prisma.contextChannel.createMany({
    data: [
      { contextId: workContext.id, channelId: workChannel.id },
      { contextId: workContext.id, channelId: sideProjectChannel.id },
      { contextId: personalContext.id, channelId: personalChannel.id },
    ],
  });

  // Create tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Yesterday's tasks (some completed, some to roll over)
  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Review PR #142 - Auth refactor",
      channelId: workChannel.id,
      plannedMinutes: 30,
      actualMinutes: 25,
      status: "COMPLETED",
      scheduledDate: yesterday,
      sortOrder: 0,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Write API documentation for endpoints",
      channelId: workChannel.id,
      plannedMinutes: 60,
      status: "PLANNED",
      scheduledDate: yesterday,
      sortOrder: 1,
      rolloverCount: 1,
    },
  });

  // Today's tasks
  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Implement user dashboard layout",
      notes: "Focus on the three-panel structure. Check Figma for latest mocks.",
      channelId: workChannel.id,
      plannedMinutes: 90,
      status: "PLANNED",
      scheduledDate: today,
      sortOrder: 0,
      subtasks: {
        create: [
          { title: "Set up grid layout", sortOrder: 0 },
          { title: "Build sidebar component", sortOrder: 1 },
          { title: "Add responsive breakpoints", sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Team standup",
      channelId: workChannel.id,
      plannedMinutes: 15,
      status: "PLANNED",
      scheduledDate: today,
      sortOrder: 1,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Fix pagination bug in search results",
      channelId: workChannel.id,
      plannedMinutes: 45,
      status: "PLANNED",
      scheduledDate: today,
      sortOrder: 2,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Update project README",
      channelId: sideProjectChannel.id,
      plannedMinutes: 30,
      status: "PLANNED",
      scheduledDate: today,
      sortOrder: 3,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Grocery shopping",
      channelId: personalChannel.id,
      plannedMinutes: 45,
      status: "PLANNED",
      scheduledDate: today,
      sortOrder: 4,
    },
  });

  // Tomorrow's tasks
  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Design weekly review component",
      channelId: workChannel.id,
      plannedMinutes: 60,
      status: "PLANNED",
      scheduledDate: tomorrow,
      sortOrder: 0,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Exercise - morning run",
      channelId: personalChannel.id,
      plannedMinutes: 30,
      status: "PLANNED",
      scheduledDate: tomorrow,
      sortOrder: 1,
    },
  });

  // Backlog tasks (no scheduled date handled via far future or a specific status)
  // For now, backlog tasks use DEFERRED status
  await prisma.task.create({
    data: {
      userId: user.id,
      title: "Research analytics libraries",
      channelId: sideProjectChannel.id,
      plannedMinutes: 60,
      status: "DEFERRED",
      scheduledDate: new Date("2099-12-31"),
      sortOrder: 0,
    },
  });

  console.log("Seed completed successfully!");
  console.log(`  User: ${user.email} (${user.id})`);
  console.log(`  Channels: Work, Side Project, Personal`);
  console.log(`  Contexts: Work, Personal`);
  console.log(`  Tasks: 10 total (yesterday, today, tomorrow, backlog)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
