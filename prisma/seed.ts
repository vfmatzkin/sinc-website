const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  // Create basic permissions
  const permissions = [
    { name: 'manage_users', description: 'Can manage user accounts' },
    { name: 'manage_content', description: 'Can manage site content' },
    { name: 'manage_research', description: 'Can manage research projects' },
    { name: 'manage_courses', description: 'Can manage courses' },
    { name: 'verify_staff', description: 'Can verify staff members' },
  ];

  for (const permission of permissions) {
    await db.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Create access groups
  const accessGroups = [
    { name: 'administrators', description: 'Full system access' },
    { name: 'staff', description: 'Staff access' },
    { name: 'researchers', description: 'Research access' },
    { name: 'instructors', description: 'Course management access' },
  ];

  for (const group of accessGroups) {
    await db.accessGroup.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    });
  }

  // Create initial content entries
  const homeDescription = await db.content.create({
    data: {
      key: 'home.description',
      type: 'HOME_DESCRIPTION',
      translations: {
        create: [
          {
            language: 'EN',
            value: 'Research at sinc(i) aims to develop new algorithms for machine learning, data mining, signal processing and complex systems, providing innovative technologies for advancing healthcare, bioinformatics, precision agriculture, autonomous systems and human-computer interfaces. Research facilities are located in the Facultad de Ingeniería y Ciencias Hídricas building, Universidad Nacional del Litoral, on the University Campus.',
          },
          {
            language: 'ES',
            value: 'El Instituto de Investigación en Señales, Sistemas e Inteligencia Computacional fue creado en 2004 en el Departamento de Informática de la Facultad de Ingeniería y Ciencias Hídricas (FICH), Universidad Nacional del Litoral (UNL). En 2014 fue reconocido como Unidad Ejecutora de doble dependencia por el Consejo Nacional de Investigaciones Científicas y Técnicas (CONICET) y la UNL. La investigación en el sinc(i) está orientada a desarrollar nuevos algoritmos para aprendizaje de máquina, minería de datos, procesamiento de señales y sistemas complejos, proveyendo tecnologías innovadoras para las áreas de salud, agricultura de precisión, bioinformática, energía, sistemas autónomos e interfaces hombre-máquina.',
          },
        ],
      },
    },
  });

  console.log('Content seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });