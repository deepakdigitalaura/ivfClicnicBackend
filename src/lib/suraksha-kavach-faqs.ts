/* Plain (no "use client"/"server-only" directive) data module so this array
 * can be imported unchanged by both the server component page.tsx (for JSON-LD)
 * and the client SurakshaKavachPage component (for the visible accordion) —
 * a value exported from a "use client" file becomes an unusable client
 * reference stub when imported into server code. */
export const DEFAULT_FAQS: { q: string; a: string }[] = [
  {
    q: "What is the Suraksha Kavach Package?",
    a: "Suraksha Kavach is Bavishi Fertility Institute's exclusive IVF protection program — the only one of its kind in the world. Your investment covers multiple IVF cycles.",
  },
  {
    q: "Who is eligible for Suraksha Kavach?",
    a: "Eligibility is determined after an initial consultation and medical evaluation by our senior fertility specialists. Factors such as age, medical history, ovarian reserve, and overall health are assessed. Our doctors will recommend whether Suraksha Kavach is the right fit for your situation.",
  },
  {
    q: "How many IVF cycles are included?",
    a: "The Suraksha Kavach package covers multiple IVF/ICSI cycles as needed. The exact number depends on your personalised treatment plan. The program continues until a healthy live birth is achieved or all agreed-upon cycles are completed.",
  },
  {
    q: "What happens if the treatment is not successful for me?",
    a: "If medical reasons prevent your treatment from succeeding, our team will discuss the best next steps and options available to you as part of your Suraksha Kavach enrolment.",
  },
  {
    q: "What does the package include?",
    a: "The package is comprehensive: consultations, diagnostic investigations, medications, ovarian stimulation, egg retrieval, ICSI/IVF procedure, embryology and lab work, embryo transfer, and post-treatment support. There are no hidden charges.",
  },
  {
    q: "What kind of results has Suraksha Kavach achieved?",
    a: "Suraksha Kavach patients at Bavishi Fertility Institute have achieved excellent outcomes. We are transparent about our results and can share detailed statistics during your consultation — success depends on individual factors such as age, diagnosis and medical history.",
  },
  {
    q: "How do I enrol in Suraksha Kavach?",
    a: "Start by booking a consultation at any of our 14 centres across India. After your initial evaluation, if you are eligible, our team will walk you through the enrolment process, package details, and answer any questions you may have.",
  },
];
