import { PrismaClient, JobType, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

const applications = [
  {
    companyName: 'Google',
    jobTitle: 'Software Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.INTERVIEWING,
    appliedDate: new Date('2026-05-20'),
    notes: 'Applied through referral. Phone screen completed.',
  },
  {
    companyName: 'Meta',
    jobTitle: 'Frontend Developer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.APPLIED,
    appliedDate: new Date('2026-06-01'),
    notes: 'Submitted via careers page.',
  },
  {
    companyName: 'Stripe',
    jobTitle: 'Backend Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.OFFER,
    appliedDate: new Date('2026-04-15'),
    notes: 'Received offer on June 10. Reviewing comp package.',
  },
  {
    companyName: 'Shopify',
    jobTitle: 'Full Stack Intern',
    jobType: JobType.INTERNSHIP,
    status: ApplicationStatus.REJECTED,
    appliedDate: new Date('2026-03-10'),
    notes: 'Rejected after technical interview.',
  },
  {
    companyName: 'Netflix',
    jobTitle: 'Senior Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.APPLIED,
    appliedDate: new Date('2026-06-10'),
  },
  {
    companyName: 'Airbnb',
    jobTitle: 'React Developer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.INTERVIEWING,
    appliedDate: new Date('2026-05-25'),
    notes: 'Onsite scheduled for next week.',
  },
  {
    companyName: 'Startup Inc',
    jobTitle: 'Part-time Developer',
    jobType: JobType.PART_TIME,
    status: ApplicationStatus.APPLIED,
    appliedDate: new Date('2026-06-12'),
  },
  {
    companyName: 'Microsoft',
    jobTitle: 'Cloud Engineer',
    jobType: JobType.FULL_TIME,
    status: ApplicationStatus.INTERVIEWING,
    appliedDate: new Date('2026-05-30'),
    notes: 'Completed first round. Waiting for feedback.',
  },
];

async function main() {
  console.log('Seeding database...');

  for (const app of applications) {
    await prisma.application.create({ data: app });
  }

  console.log(`Created ${applications.length} applications.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
