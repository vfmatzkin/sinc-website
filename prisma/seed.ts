import { PrismaClient, Prisma } from '@prisma/client';
import { Language, Role, StaffVerificationStatus, Position, ProjectStatus, ContentType } from '.prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create initial tags
  await prisma.tag.createMany({
    data: [
      { id: 'tag100001', name: 'Example Institute', description: 'Institute for Example Studies' },
      { id: 'tag100002', name: 'Advanced Research Group', description: 'Group focusing on advanced research topics' },
      { id: 'tag100003', name: 'Innovative Solutions', description: 'Research on innovative technological solutions' },
      { id: 'tag100004', name: 'Robotics', description: 'Research in robotics and automation' },
      { id: 'tag100005', name: 'Data Science', description: 'Research in data analysis and machine learning' },
      { id: 'tag100006', name: 'Cybersecurity', description: 'Research in cybersecurity and data protection' }
    ]
  });

  // Create users with profiles and languages (update email fields)
  const userCreateData: Prisma.UserCreateInput[] = [
    {
      id: 'usr000001',
      name: 'Alice Johnson',
      email: "user1@example.com", // replaced real email
      image: 'https://randomuser.me/api/portraits/women/74.jpg',
      bio: 'Experienced researcher in robotics with 10+ years experience.',
      avatar: 'https://randomuser.me/api/portraits/women/74.jpg',
      role: Role.STAFF,
      isActive: true,
      phone: '+1-555-0101',
      institution: 'Example Institute',
      department: 'Robotics Department',
      staffVerificationStatus: StaffVerificationStatus.VERIFIED,
      staffVerificationDate: new Date(),
      profile: {
        create: {
          id: 'prf100001',
          title: 'PhD in Robotics',
          office: 'Room 101',
          phone: '555-0101',
          googleScholar: 'https://scholar.google.com/citations?user=alice_johnson',
          orcid: '0000-0001-2345-6789',
          researchGate: 'https://www.researchgate.net/profile/Alice_Johnson',
          linkedin: 'https://linkedin.com/in/alicejohnson',
          github: 'https://github.com/alicejohnson',
          customLinks: { personalWebsite: 'https://alicejohnson.com' }
        }
      },
      language: {
        create: { id: 'lang100001', language: Language.EN }
      }
    },
    {
      id: 'usr000002',
      name: 'Bob Smith',
      email: "user2@example.com", // replaced real email
      image: 'https://randomuser.me/api/portraits/men/51.jpg',
      bio: 'Data scientist specializing in machine learning.',
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      role: Role.RESEARCHER,
      isActive: true,
      phone: '+1-555-0102',
      institution: 'Advanced Research Group',
      department: 'Data Science Department',
      staffVerificationStatus: StaffVerificationStatus.VERIFIED,
      staffVerificationDate: new Date(),
      profile: {
        create: {
          id: 'prf100002',
          title: 'PhD in Data Science',
          office: 'Room 102',
          phone: '555-0102',
          googleScholar: 'https://scholar.google.com/citations?user=bob_smith',
          orcid: '0000-0002-3456-7890',
          researchGate: 'https://www.researchgate.net/profile/Bob_Smith',
          linkedin: 'https://linkedin.com/in/bobsmith',
          github: 'https://github.com/bobsmith',
          customLinks: { portfolio: 'https://bobsmithportfolio.com' }
        }
      },
      language: {
        create: { id: 'lang100002', language: Language.ES }
      }
    },
    {
      id: 'usr000003',
      name: 'Charlie Davis',
      email: "user3@example.com", // replaced real email
      image: 'https://randomuser.me/api/portraits/men/errfg348.jpg',
      bio: 'Cybersecurity specialist with 5 years of experience.',
      avatar: 'https://randomuser.me/api/portraits/men/wf3448.jpg',
      role: Role.STAFF,
      isActive: true,
      phone: '+1-555-0103',
      institution: 'Innovative Solutions',
      department: 'Cybersecurity Department',
      staffVerificationStatus: StaffVerificationStatus.VERIFIED,
      staffVerificationDate: new Date(),
      profile: {
        create: {
          id: 'prf100003',
          title: 'PhD in Cybersecurity',
          office: 'Room 103',
          phone: '555-0103',
          orcid: '0000-0003-4567-8901',
          researchGate: 'https://www.researchgate.net/profile/Charlie_Davis',
          linkedin: 'https://linkedin.com/in/charliedavis',
          github: 'https://github.com/charliedavis'
        }
      },
      language: {
        create: { id: 'lang100003', language: Language.FR }
      }
    }
  ];

  const users = await Promise.all(
    userCreateData.map(data => 
      prisma.user.create({ 
        data: data,
        select: {
          id: true,
          email: true,
          role: true,
          staffVerificationStatus: true,
          language: true
        }
      })
    )
  );

  // Update their registration status using Prisma's updateMany method
  await prisma.user.updateMany({
    where: {
      id: {
        in: users.map(u => u.id)
      }
    },
    data: {
      registrationComplete: true
    }
  });

  // Create user tags for each user
  await prisma.userTag.createMany({
    data: [
      { id: 'ut100001', userId: 'usr000001', tagId: 'tag100001' },
      { id: 'ut100002', userId: 'usr000002', tagId: 'tag100002' },
      { id: 'ut100003', userId: 'usr000003', tagId: 'tag100003' }
    ]
  });

  // Create user positions (add position for third user)
  await prisma.userPosition.createMany({
    data: [
      {
        id: 'pos100001',
        userId: 'usr000001',
        position: Position.RESEARCH_STAFF,
        startDate: new Date('2020-01-01')
      },
      {
        id: 'pos100002',
        userId: 'usr000002',
        position: Position.RESEARCH_STAFF,
        startDate: new Date('2021-06-15')
      },
      {
        id: 'pos100003',
        userId: 'usr000003',
        position: Position.RESEARCH_STAFF,
        startDate: new Date('2022-03-10')
      }
    ]
  });

  // Create former positions
  await prisma.formerPosition.createMany({
    data: [
      {
        id: 'fp100001',
        userId: 'usr000001',
        position: 'PHD_STUDENT',
        startDate: new Date('2010-01-01'),
        endDate: new Date('2015-12-31'),
        details: 'PhD in Robotics at Example University'
      },
      {
        id: 'fp100002',
        userId: 'usr000001',
        position: 'MSC_STUDENT',
        startDate: new Date('2008-01-01'),
        endDate: new Date('2010-12-31'),
        details: 'Masters in Computer Science'
      },
      {
        id: 'fp100003',
        userId: 'usr000002',
        position: 'POSDOCTORAL_FELLOW',
        startDate: new Date('2015-01-01'),
        endDate: new Date('2018-12-31'),
        details: 'Postdoc research in AI'
      }
    ]
  });

  // Create research lines (add third entry)
  const researchLines = await prisma.researchLine.createMany({
    data: [
      {
        id: 'rl100001',
        name: 'Robotics',
        description: 'Research in robotics and automation technologies',
        image: 'http://example.com/images/robotics.png'
      },
      {
        id: 'rl100002',
        name: 'Data Science',
        description: 'Research in data analysis, machine learning, and AI',
        image: 'http://example.com/images/datascience.png'
      },
      {
        id: 'rl100003',
        name: 'Cybersecurity',
        description: 'Research in cybersecurity measures and data protection',
        image: 'http://example.com/images/cybersecurity.png'
      }
    ]
  });

  // Associate researchers with research lines
  await prisma.user.update({
    where: { id: 'usr000001' },
    data: { researchLines: { connect: { id: 'rl100001' } } }
  });
  await prisma.user.update({
    where: { id: 'usr000002' },
    data: { researchLines: { connect: [{ id: 'rl100002' }, { id: 'rl100003' }] } }
  });

  // Create user relation (advisor relation)
  await prisma.userRelation.create({
    data: {
      id: 'rel100001',
      advisorId: 'usr000001',
      adviseeId: 'usr000002',
      relationType: 'CONICET_ADVISOR',
      tagId: 'tag100001',
      startDate: new Date('2021-06-15')
    }
  });

  // Create projects (add second project)
  const projects = await prisma.project.createMany({
    data: [
      {
        id: 'proj100001',
        title: 'Robotics Project',
        description: 'Developing advanced robotics',
        startDate: new Date('2024-01-01'),
        status: ProjectStatus.ACTIVE,
        image: 'http://example.com/image1.png',
        researchLineId: 'rl100001'
      },
      {
        id: 'proj100002',
        title: 'Data Science Project',
        description: 'Machine learning research',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
        status: 'COMPLETED',
        image: 'http://example.com/image2.png',
        researchLineId: 'rl100002'
      }
    ]
  });

  // Create publication for proj100001
  await prisma.publication.create({
    data: {
      id: 'pub100001',
      title: 'Robotics Research',
      abstract: 'Abstract of robotics research',
      projectId: 'proj100001',
      year: 2024,
      doi: '10.1000/xyz123',
      pdfUrl: 'http://example.com/pub1.pdf',
      pubType: 'JOURNAL',
      venue: 'Robotics Journal',
      citation: 'Citation info'
    }
  });

  // Create account for Bob Smith (usr000002) with placeholder provider account id
  await prisma.account.create({
    data: {
      id: 'acc100001',
      userId: 'usr000002',
      type: 'oauth',
      provider: 'google',
      providerAccountId: 'dummy_provider_account_id', // replaced sensitive value
      token_type: 'Bearer',
      scope: 'openid profile email'
    }
  });

  // Create sessions for usr000001 and usr000002
  await prisma.session.createMany({
    data: [
      { id: 'sess100001', sessionToken: 'sessiontoken_001', userId: 'usr000001', expires: new Date('2025-12-31'), lastActive: new Date(), ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' },
      { id: 'sess100002', sessionToken: 'sessiontoken_002', userId: 'usr000002', expires: new Date('2026-01-31'), lastActive: new Date(), ipAddress: '192.168.1.2', userAgent: 'Mozilla/5.0' }
    ]
  });

  // Create content and translations
  // Existing content from before: cont100003 (welcome.title) and cont100005 (home.description)
  // Add content for home_description, navigation_main, and welcome.signin_prompt
  await prisma.content.createMany({
    data: [
      {
        id: 'cont100001',
        key: 'home_description',
        type: ContentType.HOME_DESCRIPTION,
        description: 'Description for the home page'
      },
      {
        id: 'cont100002',
        key: 'navigation_main',
        type: 'NAVIGATION' as ContentType,
        description: 'Main navigation menu'
      },
      {
        id: 'cont100004',
        key: 'welcome.signin_prompt',
        type: ContentType.HOME_DESCRIPTION,
        description: 'Sign in prompt on home page'
      }
    ]
  });
  await prisma.translation.createMany({
    data: [
      // Translations for home_description
      { id: 'trans100001', contentId: 'cont100001', language: Language.EN, value: 'Welcome to our website!' },
      { id: 'trans100002', contentId: 'cont100001', language: Language.ES, value: '¡Bienvenido a nuestro sitio web!' },
      // Translations for navigation_main
      { id: 'trans100003', contentId: 'cont100002', language: Language.EN, value: 'Home' },
      { id: 'trans100004', contentId: 'cont100002', language: Language.ES, value: 'Inicio' },
      // Translations for welcome.signin_prompt
      { id: 'trans100007', contentId: 'cont100004', language: Language.EN, value: 'Please sign in to access more features' },
      { id: 'trans100008', contentId: 'cont100004', language: Language.ES, value: 'Inicia sesión para acceder a más funciones' }
    ]
  });

  await Promise.all([
    prisma.content.create({
      data: {
        id: 'cont100003',
        key: 'welcome.title',
        type: ContentType.HOME_DESCRIPTION,
        description: 'Welcome title on home page',
        translations: {
          createMany: {
            data: [
              { id: 'trans100005', language: Language.EN, value: 'Welcome to sinc(i)' },
              { id: 'trans100006', language: Language.ES, value: 'Bienvenido a sinc(i)' }
            ]
          }
        }
      }
    }),
    prisma.content.create({
      data: {
        id: 'cont100005',
        key: 'home.description',
        type: ContentType.HOME_DESCRIPTION,
        description: 'Main description of the institute',
        translations: {
          createMany: {
            data: [
              { 
                id: 'trans100009',
                language: Language.EN,
                value: 'The Research Institute for Signals, Systems and Computational Intelligence, sinc(i), is a research center focused on basic and applied research in signal and image processing, machine learning, pattern recognition and artificial intelligence.'
              },
              {
                id: 'trans100010',
                language: Language.ES,
                value: 'El Instituto de Investigación en Señales, Sistemas e Inteligencia Computacional, sinc(i), es un instituto de investigación enfocado en la investigación básica y aplicada en procesamiento de señales e imágenes, aprendizaje automático, reconocimiento de patrones e inteligencia artificial.'
              }
            ]
          }
        }
      }
    })
  ]);

  // Create additional sample data for models without existing sample data

  // Sample blog post
  await prisma.post.create({
    data: {
      id: 'post100001',
      title: 'First Post',
      content: 'This is the first blog post.',
      author: { connect: { id: 'usr000001' } },
      published: true
    }
  });

  // Sample research line entry
  await prisma.researchLineEntry.create({
    data: {
      id: 'rle100001',
      researchLine: { connect: { id: 'rl100001' } },
      author: { connect: { id: 'usr000001' } },
      content: 'Detailed research content on robotics.',
      isVisible: true,
      sortOrder: 1
    }
  });

  // Sample course with instructor and material data
  await prisma.course.create({
    data: {
      id: 'course100001',
      name: 'Introduction to Robotics',
      description: 'A beginner course on robotics.',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-05-15'),
      isPublic: true,
      instructors: {
        create: [{
          instructor: { connect: { id: 'usr000001' } }, // changed from user to instructor
          role: 'professor'
        }]
      },
      materials: {
        create: [{
          id: 'material100001',
          title: 'Syllabus',
          description: 'Course syllabus PDF',
          fileUrl: 'http://example.com/syllabus.pdf',
          isPublic: true,
          uploadedAt: new Date()
        }]
      }
    }
  });

  // Sample subscriber
  await prisma.subscriber.create({
    data: {
      id: 'sub100001',
      email: 'subscriber@example.com',
      verified: false
    }
  });

  // Sample verification token
  await prisma.verificationToken.create({
    data: {
      identifier: 'user1@example.com',
      token: 'sample_verification_token_123',
      expires: new Date(Date.now() + 3600 * 1000) // expires in 1 hour
    }
  });

  // Sample permission
  await prisma.permission.create({
    data: {
      id: 'perm100001',
      name: 'EDIT_CONTENT',
      description: 'Permission to edit content'
    }
  });

  // Sample access group
  await prisma.accessGroup.create({
    data: {
      id: 'ag100001',
      name: 'Editors',
      description: 'Group for content editors'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });