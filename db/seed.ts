import { db } from './index';
import { customers, deals, activities } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.delete(activities);
  await db.delete(deals);
  await db.delete(customers);

  // Seed customers
  const customerData = [
    {
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      position: 'CEO',
      status: 'active',
      value: 125000,
      source: 'website',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-01-20',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-15',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@innovate.com',
      phone: '+1 (555) 234-5678',
      company: 'Innovate Inc',
      position: 'CTO',
      status: 'prospect',
      value: 85000,
      source: 'referral',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b407?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-01-19',
      assignedTo: 'Sarah Miller',
      createdAt: '2024-01-18',
    },
    {
      name: 'Michael Brown',
      email: 'm.brown@globaltech.com',
      phone: '+1 (555) 345-6789',
      company: 'Global Tech',
      position: 'VP of Sales',
      status: 'active',
      value: 250000,
      source: 'cold-call',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-01-21',
      assignedTo: 'Mike Johnson',
      createdAt: '2024-01-10',
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@startup.io',
      phone: '+1 (555) 456-7890',
      company: 'Startup Ventures',
      position: 'Marketing Director',
      status: 'prospect',
      value: 45000,
      source: 'email',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-01-22',
      assignedTo: 'Lisa Chen',
      createdAt: '2024-01-22',
    },
    {
      name: 'David Wilson',
      email: 'david.w@enterprise.com',
      phone: '+1 (555) 567-8901',
      company: 'Enterprise Solutions',
      position: 'Founder',
      status: 'active',
      value: 180000,
      source: 'referral',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-01-20',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-12',
    },
  ];

  const insertedCustomers = await db.insert(customers).values(customerData).returning();
  console.log(`✅ Inserted ${insertedCustomers.length} customers`);

  // Seed deals
  const dealData = [
    {
      title: 'Q1 Software License Renewal',
      customerId: insertedCustomers[0].id,
      customerName: insertedCustomers[0].company,
      value: 125000,
      stage: 'negotiation',
      probability: 85,
      expectedCloseDate: '2024-02-15',
      description: 'Annual enterprise license renewal',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-15',
    },
    {
      title: 'Digital Transformation Project',
      customerId: insertedCustomers[1].id,
      customerName: insertedCustomers[1].company,
      value: 85000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: '2024-02-28',
      description: 'Complete digital transformation initiative',
      assignedTo: 'Sarah Miller',
      createdAt: '2024-01-18',
    },
    {
      title: 'Enterprise Security Suite',
      customerId: insertedCustomers[2].id,
      customerName: insertedCustomers[2].company,
      value: 250000,
      stage: 'qualification',
      probability: 40,
      expectedCloseDate: '2024-03-15',
      description: 'Comprehensive security solution',
      assignedTo: 'Mike Johnson',
      createdAt: '2024-01-10',
    },
    {
      title: 'Startup Package Deal',
      customerId: insertedCustomers[3].id,
      customerName: insertedCustomers[3].company,
      value: 45000,
      stage: 'prospecting',
      probability: 25,
      expectedCloseDate: '2024-03-30',
      description: 'Starter package for growing startups',
      assignedTo: 'Lisa Chen',
      createdAt: '2024-01-22',
    },
    {
      title: 'Cloud Migration Services',
      customerId: insertedCustomers[4].id,
      customerName: insertedCustomers[4].company,
      value: 180000,
      stage: 'closed-won',
      probability: 100,
      expectedCloseDate: '2024-01-30',
      actualCloseDate: '2024-01-30',
      description: 'Complete cloud infrastructure migration',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-12',
    },
  ];

  const insertedDeals = await db.insert(deals).values(dealData).returning();
  console.log(`✅ Inserted ${insertedDeals.length} deals`);

  // Seed activities
  const activityData = [
    {
      type: 'deal-won',
      title: 'Deal Closed Successfully',
      description: 'Cloud Migration Services deal closed for $180,000',
      customerId: insertedCustomers[4].id,
      customerName: insertedCustomers[4].company,
      dealId: insertedDeals[4].id,
      dealTitle: insertedDeals[4].title,
      status: 'completed',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-21T10:30:00Z',
    },
    {
      type: 'meeting',
      title: 'Product Demo Meeting',
      description: 'Conducted product demonstration for Digital Transformation Project',
      customerId: insertedCustomers[1].id,
      customerName: insertedCustomers[1].company,
      dealId: insertedDeals[1].id,
      dealTitle: insertedDeals[1].title,
      status: 'completed',
      assignedTo: 'Sarah Miller',
      createdAt: '2024-01-21T09:00:00Z',
    },
    {
      type: 'call',
      title: 'Follow-up Call',
      description: 'Discussed contract terms and pricing for Q1 renewal',
      customerId: insertedCustomers[0].id,
      customerName: insertedCustomers[0].company,
      dealId: insertedDeals[0].id,
      dealTitle: insertedDeals[0].title,
      status: 'completed',
      assignedTo: 'Alex Thompson',
      createdAt: '2024-01-20T14:15:00Z',
    },
    {
      type: 'email',
      title: 'Proposal Sent',
      description: 'Sent detailed proposal for Enterprise Security Suite',
      customerId: insertedCustomers[2].id,
      customerName: insertedCustomers[2].company,
      dealId: insertedDeals[2].id,
      dealTitle: insertedDeals[2].title,
      status: 'completed',
      assignedTo: 'Mike Johnson',
      createdAt: '2024-01-20T11:45:00Z',
    },
    {
      type: 'deal-created',
      title: 'New Deal Created',
      description: 'Created new deal for Startup Package',
      customerId: insertedCustomers[3].id,
      customerName: insertedCustomers[3].company,
      dealId: insertedDeals[3].id,
      dealTitle: insertedDeals[3].title,
      status: 'completed',
      assignedTo: 'Lisa Chen',
      createdAt: '2024-01-19T16:20:00Z',
    },
  ];

  const insertedActivities = await db.insert(activities).values(activityData).returning();
  console.log(`✅ Inserted ${insertedActivities.length} activities`);

  console.log('🎉 Database seeded successfully!');
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

