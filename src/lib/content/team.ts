import type { TeamGroup, TeamMember } from "@/lib/types";

const t = (name: string, role: string, image: string, extra: Partial<TeamMember> = {}): TeamMember => ({
  name,
  role,
  image,
  ...extra,
});

export const teamGroups: TeamGroup[] = [
  {
    title: "Faculty Advisor",
    members: [
      t("Dr. Biswajit Patra", "Faculty Advisor", "/images/team/Biswajitp.jpg", {
        quote: "Providing academic guidance and strategic direction to SDC.",
        email: "biswajitpatra@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Student Advisor",
    members: [
      t("Manas Nandan", "Student Advisor", "/images/team/manas.jpg", {
        quote: "I overthink everything - mostly on purpose",
        linkedin: "https://www.linkedin.com/in/manas-nandan/",
        email: "manas22@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Secretary",
    members: [
      t("Shlok Saraf", "Secretary", "/images/team/shlok-2.jpeg", {
        quote: "Confuse the confused",
        linkedin: "https://www.linkedin.com/in/shlok-saraf-ss2407/",
        email: "shloks23@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Vice Secretaries",
    members: [
      t("Anuj Wani", "Vice Secretary", "/images/team/anuj.jpg", {
        quote: "Figuring out how to figure out!",
        linkedin: "https://www.linkedin.com/in/anuj--wani",
        email: "wani23@iiserb.ac.in",
      }),
      t("Mattupalli Karthik", "Vice Secretary", "/images/team/karthik.jpg", {
        quote: "Supporting Operations, Coordination, and Smooth Execution of Initiatives.",
        linkedin: "https://www.linkedin.com/in/karthikmattupalli/",
        email: "mattupalli24@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Core Committee",
    members: [
      t("Vansh Mangal", "Operations and Logistics", "/images/team/vansh.jpg", {
        quote: "My identity is limited to being a student of IISER Bhopal.",
        linkedin: "https://www.linkedin.com/in/vanshmangal",
        email: "vanshm24@iiserb.ac.in",
      }),
      t("Aarush Rajan Ranjan", "Ideas, Managing Events and Teams", "/images/team/aarush.jpeg", {
        quote: "To be or not to be that is the question",
        linkedin: "https://www.linkedin.com/in/aarushrajanranjan/",
        email: "aarush24@iiserb.ac.in",
      }),
      t("Madhav", "General Manager", "/images/team/madhav.jpeg", {
        quote: "Hahhahaha",
        linkedin: "https://www.linkedin.com/in/madhav-69141b326/",
        email: "madhav24@iiserb.ac.in",
      }),
      t("Divyam Sood", "Core Committee", "/images/team/divyam.jpeg", {
        quote: "Ask no questions and you'll be told no lies.",
        email: "divyam23@iiserb.ac.in",
      }),
      t("Tirth Shah", "Web and PR", "/images/team/tirth.png", {
        quote: "coffee is the answer to all my questions",
        linkedin: "https://www.linkedin.com/in/tirth-shah-iiserb",
        email: "shah24@iiserb.ac.in",
      }),
      t("Suryansh Upadhyay", "Developer and Core", "/images/team/suri-2.png", {
        quote: "operating on diluted felix felicis",
        email: "suryansh24@iiserb.ac.in",
      }),
      t("Tejas Hadas", "Social Media Head", "/images/team/tejas.jpg", {
        quote: "Trying to balance my CPI, my K/D ratio, and my carbon footprint.",
        email: "hadas24@iiserb.ac.in",
      }),
      t("Drishti Mishra", "Social Media and PR", "/images/team/drishti.jpeg", {
        quote: "Trying to figure out life with puppy face.",
        linkedin: "https://www.linkedin.com/in/drishti-mishra-2b0900394/",
        email: "drishti24@iiserb.ac.in",
      }),
      t("Anshika Joshi", "Design and Content", "/images/team/anshika.jpeg", {
        quote: "slightly addicted to CANVA",
        linkedin: "https://www.linkedin.com/in/anshika-joshi-6161a7323/",
        email: "anshikaj24@iiserb.ac.in",
      }),
      t("Abhishek Sikarwar", "Outreach and PR", "/images/team/abhishek.jpeg", {
        quote: "Graceful exterior, Powerful Interior",
        linkedin: "https://www.linkedin.com/in/abhishek-sikarwar-55b80b325/",
        email: "asikarwar24@iiserb.ac.in",
      }),
      t("Mahi Singh", "PR and Content", "/images/team/mahi.jpg", {
        quote: "Powered by curiosity and a questionable sleep schedule.",
        linkedin: "https://www.linkedin.com/in/mahi-singh-4b093b32b",
        email: "mahi24@iiserb.ac.in",
      }),
      t("Arpit Shrivastav", "Tech and PR", "/images/team/arpit.jpeg", {
        quote: "Tech & PR core member — building solutions and driving outreach for SDC initiatives.",
        linkedin: "https://www.linkedin.com/in/arpitshrivastaw",
        email: "arpit24@iiserb.ac.in",
      }),
      t("Shivam Verma", "Social Media", "/images/team/shivam.jpg", {
        linkedin: "https://www.linkedin.com/in/shivam-verma-098b4b340/",
        email: "shivamv24@iiserb.ac.in",
      }),
      t("Archit Khare", "Core Committee", "/images/team/archit.jpg", {
        quote: "I started to attend the meetings",
        linkedin: "https://www.linkedin.com/in/archit-khare-7114ba268/",
        email: "architk24@iiserb.ac.in",
      }),
      t("Dishank K", "PR and Mining", "/images/team/dishank.jpeg", {
        quote: "Slightly unhinged, mostly intentional",
        linkedin: "https://www.linkedin.com/in/dishank-k-6137b132a/",
        email: "dishank24@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Trainee Team",
    members: [
      t("Aarushi Bhattacharya", "Trainee", "/images/team/aarushi.png", {
        quote: "Versatile, curious, evolving",
        linkedin: "https://www.linkedin.com/in/aarushi-b-244bb5382/",
        email: "aarushi25@iiserb.ac.in",
      }),
      t("Samyak Rokade", "Trainee", "/images/team/samyak.jpg", {
        quote: "living life like there was no yesterday",
        linkedin: "https://www.linkedin.com/in/samyak-rokade-716a45369/",
        email: "samyak25@iiserb.ac.in",
      }),
      t("Sant Solanki", "Trainee", "/images/team/sant.jpg", {
        quote: "BSMS student at IISERB and active part in workings of Student Development Council.",
        linkedin: "https://www.linkedin.com/in/sant-solanki-7bb548393/",
        email: "sant25@iiserb.ac.in",
      }),
      t("Ishika Ashish", "Trainee", "/images/team/ishika.jpg", {
        linkedin: "https://www.linkedin.com/in/ishika-ashish-a01389373/",
        email: "ishika25@iiserb.ac.in",
      }),
      t("Indu Prabha", "Trainee", "/images/team/indu-cropped.jpg", {
        linkedin: "https://www.linkedin.com/in/indu-prabha-a40a95376/",
        email: "indu25@iiserb.ac.in",
      }),
      t("Krishna", "Trainee", "/images/team/krishna.jpeg", {
        quote: "jack of all trades master of none. I participate in all deeds, not just for fun.",
        linkedin: "https://www.linkedin.com/in/krishna-sai-b4442b383/",
        email: "korada25@iiserb.ac.in",
      }),
    ],
  },
];