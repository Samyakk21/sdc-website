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
      t("Sidharth Raman", "Student Advisor", "/images/team/sidharth.png", {
        quote: "",
        linkedin: "https://www.linkedin.com/in/sid-raman/",
        email: "manas22@iiserb.ac.in",
      }),
      t("Dhani", "Student Advisor", "/images/team/", {
        quote: "",
        linkedin: "",
        email: "manas22@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Secretary",
    members: [
      t("Mattupalli Karthik", "Secretary", "/images/team/karthik.jpg", {
        quote: "Give yourself a pat on your back whenever you good.",
        linkedin: "https://www.linkedin.com/in/karthikmattupalli/",
        email: "mattupalli24@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "OVERSEERS",
    members: [
      t("Samyak", "TECH Wing", "/images/team/samyak.jpg", {
        quote: "hope does not come without cost",
        linkedin: "https://www.linkedin.com/in/samyak07/",
        email: "samyak25@iiserb.ac.in",
      }),
      t("Ishika Ashish", "Design", "/images/team/ishika2.jpg", {
        quote: "Never witnessed Diminishing Marginal Utility with Canva ;).",
        linkedin: "https://www.linkedin.com/in/ishika-ashish-a01389373/",
        email: "mattupalli24@iiserb.ac.in",
      }),
      t("Angel ", "Information and PR", "/images/team/angel.jpg", {
        quote: "I like cells and stars.",
        linkedin: "https://www.linkedin.com/in/angel-yadav/",
        email: "mattupalli24@iiserb.ac.in",
      }),
      t("AARUSHI BHATTACHARYA", "YLAC", "/images/team/aarushi2.jpeg", {
        quote: "In pursuit of the interesting.",
        linkedin: "https://www.linkedin.com/in/aarushi-244bb5382/",
        email: "mattupalli24@iiserb.ac.in",
      }),
      t("DISHANK K", "E-CELL", "/images/team/dishank.jpeg", {
        quote: "Slightly unhinged, mostly intentional",
        linkedin: "https://www.linkedin.com/in/dishank-k-6137b132a/",
        email: "dishank24@iiserb.ac.in",
      }),
    ],
  },
  {
    title: "Core Committee",
    members: [
      t("Raman Ghame", "PR and Content", "/images/team/raman.JPG", {
        quote: "Overthinking is my cardio.",
        linkedin: "https://www.linkedin.com/in/raman-ghame-a33014329/",
        email: "raman24@iiserb.ac.in",
      }),
      t("Sanjay Swaminathan", "PR", "/images/team/sanjay.jpg", {
        quote: "Somewhere between asking why and figuring out how",
        linkedin: "https://www.linkedin.com/in/sanjay-swaminathan-8b1076393/",
        email: "sanjay25@iiserb.ac.in",
      }),
      t("Sant Solanki", "Operations and PR", "/images/team/sant.jpg", {
        quote: "Take my advice — I'm not using it.",
        linkedin: "https://www.linkedin.com/in/sant-solanki-7bb548393/",
        email: "sant25@iiserb.ac.in",
      }),
      t("Arko Banerjee", "YLAC", "/images/team/arko.jpg", {
        quote: "Recently i have decided to do more of nothing",
        linkedin: "https://www.linkedin.com/in/arko-banerjee-547497386/",
        email: "arko25@iiserb.ac.in",
      }),
      t("Amritash", "Tech and Design", "/images/team/amritash.jpg", {
        quote: "My talent is currently under maintenance",
        linkedin: "https://www.linkedin.com/in/amritash-mishra/",
        email: "amritash25@iiserb.ac.in",
      }),
      t("Naman Kanyal", "Tech", "/images/team/naman.jpg", {
        quote: "Master of none, Larper of all!",
        linkedin: "https://www.linkedin.com/in/naman-kanyal-b2709b431/",
        email: "naman25@iiserb.ac.in",
      }),
      t("Vedant Bhagat", "PR", "/images/team/vedant.jpg", {
        quote: "Learning how to learn",
        linkedin: "https://www.linkedin.com/in/vedant-bhagat-950150371/",
        email: "vedantb25@iiserb.ac.in",
      }),
    ],
  },
  /*{
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
  */
];