require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create users — IIIT Surat students
    const users = await User.create([
      { username: 'surya', email: 'surya@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech CSE student at IIIT Surat | Full-stack developer | Tech blogger' },
      { username: 'tarun', email: 'tarun@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech ECE student at IIIT Surat | Embedded systems enthusiast' },
      { username: 'sumit', email: 'sumit@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech CSE student at IIIT Surat | AI/ML researcher | Competitive programmer' },
      { username: 'pankaj', email: 'pankaj@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech CSE student at IIIT Surat | Cybersecurity enthusiast | GDG member' },
      { username: 'ronit', email: 'ronit@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech ECE student at IIIT Surat | Robotics club lead | Hardware hacker' },
      { username: 'harsh', email: 'harsh@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech CSE student at IIIT Surat | Open-source contributor | DevOps learner' },
      { username: 'bhupendra', email: 'bhupendra@iiitsurat.ac.in', password: 'password123', bio: 'B.Tech CSE student at IIIT Surat | Placement coordinator | Data science enthusiast' }
    ]);
    console.log('Created 7 users');

    // Create posts — IIIT Surat themed blog content
    const posts = await Post.create([
      {
        title: 'About IIIT Surat — An Institute of National Importance',
        content: 'The Indian Institute of Information Technology Surat (IIIT Surat) was established in 2017 under the Public-Private Partnership (PPP) model by the Ministry of Education (formerly MHRD), Government of India. It is recognized as an Institute of National Importance and is located at Kholvad, Kamrej, Surat, Gujarat.\n\nIIIT Surat was initially mentored by Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat, while its permanent infrastructure was being developed. The foundation stone for the permanent campus has been laid, envisioning state-of-the-art laboratories, innovation centers, digitally equipped classrooms, and dedicated sports facilities.\n\n## Academic Programs\n\nIIIT Surat offers Bachelor of Technology (B.Tech.) degrees in two core departments:\n\n- **Computer Science & Engineering (CSE)** — The flagship program covering data structures, algorithms, software engineering, machine learning, and more\n- **Electronics & Communication Engineering (ECE)** — Focused on embedded systems, VLSI design, signal processing, and communication networks\n\nThe institute has expanded its offerings to include M.Tech., Ph.D., and specialized B.Tech. tracks in AI-ML and Cyber Security.\n\n## Vision\n\nIIIT Surat aims to become a leading center of excellence in information technology education and research, producing graduates who contribute to India\'s growing tech ecosystem.',
        excerpt: 'IIIT Surat is an Institute of National Importance established in 2017 under the PPP model, offering B.Tech in CSE and ECE at Kholvad, Kamrej, Surat.',
        category: 'Technology',
        tags: ['iiitsurat', 'education', 'engineering', 'institute'],
        author: users[0]._id
      },
      {
        title: 'Placements at IIIT Surat — Companies, Packages & Statistics',
        content: 'IIIT Surat has shown remarkable growth in its placement statistics over the years, attracting top-tier companies from across the tech industry.\n\n## Placement Highlights (2024-25)\n\n- **Highest Package:** Up to ₹74 LPA\n- **Average Package:** Approximately ₹13.99 LPA\n- **Placement Rate:** Around 70%\n- **Above ₹15 LPA:** 25% of placed students\n- **₹9-15 LPA range:** 34% of placed students\n\n## Top Recruiting Companies\n\nSome of the top companies that regularly visit IIIT Surat for campus placements include:\n\n- **Product Companies:** Microsoft, Google, Amazon, Adobe, Oracle, Uber, Atlassian, PayPal\n- **Service & Consulting:** Deloitte, Samsung, Walmart\n- **Startups:** Various funded startups in AI, FinTech, and SaaS\n\n## Branch-wise Performance\n\nThe Computer Science and Engineering (CSE) branch generally records higher placement packages and percentages compared to Electronics and Communication Engineering (ECE). However, ECE students who develop strong coding skills also secure excellent offers.\n\n## Tips for Placement Preparation\n\n- Start competitive programming early (LeetCode, Codeforces, CodeChef)\n- Build strong projects and maintain an active GitHub profile\n- Practice system design and object-oriented design concepts\n- Prepare for behavioral interviews with the STAR method\n- Participate in hackathons and open-source contributions',
        excerpt: 'IIIT Surat placements feature top companies like Microsoft, Google, Amazon with highest package of ₹74 LPA and average of ₹13.99 LPA.',
        category: 'Business',
        tags: ['placements', 'iiitsurat', 'careers', 'packages'],
        author: users[6]._id
      },
      {
        title: 'Spring Fiesta — IIIT Surat\'s Premier Techno-Cultural Fest',
        content: 'Spring Fiesta is the flagship annual techno-cultural fest of IIIT Surat. It is a grand celebration that brings together technology, culture, and creativity, drawing participants from colleges across Gujarat and India.\n\n## Technical Events\n\nSpring Fiesta features a wide array of technical competitions:\n\n- **Hackathons:** 24-36 hour coding marathons where teams build solutions for real-world problems\n- **Code of Thrones:** An ICPC-style competitive programming battle\n- **PromptCraft:** AI prompt engineering competition\n- **Robotics Challenges:** Hardware-based problem solving and robot building\n- **Reimagination:** Product improvement and UI/UX redesign challenge\n\n## Cultural Events\n\nThe cultural side of Spring Fiesta is equally vibrant:\n\n- **Music Performances:** Battle of bands, solo singing, and classical music nights\n- **Dance Competitions:** Solo, duet, and group dance across multiple styles\n- **Drama & Theatre:** One-act plays and street theatre performances\n- **Art Exhibitions:** Digital art, photography, and traditional art showcases\n\n## E-Cell Events\n\nThe Entrepreneurship Cell organizes startup pitching competitions, business plan challenges, and guest talks from successful entrepreneurs.\n\nSpring Fiesta is not just a fest — it is a platform that nurtures innovation, teamwork, and creative expression among students.',
        excerpt: 'Spring Fiesta is IIIT Surat\'s flagship annual techno-cultural fest featuring hackathons, coding battles, cultural performances, and entrepreneurship events.',
        category: 'Lifestyle',
        tags: ['springfiesta', 'iiitsurat', 'techfest', 'cultural'],
        author: users[4]._id
      },
      {
        title: 'DevHeat Hackathon — Building Solutions for Real-World Problems',
        content: 'DevHeat is a flagship hackathon organized by IIIT Surat that brings together passionate developers, designers, and innovators to solve real-world problems using technology. The event has gained recognition as one of the notable student-organized hackathons in Gujarat.\n\n## Focus Areas\n\nDevHeat encourages participants to build solutions in key domains:\n\n- **Artificial Intelligence:** Building AI-powered tools for healthcare, education, and accessibility\n- **FinTech:** Creating solutions for digital payments, financial inclusion, and fraud detection\n- **Healthcare:** Developing telemedicine platforms, health monitoring systems, and drug discovery tools\n- **Sustainability:** Projects addressing climate change, waste management, and renewable energy\n- **Cybersecurity:** Building security tools, vulnerability scanners, and privacy-focused applications\n\n## Hackathon Format\n\nThe hackathon typically runs as a hybrid event:\n\n- **Duration:** 24-48 hours of continuous building\n- **Team Size:** 2-4 members per team\n- **Judging Criteria:** Innovation, technical complexity, real-world impact, and presentation quality\n- **Prizes:** Cash prizes, internship opportunities, and mentorship from industry professionals\n\n## Past Highlights\n\nPrevious editions of DevHeat have produced impressive projects including AI-based crop disease detection, blockchain-based supply chain management, and real-time sign language translation systems.\n\nDevHeat embodies the hacker spirit of IIIT Surat — building fast, thinking big, and solving problems that matter.',
        excerpt: 'DevHeat is IIIT Surat\'s flagship hackathon focused on AI, FinTech, Healthcare, and Sustainability, bringing together developers to solve real-world problems.',
        category: 'Technology',
        tags: ['devheat', 'hackathon', 'iiitsurat', 'coding'],
        author: users[3]._id
      },
      {
        title: 'Campus Life at IIIT Surat — Student Clubs, Hostels & Beyond',
        content: 'Life at IIIT Surat is a unique blend of academics, extracurricular activities, and community bonding. Despite being a relatively young institute, the campus culture is vibrant and student-driven.\n\n## Student Clubs & Societies\n\nIIIT Surat has a thriving ecosystem of student-run clubs:\n\n- **Google Developer Group (GDG) IIIT Surat:** Organizes technical workshops, study jams, and hackathons\n- **Coding Club:** Weekly contests, CP mentorship, and interview preparation sessions\n- **Robotics Club:** Hardware projects, IoT experiments, and national-level robotics competitions\n- **E-Cell (Entrepreneurship Cell):** Startup workshops, pitch competitions, and industry networking\n- **Literary Club:** Debates, creative writing, and Hindi Pakhwada celebrations\n- **Photography & Design Club:** Campus photography, poster design, and digital art\n\n## Hostel Life\n\nThe institute provides hostel accommodation for all students with essential amenities:\n\n- Internet connectivity and Wi-Fi throughout\n- Study areas and common rooms\n- Mess facilities with varied meal options\n- Security and surveillance systems\n- Shuttle services between hostel and academic block\n\n## Foundation Day (Navarambh)\n\nEvery year, IIIT Surat celebrates its Foundation Day — Navarambh — welcoming new batches with vision-setting sessions, expert talks, and community bonding activities. It is a memorable event that sets the tone for the academic year.\n\n## Sports & Recreation\n\nStudents have access to various sports facilities including table tennis, volleyball, badminton, and a gymnasium. The institute encourages participation in inter-IIIT sports tournaments, fostering healthy competition and team spirit.',
        excerpt: 'Campus life at IIIT Surat features active student clubs like GDG, Coding Club, Robotics Club, along with hostel facilities and the annual Navarambh celebration.',
        category: 'Lifestyle',
        tags: ['campuslife', 'iiitsurat', 'clubs', 'hostel'],
        author: users[1]._id
      },
      {
        title: 'B.Tech CSE at IIIT Surat — Curriculum, Skills & Career Paths',
        content: 'The Bachelor of Technology in Computer Science and Engineering (B.Tech CSE) at IIIT Surat is the institute\'s flagship program, designed to produce industry-ready engineers with strong fundamentals and practical skills.\n\n## Core Curriculum\n\nThe CSE program covers a comprehensive range of subjects:\n\n- **Foundation:** Data Structures, Algorithms, Discrete Mathematics, Computer Organization\n- **Systems:** Operating Systems, Computer Networks, Database Management Systems, Compiler Design\n- **Software:** Software Engineering, Object-Oriented Programming (Java/C++), Web Technologies\n- **Advanced:** Machine Learning, Artificial Intelligence, Cloud Computing, Information Security\n- **Electives:** Deep Learning, Natural Language Processing, Computer Vision, Blockchain Technology\n\n## Specializations\n\nIIIT Surat offers specialized B.Tech tracks in:\n\n- **Artificial Intelligence & Machine Learning (AI-ML):** Deep learning, reinforcement learning, computer vision, and NLP\n- **Cyber Security:** Network security, cryptography, ethical hacking, and digital forensics\n\n## Skills That Matter\n\nBeyond the curriculum, successful CSE students at IIIT Surat develop:\n\n- Competitive programming skills (C++, Python)\n- Full-stack web development (MERN/MEAN stack)\n- Open-source contribution (GitHub profile building)\n- System design and architecture thinking\n- Soft skills: communication, teamwork, and presentation\n\n## Career Paths\n\nGraduates from the CSE program at IIIT Surat pursue diverse career paths:\n\n- Software Development Engineer (SDE) at product companies\n- Data Scientist / ML Engineer\n- DevOps / Cloud Engineer\n- Cybersecurity Analyst\n- Higher studies (M.Tech, MS, MBA) at top universities',
        excerpt: 'B.Tech CSE at IIIT Surat covers data structures, algorithms, ML, AI, and cybersecurity, with specializations in AI-ML and Cyber Security.',
        category: 'Technology',
        tags: ['btech', 'cse', 'iiitsurat', 'curriculum'],
        author: users[2]._id
      },
      {
        title: 'How We Built Our Web Engineering Project Using the MEAN Stack',
        content: 'As part of our Web Engineering course at IIIT Surat, our team built a full-stack blog application using the MEAN stack — MongoDB, Express.js, AngularJS, and Node.js. Here is a behind-the-scenes look at our development journey.\n\n## The Team\n\nOur project team consisted of seven members: Surya, Tarun, Sumit, Pankaj, Ronit, Harsh, and Bhupendra. Each member brought unique skills to the table.\n\n## Technology Choices\n\n- **Frontend:** AngularJS 1.8 (loaded via CDN) for the Single Page Application with ngRoute for client-side routing\n- **Backend:** Node.js with Express.js for the REST API server\n- **Database:** MongoDB Atlas (cloud-hosted) with Mongoose ODM for schema validation\n- **Authentication:** JSON Web Tokens (JWT) for stateless auth with bcrypt for password hashing\n\n## Architecture & Design Patterns\n\nWe followed the MVC (Model-View-Controller) pattern on both the frontend and backend:\n\n- **Models:** Mongoose schemas for User, Post, and Comment with validation rules\n- **Views:** 7 AngularJS HTML templates with two-way data binding\n- **Controllers:** Express.js controllers for business logic + AngularJS controllers for presentation\n\n## Key Features Implemented\n\n- User registration and login with JWT authentication\n- Full CRUD operations on blog posts\n- Comment system with add/delete functionality\n- Category-based filtering and search\n- Author dashboard with post management\n- Responsive dark-mode UI with glassmorphism design\n\n## Lessons Learned\n\n- RESTful API design principles make frontend-backend integration seamless\n- Asynchronous programming with async/await is essential for Node.js\n- JWT provides a clean stateless authentication mechanism\n- MongoDB\'s flexible schema is perfect for rapid prototyping\n- The MVC pattern ensures clean separation of concerns\n\nThis project was a fantastic learning experience that brought together all the concepts we studied in our Web Engineering course at IIIT Surat.',
        excerpt: 'A behind-the-scenes look at how our IIIT Surat team of seven built a full-stack blog app using MongoDB, Express.js, AngularJS, and Node.js.',
        category: 'Technology',
        tags: ['webengineering', 'meanstack', 'iiitsurat', 'project'],
        author: users[5]._id
      },
      {
        title: 'Exploring Surat — The Diamond City and Our Second Home',
        content: 'Surat, the vibrant city on the banks of the Tapi river in Gujarat, is not just the diamond capital of the world — it is the city that IIIT Surat students call their second home. Here is our guide to exploring this incredible city.\n\n## About Surat\n\nSurat is the eighth-largest city in India and the second-largest in Gujarat. Known as the "Diamond City" because it processes over 90% of the world\'s diamonds, Surat is also a major hub for textiles, IT, and education.\n\n## Must-Visit Places\n\n- **Dumas Beach:** A beautiful beach along the Arabian Sea, perfect for evening walks and street food\n- **Surat Castle (Old Fort):** A 16th-century fort on the banks of the Tapi river with stunning architecture\n- **Dutch Garden:** A serene garden with historical significance, ideal for morning jogs\n- **Science Centre:** An interactive science museum great for tech enthusiasts\n- **ISKCON Temple:** A peaceful temple complex with beautiful architecture\n\n## Street Food Capital\n\nSurat is famous for its incredible street food scene:\n\n- **Locho:** A soft, fluffy snack unique to Surat, topped with sev and chutney\n- **Surti Undhiyu:** A traditional Gujarati mixed vegetable dish\n- **Ghari:** A famous sweet made with puri and filling, especially during Chandni Padva\n- **Ponk:** A seasonal delicacy made from tender sorghum, available in winter\n- **Khaman & Dhokla:** Classic Gujarati snacks available everywhere\n\n## Why Students Love Surat\n\n- Affordable cost of living compared to other metro cities\n- Safe and clean city with excellent infrastructure\n- Growing IT industry creating internship opportunities\n- Warm and welcoming Gujarati culture\n- Close proximity to other Gujarat destinations like Ahmedabad, Vadodara, and Saputara',
        excerpt: 'A student\'s guide to Surat — the Diamond City that IIIT Surat students call home, featuring must-visit places, street food, and why students love it.',
        category: 'Travel',
        tags: ['surat', 'gujarat', 'iiitsurat', 'travel'],
        author: users[0]._id
      }
    ]);
    console.log('Created 8 posts');

    // Create comments
    await Comment.create([
      { body: 'Great overview of our institute! Proud to be an IIITian. The new permanent campus is going to be amazing!', post: posts[0]._id, author: users[1]._id },
      { body: 'The placement stats are really impressive for such a young institute. CSE placements are fire! 🔥', post: posts[1]._id, author: users[2]._id },
      { body: 'Spring Fiesta was the best experience of my college life. The hackathon was intense but so rewarding!', post: posts[2]._id, author: users[0]._id },
      { body: 'Participated in DevHeat last year and our team built an AI-powered crop disease detector. Won 2nd place! 🏆', post: posts[3]._id, author: users[5]._id },
      { body: 'The GDG club sessions are super helpful. Learned so much about cloud computing and system design.', post: posts[4]._id, author: users[3]._id },
      { body: 'CSE curriculum at IIIT Surat is well-structured. The electives in AI-ML are particularly strong.', post: posts[5]._id, author: users[6]._id },
      { body: 'Really enjoyed reading about our MEAN stack project journey. We learned so much building this blog!', post: posts[6]._id, author: users[0]._id },
      { body: 'Locho at the Surat street stalls near campus is the best comfort food after a long coding session 😋', post: posts[7]._id, author: users[4]._id },
      { body: 'IIIT Surat is growing fast. Can\'t wait for the new campus to be fully built!', post: posts[0]._id, author: users[5]._id },
      { body: 'Microsoft and Google visiting our campus for placements is a huge achievement for our batch. Congrats to everyone!', post: posts[1]._id, author: users[4]._id },
      { body: 'The MEAN stack blog project was a great hands-on experience. Web Engineering is the best course at IIIT Surat!', post: posts[6]._id, author: users[2]._id },
      { body: 'Dumas Beach sunset + chai = perfect weekend plan for any IIIT Surat student!', post: posts[7]._id, author: users[1]._id }
    ]);
    console.log('Created 12 comments');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials (all passwords: password123):');
    console.log('  surya@iiitsurat.ac.in');
    console.log('  tarun@iiitsurat.ac.in');
    console.log('  sumit@iiitsurat.ac.in');
    console.log('  pankaj@iiitsurat.ac.in');
    console.log('  ronit@iiitsurat.ac.in');
    console.log('  harsh@iiitsurat.ac.in');
    console.log('  bhupendra@iiitsurat.ac.in\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
