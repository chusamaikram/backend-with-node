/* ─────────────────────────────────────────────────────────────
   Mock data — used across all pages during development.
   Replace with real API calls in Sprint 3-5.
───────────────────────────────────────────────────────────── */

export const MOCK_USER = {
    _id: "u1",
    username: "johndoe",
    fullname: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    coverImage: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=1200&q=80",
    subscribersCount: 3420,
    channelsSubscribedToCount: 18,
};

export const MOCK_VIDEOS = [{
        _id: "v1",
        title: "Building a Full-Stack App with React and Node.js",
        description: "In this video we build a complete full-stack application from scratch using React 18, Node.js, Express and MongoDB.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 3847,
        views: 124500,
        ispublished: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u1",
            username: "johndoe",
            fullname: "John Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        },
        likesCount: 4200,
    },
    {
        _id: "v2",
        title: "Mastering Tailwind CSS v4 — Complete Guide",
        description: "Everything you need to know about Tailwind CSS v4, including the new @theme directive.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 5122,
        views: 89200,
        ispublished: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u2",
            username: "janesmith",
            fullname: "Jane Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
        },
        likesCount: 3100,
    },
    {
        _id: "v3",
        title: "TypeScript Tips Every Developer Should Know",
        description: "Advanced TypeScript patterns and tricks that will level up your development workflow.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 2340,
        views: 45600,
        ispublished: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u3",
            username: "alexdev",
            fullname: "Alex Dev",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
        },
        likesCount: 1800,
    },
    {
        _id: "v4",
        title: "Docker & Kubernetes for Beginners",
        description: "Learn containerization from scratch. We cover Docker basics, Compose, and Kubernetes fundamentals.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 7200,
        views: 201000,
        ispublished: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u2",
            username: "janesmith",
            fullname: "Jane Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
        },
        likesCount: 9400,
    },
    {
        _id: "v5",
        title: "React Query vs Zustand — State Management Deep Dive",
        description: "When to use React Query vs Zustand? This video breaks down the exact use cases for each library.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 2890,
        views: 33100,
        ispublished: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u1",
            username: "johndoe",
            fullname: "John Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        },
        likesCount: 1200,
    },
    {
        _id: "v6",
        title: "Git & GitHub Workflow for Teams",
        description: "Branching strategies, pull requests, code reviews and CI/CD pipelines for professional teams.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 4560,
        views: 67800,
        ispublished: false,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u3",
            username: "alexdev",
            fullname: "Alex Dev",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
        },
        likesCount: 2700,
    },
    {
        _id: "v7",
        title: "Build a REST API with Express.js",
        description: "Step-by-step guide to building a production-ready REST API using Express, MongoDB, and JWT auth.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 6780,
        views: 152000,
        ispublished: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u1",
            username: "johndoe",
            fullname: "John Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        },
        likesCount: 6100,
    },
    {
        _id: "v8",
        title: "CSS Grid & Flexbox — Complete Layout Guide",
        description: "Master modern CSS layouts with a practical guide to Grid and Flexbox including real-world examples.",
        thumbnail: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&q=80"
        },
        videoFile: {
            url: ""
        },
        duration: 3210,
        views: 88900,
        ispublished: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u2",
            username: "janesmith",
            fullname: "Jane Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
        },
        likesCount: 3400,
    },
];

export const MOCK_COMMENTS = [{
        _id: "c1",
        content: "This is exactly what I was looking for. Really clear explanation!",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u2",
            username: "janesmith",
            fullname: "Jane Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
        },
        likesCount: 24,
        isLiked: false,
    },
    {
        _id: "c2",
        content: "Great content as always. The section on TypeScript generics blew my mind.",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u3",
            username: "alexdev",
            fullname: "Alex Dev",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
        },
        likesCount: 11,
        isLiked: true,
    },
    {
        _id: "c3",
        content: "Could you do a follow-up video on testing React applications?",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        owner: {
            _id: "u1",
            username: "johndoe",
            fullname: "John Doe",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        },
        likesCount: 7,
        isLiked: false,
    },
];

export const MOCK_TWEETS = [{
        _id: "t1",
        content: "Just shipped a new feature! 🚀 React Server Components are genuinely game-changing once you wrap your head around the mental model.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        owner: MOCK_USER,
        likesCount: 42,
        isLiked: false,
    },
    {
        _id: "t2",
        content: "Hot take: you don't need a state management library for 90% of apps. Context + useReducer is more than enough.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        owner: MOCK_USER,
        likesCount: 128,
        isLiked: true,
    },
    {
        _id: "t3",
        content: "Been using Tailwind CSS v4 for a week now. The new @theme directive is a huge quality-of-life upgrade. Highly recommend upgrading.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        owner: MOCK_USER,
        likesCount: 87,
        isLiked: false,
    },
];

export const MOCK_PLAYLISTS = [{
        _id: "pl1",
        name: "React Masterclass",
        description: "Everything React — hooks, patterns, performance",
        videosCount: 12,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80"
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        owner: MOCK_USER,
    },
    {
        _id: "pl2",
        name: "Backend Development",
        description: "Node.js, Express, MongoDB and REST APIs",
        videosCount: 8,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80"
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        owner: MOCK_USER,
    },
    {
        _id: "pl3",
        name: "DevOps Essentials",
        description: "Docker, Kubernetes, CI/CD pipelines",
        videosCount: 5,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&q=80"
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        owner: MOCK_USER,
    },
];

export const MOCK_CHANNELS = [{
        _id: "u2",
        username: "janesmith",
        fullname: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        subscribersCount: 12400,
        latestVideo: MOCK_VIDEOS[1],
        isSubscribed: true,
    },
    {
        _id: "u3",
        username: "alexdev",
        fullname: "Alex Dev",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        subscribersCount: 5800,
        latestVideo: MOCK_VIDEOS[2],
        isSubscribed: true,
    },
    {
        _id: "u4",
        username: "saracode",
        fullname: "Sara Code",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
        subscribersCount: 29100,
        latestVideo: MOCK_VIDEOS[3],
        isSubscribed: false,
    },
];

export const MOCK_DASHBOARD_STATS = {
    totalVideos: 12,
    totalViews: 452300,
    totalLikes: 18400,
    totalSubscribers: 3420,
};