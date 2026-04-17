export const mockTracks = [
  {
    track_id: 1,
    name: "Full-Stack Web Development",
    description:
      "Build complete web applications from frontend to backend. Master HTML, CSS, JavaScript, React, and Node.js through real projects.",
    icon_url: "https://placehold.co/400x200/4F39F6/ffffff?text=Web+Dev",
  },
  {
    track_id: 2,
    name: "Data Science & ML",
    description:
      "Dive deep into data analysis, visualization, and machine learning. Work with Python, Pandas, and Scikit-learn on real datasets.",
    icon_url: "https://placehold.co/400x200/8B5CF6/ffffff?text=Data+Science",
  },
  {
    track_id: 3,
    name: "Cypersecurity Fundementals",
    description:
      "Learn to think like a hacker and secure systems. Explore networking, Linux, penetration testing, and cryptography.",
    icon_url: "https://placehold.co/400x200/22C55E/ffffff?text=Cybersecurity",
  },
  {
    track_id: 4,
    name: "Algorithms & data Structure",
    description:
      "Crack coding interviews with confidence. Master arrays, trees, graphs, and dynamic programming with hands-on practice.",
    icon_url: "https://placehold.co/400x200/F97316/ffffff?text=Algorithms",
  },
];

export const mockRoadmaps = [
  {
    rid: 1,
    name: "Frontend Basics",
    description: "HTML, CSS, and JavaScript",
    icon_url: "https://placehold.co/100x100/4F39F6/ffffff?text=FE",
    track_id: 1,
  },
  {
    rid: 2,
    name: "React & State Management",
    description: "React, hooks, Redux and modern frontend",
    icon_url: "https://placehold.co/100x100/4F39F6/ffffff?text=React",
    track_id: 1,
  },
  {
    rid: 3,
    name: "Backend with Node.js",
    description: "Node.js, Express, REST APIs",
    icon_url: "https://placehold.co/100x100/4F39F6/ffffff?text=Node",
    track_id: 1,
  },
  {
    rid: 4,
    name: "Database",
    description: "PostgresSQL, MongoDB and ORMs",
    icon_url: "https://placehold.co/100x100/4F39F6/ffffff?text=DB",
    track_id: 1,
  },
];

export const mockRoadmapData = [
  {
    level: "Beginner",
    topics: [
      {
        title: "HTML Basics",
        resources: [
          { title: "Intro to HTML", link: "#" },
          { title: "Forms", link: "#" },
        ],
      },
      {
        title: "CSS Basics",
        resources: [
          { title: "Flexbox Guide", link: "#" },
          { title: "Grid Layout", link: "#" },
        ],
      },
    ],
  },
  {
    level: "Intermediate",
    topics: [
      {
        title: "JavaScript",
        resources: [
          { title: "Closures", link: "#" },
          { title: "Promises", link: "#" },
        ],
      },
    ],
  },
  {
    level: "Advanced",
    topics: [
      {
        title: "React Advanced",
        resources: [{ title: "Hooks Deep Dive", link: "#" }],
      },
    ],
  },
];
