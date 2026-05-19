
export const users = [
  {
    id: "u1",
    firstname: "Admin",
    lastname: "User",
    email: "admin@medplatform.com",
    role: "admin",
    isVerified: true,
  },
  {
    id: "u2",
    firstname: "Dr. Sarah",
    lastname: "Johnson",
    email: "sarah@medplatform.com",
    role: "doctor",
    isVerified: true,
  },
  {
    id: "u3",
    firstname: "Dr. Michael",
    lastname: "Chen",
    email: "michael@medplatform.com",
    role: "doctor",
    isVerified: true,
  },
  {
    id: "u4",
    firstname: "Emily",
    lastname: "Davis",
    email: "emily@medplatform.com",
    role: "parent",
    isVerified: true,
  },
  {
    id: "u5",
    firstname: "James",
    lastname: "Wilson",
    email: "james@medplatform.com",
    role: "parent",
    isVerified: true,
  },
  {
    id: "u6",
    firstname: "Dr. Lisa",
    lastname: "Park",
    email: "lisa@medplatform.com",
    role: "doctor",
    isVerified: false,
  },
  {
    id: "u7",
    firstname: "Maria",
    lastname: "Garcia",
    email: "maria@medplatform.com",
    role: "parent",
    isVerified: true,
  },
];

export const doctors = [
  {
    id: "d1",
    userId: "u2",
    phone: "+1-555-0101",
    speciality: "Pediatric Neurology",
    location: { latitude: 40.7128, longitude: -74.006 },
    isActive: true,
  },
  {
    id: "d2",
    userId: "u3",
    phone: "+1-555-0102",
    speciality: "Speech Therapy",
    location: { latitude: 34.0522, longitude: -118.2437 },
    isActive: true,
  },
  {
    id: "d3",
    userId: "u6",
    phone: "+1-555-0103",
    speciality: "Child Psychology",
    location: { latitude: 41.8781, longitude: -87.6298 },
    isActive: false,
  },
];

export const children = [
  {
    id: "c1",
    parentId: "u4",
    name: "Sophie Davis",
    age: 5,
    symptoms: ["Speech delay", "Limited eye contact"],
  },
  {
    id: "c2",
    parentId: "u4",
    name: "Lucas Davis",
    age: 8,
    symptoms: ["Attention difficulty", "Hyperactivity"],
  },
  {
    id: "c3",
    parentId: "u5",
    name: "Olivia Wilson",
    age: 4,
    symptoms: ["Sensory sensitivity", "Repetitive behaviors"],
  },
  {
    id: "c4",
    parentId: "u7",
    name: "Carlos Garcia",
    age: 6,
    symptoms: ["Social withdrawal", "Anxiety"],
  },
  {
    id: "c5",
    parentId: "u7",
    name: "Ana Garcia",
    age: 3,
    symptoms: ["Speech delay", "Motor skills delay"],
  },
];

export const assessments = [
  {
    id: "a1",
    childId: "c1",
    symptomsSnapshot: ["Speech delay", "Limited eye contact"],
    steps: [
      {
        title: "Initial Observation",
        description: "Observe child's interaction patterns during free play",
        order: 1,
        isDone: true,
      },
      {
        title: "Language Assessment",
        description: "Evaluate receptive and expressive language skills",
        order: 2,
        isDone: true,
      },
      {
        title: "Social Interaction Test",
        description: "Structured social engagement activities",
        order: 3,
        isDone: false,
      },
      {
        title: "Parent Interview",
        description: "Detailed developmental history from parents",
        order: 4,
        isDone: false,
      },
    ],
  },
  {
    id: "a2",
    childId: "c2",
    symptomsSnapshot: ["Attention difficulty", "Hyperactivity"],
    steps: [
      {
        title: "Behavioral Screening",
        description: "Standardized ADHD screening questionnaire",
        order: 1,
        isDone: true,
      },
      {
        title: "Attention Test",
        description: "Computerized attention assessment",
        order: 2,
        isDone: false,
      },
      {
        title: "Classroom Observation",
        description: "In-school behavior observation",
        order: 3,
        isDone: false,
      },
    ],
  },
  {
    id: "a3",
    childId: "c3",
    symptomsSnapshot: ["Sensory sensitivity", "Repetitive behaviors"],
    steps: [
      {
        title: "Sensory Profile",
        description: "Complete sensory processing assessment",
        order: 1,
        isDone: true,
      },
      {
        title: "Behavioral Analysis",
        description: "Functional behavior analysis",
        order: 2,
        isDone: true,
      },
      {
        title: "Developmental Review",
        description: "Comprehensive developmental milestone review",
        order: 3,
        isDone: true,
      },
    ],
  },
];

export const rapports = [
  {
    id: "r1",
    doctorId: "d1",
    parentId: "u4",
    childId: "c1",
    title: "Initial Speech Assessment Report",
    description: "Comprehensive evaluation of Sophie's language development",
    diagnosis: "Expressive Language Disorder",
    notes:
      "Sophie shows strong receptive language skills but struggles with verbal expression.",
    recommendations:
      "Weekly speech therapy sessions, daily reading activities, use of visual aids at home",
    medications: "",
    exercises:
      "Mirror exercises, picture naming games, story retelling practice",
    status: "published",
    nextVisitDate: "2026-04-15",
  },
  {
    id: "r2",
    doctorId: "d2",
    parentId: "u4",
    childId: "c2",
    title: "ADHD Preliminary Report",
    description: "Preliminary assessment for attention-related concerns",
    diagnosis: "Under evaluation - suspected ADHD",
    notes:
      "Lucas shows signs consistent with ADHD-Combined type. Further testing recommended.",
    recommendations:
      "Structured daily routines, movement breaks every 30 minutes, positive reinforcement strategies",
    medications: "None at this stage",
    exercises:
      "Mindfulness breathing, focus games, physical activity before homework",
    status: "draft",
    nextVisitDate: "2026-04-20",
  },
  {
    id: "r3",
    doctorId: "d1",
    parentId: "u5",
    childId: "c3",
    title: "Sensory Processing Evaluation",
    description: "Complete sensory processing evaluation for Olivia",
    diagnosis: "Sensory Processing Disorder",
    notes:
      "Olivia demonstrates hypersensitivity to auditory and tactile stimuli.",
    recommendations:
      "Occupational therapy, sensory diet implementation, gradual exposure therapy",
    medications: "",
    exercises:
      "Deep pressure activities, weighted blanket use, sensory bins exploration",
    status: "published",
    nextVisitDate: "2026-05-01",
  },
];

export const appointments = [
  {
    id: "ap1",
    doctorId: "d1",
    parentId: "u4",
    childId: "c1",
    date: "2026-04-15T10:00:00",
    status: "confirmed",
  },
  {
    id: "ap2",
    doctorId: "d2",
    parentId: "u4",
    childId: "c2",
    date: "2026-04-20T14:00:00",
    status: "pending",
  },
  {
    id: "ap3",
    doctorId: "d1",
    parentId: "u5",
    childId: "c3",
    date: "2026-05-01T09:30:00",
    status: "confirmed",
  },
  {
    id: "ap4",
    doctorId: "d2",
    parentId: "u7",
    childId: "c4",
    date: "2026-04-10T11:00:00",
    status: "cancelled",
  },
  {
    id: "ap5",
    doctorId: "d1",
    parentId: "u7",
    childId: "c5",
    date: "2026-04-25T15:00:00",
    status: "pending",
  },
];

export function getUserById(id) {
  return users.find((u) => u.id === id);
}
export function getDoctorByUserId(userId) {
  return doctors.find((d) => d.userId === userId);
}
export function getChildrenByParentId(parentId) {
  return children.filter((c) => c.parentId === parentId);
}
export function getAssessmentsByChildId(childId) {
  return assessments.filter((a) => a.childId === childId);
}
export function getRapportsByChildId(childId) {
  return rapports.filter((r) => r.childId === childId);
}
export function getAppointmentsByDoctorId(doctorId) {
  return appointments.filter((a) => a.doctorId === doctorId);
}
export function getAppointmentsByParentId(parentId) {
  return appointments.filter((a) => a.parentId === parentId);
}
export function getChildById(id) {
  return children.find((c) => c.id === id);
}
export function getRapportsByDoctorId(doctorId) {
  return rapports.filter((r) => r.doctorId === doctorId);
}
