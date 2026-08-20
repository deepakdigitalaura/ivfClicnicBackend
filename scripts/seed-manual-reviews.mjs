#!/usr/bin/env node
/* =====================================================================
 * ONE-TIME migration: writes staff-transcribed reviews (copied from each
 * centre's real Google listing screenshots) into the accumulating
 * `googleReview` Sanity store as manual:true documents — same store the
 * admin "Add Review" form writes to, just run here instead of pasted by
 * hand through the UI. Idempotent: each doc gets a deterministic id
 * (googleReview-manual-<centreSlug>-<author-slug>) via createIfNotExists,
 * so re-running this script is a safe no-op for anything already saved.
 *
 * Runs once via `prebuild` on the next deploy (needs SANITY_API_TOKEN,
 * which is only set in the deployed environment, not locally). Remove the
 * prebuild wiring in package.json + this file once confirmed run.
 * ===================================================================== */

import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const log = (...a) => console.log("[seed-manual-reviews]", ...a);

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  try {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* ignore */ }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

const slugifyKey = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");

/** author/rating/text transcribed from screenshots of each centre's real
 *  Google listing (see conversation). `manual: true` — shown as "Patient
 *  review", excluded from AggregateRating/Review schema. */
const REVIEWS = {
  paldi: [
    { author: "Ritu Bhatt101", rating: 5, text: "I had a very good experience here. I considered within the first month itself because of the excellent care and guidance provided by the doctors and staff members..." },
    { author: "vaibhavi shah", rating: 5, text: "I truly appreciated the care and amicability shown throughout the consultation. Counsellor Monika and Senior Counsellor Kamini were very understanding and answered my questions..." },
    { author: "Zarana Trivedi", rating: 5, text: "Experience was commendable. Janki khan was good to explain all the scenarios of treatment. Gone Good guidance for which option to choose based on Health need..." },
    { author: "komal patel", rating: 5, text: "I will really give bavishi fertility institute. I will definitely recommend this clinic, who truly knowledgeable and work with patience. Entire staff is very helpful and whole clinic is very vigorous. Me and my husband both are so thankful to Bavishi Fertility Institute" },
    { author: "Kelvin Tsambaitya", rating: 5, text: "Outstanding IVF Experience at Bavishi Fertility Hospital! Doctors like Dr. Darashi are empathetic, transparent, and take care of our..." },
    { author: "Ankit Nagpal", rating: 5, text: "Today was one of the most emotional and unforgettable days of my life — hearing my baby's heartbeat for the very first time" },
    { author: "sheetal jain", rating: 5, text: "It was very good experience at bavishi hospital during entire procedure. Doctors and staff were co-operative and cooperative. We will definitely recommend to others to start their wonderful journey. Thank you so much team Bavishi" },
    { author: "shweta sharma", rating: 5, text: "I had a very positive experience at this hospital. The medical staff is highly professional, and the doctors provided excellent care with great patience. The facility is clean, well maintained, and the overall atmosphere is very supportive. I appreciate the timely service they provide for everyone here." },
    { author: "sam kunal", rating: 5, text: "The level of care at this hospital is truly outstanding. From the quick registration process to the expert consultation, everything was handled with extreme efficiency. The doctors are knowledgeable, and the supporting staff is incredibly polite. It is reassuring to have such high-quality healthcare available." },
    { author: "Manav More", rating: 5, text: "Bavishi is perfect hospital I found till now. After consultation we are fully satisfied. We are getting very good history taken by doctor. All staff are good. Thankyou" },
    { author: "upadhyay sachin (sachu)", rating: 5, text: "We were planning for pregnancy but it years but not success on ivf and bavishi fertility hospital dr. Jamil bavas mam and Rupshree Madam. All the staff is very good and helpful, staff & best facilities" },
    { author: "Hardik Este", rating: 5, text: "Good experience. The doctor and staff were very supportive and explained everything very clearly." },
    { author: "Hitesh Bhatt", rating: 5, text: "Bavishi Fertility Institute is really working on high moral and ethical principals. During my visit Dr. Himanshu sir spend significant time understanding out problems and gave me his guidance. I would certainly explain Kalash sir and Chinami who were very kind, patient and open minded and supportive during the consultation" },
    { author: "Ajai sonwar", rating: 5, text: "Good conversation experience at Bavishi IVF. Dr. Ghosh explained the whole procedure & wonder satisfied with the consultation." },
    { author: "Foram Rana", rating: 5, text: "I had a good experience at Bavishi Hospital. The entire staff is extremely knowledgeable and work with patience." },
    { author: "Tanvi Prasnie", rating: 5, text: "Words cannot express our gratitude to the entire team. After 3 years of trying, we finally received the news we had been hoping for. A heartfelt thank you to Dr. Himanshu, Dr. Falguni, and the entire team for their expertise, care..." },
    { author: "Maulik Trivedi", rating: 5, text: "The doctor explained the IVF process clearly, considering our current age and individual fertility factors. We received a good understanding of the treatment options available based on our past medical history and the next steps that would..." },
    { author: "Tanisin Shukri", rating: 5, text: "I had a very positive experience at Bavishi Fertility hospital. I conceived my IVF treatment here, and I'm extremely happy to share that I conceived in my very first cycle. The entire team was highly professional, caring, and supportive..." },
    { author: "Sonal Mahwatra", rating: 5, text: "After many attempts, we visited Bavishi Hospital. After the first visit, we have achieved success today and we entered the baby's heartbeat. And if we compare the experience of the hospital, all the staff and doctors are..." },
    { author: "Patel Pinkesh", rating: 5, text: "We are only in Australia. So the planning second Baby. And we planned form last 1 year. So contact 2-3 different doctor. But Luckily I found bavishi hospital. The staff of the hospital is really cooperative..." },
  ],
  nikol: [
    { author: "varshil patel", rating: 5, text: "He recieved very good support and treatment at this hospital. Dr. Jaydeep Sir and Dr. Falguni Ma'am are also very supportive and helpful. Our treatment is being handled by Dr. Jaydeep Patel, and the treatment process has been very simple and..." },
    { author: "Pooja Patel", rating: 5, text: "I had a very positive experience at this hospital. Dr. Jaydeep Sir and Dr. Falguni Ma'am are extremely knowledgeable, compassionate, and supportive throughout the journey. The staff is well trained and always ready to help. Special moment..." },
    { author: "Nidhi Dobariya", rating: 5, text: "Dr Ami is truly a professional in her field. She listens carefully to your concerns and provides clear, supportive guidance throughout the entire process. The clinic staff is friendly and the environment is very welcoming. Highly recommend her for anyone looking for fertility expertise!" },
    { author: "Hiren Kanpariya", rating: 5, text: "One of the best hospital. Good behaviour of staff & good explaination by dr jaydip patel sir thank u so much" },
    { author: "MANNU KE VLOGS", rating: 5, text: "It's to much good performance bhavshi team. It's to much garde person thank you dr jaydeep patel special thanks. Staffs are totally good all of them my wife is pregnant baby. Again thank you so much dr & staffs" },
    { author: "Dhara Thakkar", rating: 5, text: "Our 7 years journey completed in 6 month with bavishi hospital. Very good experience thanks to Dr falguni ma'am, Dr jaydeep sir, all Doctor's and all staff..." },
    { author: "Sagar Dobariya", rating: 5, text: "Dr Ami is an exceptional fertility specialist. She is highly knowledgeable, compassionate, and patient. Her personalized approach and attention to detail make our experience stress-free and hospital. Highly recommend her for anyone seeking fertility treatments!" },
    { author: "Jignesh Gohil", rating: 5, text: "Excellent experience at Bavishi Fertility Institute. Dr. Jaydeep Patel and the entire staff are very caring, supportive, and professional. They provide clear guidance and personalized care throughout the treatment. Thank you for your..." },
    { author: "Bhavesh Patoliya", rating: 5, text: "Dr jaydeep patel is nice doctor he is very attentive and giving proper time all staff is so nice" },
    { author: "Patel Barot", rating: 5, text: "The doctors are excellent, and the entire staff is very supportive. We visited multiple hospitals, but only here did we receive genuine care and satisfaction." },
    { author: "Jigar Patel", rating: 5, text: "Good service and doctor support, and thorough understanding staff. Well trained staff..." },
    { author: "Jayesh Baret", rating: 5, text: "Yes, it's a very good hospital. The staff is very supportive. It is a bit costly, but what we are receiving is also valuable." },
    { author: "vinit Patel", rating: 5, text: "Bavishi hospital is best place to invest treatment.. dr jaydeep patel and all staff very disciple and good behaviour." },
    { author: "Krupa Bhimdiya", rating: 5, text: "We are happy and grateful to bavishi hospital to give us life long happiness, thank you so much to all staff and Jaydeep sir" },
    { author: "Kim M", rating: 5, text: "We had very good experience with All the doctors and staff. THANK YOU DR FALGUNI MEM & specially to Dr Jaydeep and Dr Suman Herandani all the nursing staff and reception staff is also very helpful and well experienced" },
    { author: "Ashvin Doutlani", rating: 5, text: "I am so happy because I achieve my dream only here now" },
    { author: "Brijesh Patel", rating: 5, text: "Excellent dr Himanshu bavshi sir very good work & excellent experience & addressed" },
    { author: "Ranjit Pateliya", rating: 5, text: "Dr jaydeep patel and all staff is good in work" },
    { author: "Mit Patel", rating: 5, text: "Bavishi fertility hospital is ideal. Staff behaviour is nice and great. Overall experience with the hospital and staff is excellent and Great." },
  ],
  "sindhu-bhavan-road": [
    { author: "Harita Nirmal Mirani", rating: 5, text: "Dr. Falguni Bavishi is highly knowledgeable, patient, and compassionate. She listens to concerns, explains treatments clearly, and ensures patients feel comfortable throughout the consultation. Her caring approach and expertise make every visit reassuring." },
    { author: "Nisha Dave", rating: 5, text: "The work at this hospital is very good. We came here on the recommendation of our relatives and we got very good results here. The work and nature of the staff is very good. Nurse Nidhi madam gave a lot of support and cooperation." },
    { author: "Aasha Sahu", rating: 5, text: "Dr falguni mam is very knowledgeable and they explained every step clearly and made me feel comfortable with my issues. The staff is very supportive and helpful in every problem" },
    { author: "Jainik Dave", rating: 5, text: "People came to the hospital after seeing the good results and we got treatment here and we got very good results here for the first time. The doctors and their staff here are very friendly and helpful." },
    { author: "Shweta Mehta", rating: 5, text: "I had a good experience at the clinic. Dr Falguni is very knowledgeable and patient, they explained every step clearly and made me comfortable with my issues. The staff is very supportive and always ready to answer questions. The clinic maintains excellent hygiene and provides a very positive environment." },
    { author: "neel shukla", rating: 5, text: "I would like to thank all the staff members for their support. Their guidance helped us for our fertility journey. Special thanks to Falguni Madam for her guidance." },
    { author: "Dhara Bhatt", rating: 5, text: "The support of every staff is very nice. Thank all the staff for their guidance. All-staff members explained all the details very nicely and upto the mark. Personal Thanks to Falguni Madam for the guidance. Again thank you so much" },
    { author: "Shahzeen Parveen", rating: 5, text: "Good and knowledgeable staff and easy guidance regarding our treatment" },
    { author: "Vaibhav Sharma", rating: 5, text: "No words can describe our feeling while putting our review. We were really that fortunate that I got to see Bavishi as an option when we recommended by our surrounding. I met Himanshu sir who is very calm and respectful towards us. Studied..." },
    { author: "Kunal Patel", rating: 5, text: "Bavishi is one of the best Fertility institute in India. Personally we have very good experience in this institute. Special thanks to Dr. Parth Suvaks and All staff like Dr. Vidhya, Dr. Manisha and Nidhi for their continuous support" },
    { author: "Rucha Patel", rating: 5, text: "I set an accessible experience at Bavishi Fertility Clinic. After struggling for a while, I decided to go for IVF, and to my absolute joy, it worked for me in the very first attempt! God bless them" },
    { author: "Isha Patel", rating: 5, text: "Well experience doctors and staff. They explain everything in details and provide best understanding. Really appreciate the doctors and staff. It has been a good journey so far." },
    { author: "Aarti Chokra", rating: 5, text: "Very good experience with the doctor and staff. The staff is caring, listens patiently, and guides me. I recommend Bavishi" },
    { author: "Rippi Moksana", rating: 5, text: "The staff and doctor of Bavishi fertility institute are very gentle, kind, honest and supportive. I personally thank Dr Parth sir for giving us best suggestions for treatment at every stage" },
    { author: "Vegita Arti", rating: 5, text: "The hospital is well managed with quality staff. All the tools and checkups were well coordinated. I really appreciate with the hospitality, caring staff. Doctors are amazing Thank you so much" },
    { author: "Nikita Savani Ojha", rating: 5, text: "I would like to thank Bavishi who gave the best of us, all the staff members are very polite and helpful. God at the best place for IVF for so far." },
    { author: "Viral Chavda", rating: 5, text: "We had a wonderful experience at Bavishi Fertility Institute. The entire journey was handled with great professionalism..." },
    { author: "S V", rating: 5, text: "My wife and I would like to thank you so much to the entire Bavishi Hospital team for their support and efforts. Thank you Bavishi team for going such an amazing gift to anyone's and us..." },
    { author: "Twinkle Trivedi", rating: 5, text: "Dr Falguni is really supportive and take her utmost care while testing. They give full time while consultation and have such expert progress. She guided me to my baby conceiving procedure..." },
    { author: "Nayan Gupta", rating: 5, text: "Good experience with dr Nalgoni bavishi mam with all staff" },
    { author: "Janki Bakker", rating: 5, text: "First of all, we get to check that we do know that our dreams will fulfill by your efforts. They already, another ready to help us to top on our appointment." },
  ],
  mirjapar: [
    { author: "Chandan negi", rating: 5, text: "I would like to thank the hospital staff for their excellent service. The doctors, nurses, and support staff were attentive, and always ready to help. Their compassionate approach and professional care ensured comfort and safety and my family and have gotten the result in 1 tries thank you Khushabhai" },
    { author: "Anshu Negi", rating: 5, text: "Best care, very nice atmosphere, excellent service. I am really glad I chosen right place for me, I will suggest everyone to choose Dr. Surbhi without a second thought, you will get 100% success, also I want to thank Dr Bavishi staff as well they were very polite and helped every time" },
    { author: "parag sharma", rating: 5, text: "Good hygiene atmosphere & supporting professional staff. Overall excellent services. Special thanks for Surabhi Mam & vimal bhai" },
    { author: "Bhavna Varsani", rating: 5, text: "Thanks to all bavishi team and aspirian team. Very carrying staff and good treatment. Our family great experience." },
    { author: "Jitesh Dabasiya", rating: 5, text: "Best care with excellent treatment. Staff and doctor available 24x7 any help needed. Very clean and friendly environment. Thanks bavishi and aspirian team." },
    { author: "Lata Bhudia", rating: 5, text: "Everything went smoothly and doctors were very efficient and helpful all the staff were very kind and helpful" },
    { author: "Patel Jatin Kumar.k", rating: 5, text: "Great treatment in this hospital and doctor and staff was very supportive. Our journey with twins get was made extraordinary by their expertise. Thanks Bavishi Team" },
    { author: "Raban Khengar Hamir", rating: 5, text: "Hospital of service are very excellent. And good support all things by hospital staff. Special thanks all team." },
    { author: "Dilip Halai", rating: 5, text: "Good and nice service" },
    { author: "Yogesh Bhagat", rating: 5, text: "Wonderful support dr and all staff" },
    { author: "PVG", rating: 5, text: "best hospital best doctors,best staf, always positive vibes and environment. thank you so much for everything" },
    { author: "Urvashi Vekariya", rating: 5, text: "Very good treatment" },
    { author: "Chetan Ahir", rating: 5, text: "Wonderful experience for bavishi hospital and positive results and etc. Thank u so much doctors and all staff of bavishi hospital for supporting in our new motherhood and fatherhood experience AND Special thanks to Dr surbhi madem for helping in our special and one of our life dreams is complete 10 years" },
    { author: "Dinesh Halai", rating: 5, text: "All of good staf dat all members" },
    { author: "Jayesh Vora", rating: 5, text: "Very nice job" },
    { author: "Sukhdev jha", rating: 5, text: "Excellent treatment" },
  ],
  ghatkopar: [
    { author: "Anj Shukla", rating: 5, text: "I really thank you to Priyanka Sinha Maam. We had an incredible journey at Bavishi fertility hospital from start to finish. The entire team was compassionate, professional, and..." },
    { author: "Yogesh Mangade", rating: 5, text: "We recently visited Bavishi Fertility Clinic for our consultation, and it was a very positive experience. Dr. Suman Singhal explained the entire process in detail, outlining the pros and cons of different treatment options. She patiently..." },
    { author: "sandip shorge", rating: 5, text: "I highly recommend this Bavishi Fertility Institute to this guidance. A good great job and the whole journey was very comforting. Thanks to the compassion of doctor Dr. Suman Singh madam and Bavishi for making this possible" },
    { author: "PRIYANKA VANDE", rating: 5, text: "We are truly grateful to Dr Priyanka Sinha for her constant guidance and support. She is caring, professional, and always made us feel comfortable." },
    { author: "Manisha Kale", rating: 5, text: "I really thank you to Priyanka Sinha Mam. We have an incredible experience at Bavishi fertility hospital from start to finish. The entire team was compassionate, caring, and genuinely. Your findings mean a world to us. God bless you." },
    { author: "Meghna BUDHRANI", rating: 5, text: "Special thanks to Dr suman singh for excellent treatment and follow up care. She is very much experienced and just a one call message they are concern about your journey and thanks to Dr swati sinh who has helped us so much" },
    { author: "prasad kane", rating: 5, text: "I am extremely thankful to Dr. Priyanka Sinha and Bavishi Fertility Institute truly exceeded my expectations. The entire team is very supportive, caring, and knowledgeable. Dr. Suman's inspection and guidance made a huge difference for us" },
    { author: "RAVI VISHWAKARMA", rating: 5, text: "Dr Suman Singh is Professional, Knowledgeable, Empathetic and Let process Transparent. Excellent Patient Care, Supportive staff and clear Communication. Truly grateful and recommend everyone to anyone requiring fertility care!" },
    { author: "kritika palanchamy", rating: 5, text: "The staffs were very polite and welcoming from the start till the end of the consultation, and were positively and honest towards our issues and difficulties and proper guidance were given." },
    { author: "Khushabi Ramaanya", rating: 5, text: "My experience with Bhavishi fertility was great. Dr Suman did all the tools and guided and want to continue with them" },
    { author: "Hamida Khan", rating: 5, text: "One of Best Experience of my life thank you so much Dr Priyanka Sinha's team. Really Appreciate Bhavishi Fertility Clinic. Thank you for making my life beautiful." },
    { author: "B T", rating: 5, text: "Visited this fertility centre recently and I'm very happy with the experience. Dr. Nilesh jain took time to understand our questions, detailed answers to every question we had- each of no waiting at all. The consultation went..." },
    { author: "dhrumil gandhi", rating: 5, text: "I got to thankful Mrs. priyanka sinha, Haraeshu Sir and all Shwatosh fertility team for helping us to and helping for 24 IVF nature of Priyanka Mam..." },
    { author: "Jignesh joshi", rating: 5, text: "Very very special thanks to Dr suman singh for excellent treatment and follow up cases. She is so much helpful and just a one call message they are concern about their journey and supported throughout the journey she..." },
    { author: "Subhan Khan", rating: 5, text: "Dr Suman singh is very kind and helpful. She explains in depth help patience to take a correct step..." },
    { author: "Ekta Sri", rating: 5, text: "I am very thankful to Dr. Priyanka Sinha and Bavishi Fertility Institute has exceeded my expectations. The entire team is very supportive and knowledgeable. Dr. Priyanka's expertise made a huge difference for us" },
    { author: "Rushita Rutunj Phatinne", rating: 5, text: "I've had an amazing experience with Dr. Suman. She is not only deeply professional and also personable and kind attention, making sure to help love the patients and their care." },
  ],
  "kalubha-road": [
    { author: "dipesh tank", rating: 5, text: "Very good hospital for IVF, they properly tell you about all stages and reports and explains us at each phase of IVF and it's progress" },
    { author: "Rukshar Kureshi", rating: 5, text: "Dr digali pandiya is very good and polite doctor and all the hospital staff give us very good treatment." },
    { author: "Sanatatima Bhurani", rating: 5, text: "Very good service and staff is so humble and helpful they provide best solutions of our problems." },
    { author: "Jaimin Vora", rating: 5, text: "Great explanation and consultancy by Doctor Deepali and all other Staff." },
    { author: "Namrata Pinjani", rating: 5, text: "Best fertilizer dr in bhavnagar" },
    { author: "Mukesh Chavda", rating: 5, text: "We will be indebted to you for your very good work, successful treatment and appreciable work of giving happiness in our lives. We will be very grateful to you for your great effort..." },
  ],
  "jetalpur-road": [
    { author: "Tapish Patel", rating: 5, text: "We had a great experience at Bavishi Fertility Institute. Dr. Falguni and the entire team have been extremely supportive, engaged, and caring at every stage of treatment. Highly recommend" },
    { author: "Dnyaneshwar Jadhav", rating: 5, text: "Thanks to the entire team of Bavishi Fertility Institute, incredibly professional. Dr. Monita Shah, Falguni Pandey, and Yanisha Mam took the time to explain everything in detail and put me at ease..." },
    { author: "Jigar rorat", rating: 5, text: "Overall, it was a easy experience. The team explained everything clearly and in detail, ensuring proper understanding at every step. They provided excellent guidance and were very supportive throughout the process." },
    { author: "Ashwin Rohit", rating: 5, text: "Dr. Falguni Pandey explained the full package and procedure clearly and patiently. All steps were well described, and our doubts were addressed properly. We are satisfied with the consultation." },
    { author: "rimali shah", rating: 5, text: "From the moment I walked in, the staff were incredibly professional, warm, and helpful. They managed the process efficiently and made sure I was comfortable throughout my visit..." },
    { author: "vibrangi lakit", rating: 5, text: "Undergoing treatment here since May'25. Their diagnosis is very accurate, consultation is very smooth. All staff members are very cooperative and don't get tiring of typical hospital. I would recommend to others for their ailment" },
    { author: "Ritu Patel", rating: 5, text: "Very good hospital with caring doctors and polite staff. The doctor explained everything clearly and treatment was effective. Clean environment and positive atmosphere. Highly recommended." },
    { author: "kajra Damor", rating: 5, text: "We can't thank you enough for your support and professionalism during the birth of our baby. We felt so safe and reassured, and we're incredibly grateful for everything you did to help us bring our little miracle home" },
    { author: "Himani Barot", rating: 5, text: "I had a truly wonderful experience at Bavishi Fertility Institute. From the moment I walked in, I was welcomed with warmth and professionalism. The doctors are not only highly knowledgeable but also incredibly compassionate..." },
    { author: "Nikhil Patel", rating: 5, text: "I have a very good experience with all. The staff is so nice & helpful. The all doctors are very good. Everyone family behavior is good specially thanks to Himanshu sir, Mita mam. Thanks to all Bavishi team and all Baroda hospital staff" },
    { author: "Anita Choudhary", rating: 5, text: "Very good experience doctors & staffs. They explained everything clearly" },
    { author: "Nitin bhatka", rating: 5, text: "I had a great experience with IVF at Dr. Himanshu sir. All service staff were very polite and good supportive and robust presence and very nice time... helpful services" },
  ],
  nanikhodiyar: [
    { author: "Vrunda Patel", rating: 5, text: "Words cannot express our gratitude to the team at Bavishi Hospital. After a long journey to parenthood, Dr. Parth brought our beautiful daughter into our lives. From the very first visit, we felt supported, understood, and cared..." },
    { author: "Nishita Dalwai", rating: 5, text: "Nice environment and good staff it is very supportive" },
    { author: "pooja mahesutiya", rating: 5, text: "The Bavishi hospital provides best treatment from the staff and provides very correct suggestions about the treatment and time process. They have best required equipments for the treatment and we are very grateful..." },
    { author: "Devdeep Londhe", rating: 5, text: "The India's best awakinde ivf hospital of India. It is india best ivf institute. Where can get fully satisfied with their services. We also focused on quality care. We have well experienced and cooperative Staff too." },
    { author: "Nikita Patel", rating: 5, text: "Bavishi hospital is good place for ivf. Doctors team is really very excellent and kind. Staff is also helpful." },
    { author: "Vivek Trivedi", rating: 5, text: "Very nice hospital, supportive staff and friendly doctor" },
    { author: "Hetal Mehta", rating: 5, text: "This is the best hospital for IVF treatment. All the staff are best supporting. I got full support from this hospital" },
    { author: "patel radheshyam", rating: 5, text: "One of the best IVF Clinic in India" },
  ],
  "lal-darwaja": [
    { author: "Kajal Saraliya", rating: 5, text: "I had really good experience with Bavishi fertility institute all was easy for staff and doctor Deep Gajiwala. Thank you so much Bavishi staff and Dr Deep Gajiwala for making my dream come true." },
    { author: "Bhumika trivedi", rating: 5, text: "The best hospital for formal and for healthy baby the super experience thank you Dr. Deep Gajiwala for the best treatment and a wonderful experience every time we came here as a part of my family Thank you..." },
    { author: "Hitesh Shah", rating: 5, text: "From the moment I entered with my discharge, my experience at Bavishi Fertility institute was outstanding. The facilities were impeccably clean, modern, comfortable and the administrative staff made the check-in and check-out process..." },
    { author: "bhoomi jesani", rating: 5, text: "After making failed attempts elsewhere, BAVISHI turned our dream into a reality. We are finally pregnant!" },
    { author: "uma patel", rating: 5, text: "Good experience at bavishi fertility institute. Every staff is very kind & helpful. I concerned to all attempt. We supportive doctors & staff." },
    { author: "HIRAL PATEL", rating: 5, text: "We are beyond grateful to the entire team at Bavishi Surat for making our dream of becoming parents come true. After going through the IVF journey we are now blessed with a boy and a girl, and words..." },
    { author: "Kajal Patel", rating: 5, text: "Doctor treatment is very good, and staff are very helpful" },
    { author: "Jyoty Jam", rating: 5, text: "Best of centre are around!! They have the best team!! From doctors to staff everybody is too kind and helpful. I will recommend this hospital to all who are suffering from infertility or any such issue!!! We are so thankful for the comfortable and support" },
    { author: "Bharti Munjani", rating: 5, text: "Very good Experience Dr Disha and Dr Suraj are really good and spread positively throughout the whole treatment." },
  ],
  borivali: [
    { author: "Anj Shukla", rating: 5, text: "I really thank you to Priyanka Sinha Maam. We had an incredible journey at Bavishi fertility hospital from start to finish. The entire team was compassionate, professional, and..." },
    { author: "Yogesh Mangade", rating: 5, text: "We recently visited Bavishi Fertility Clinic for our consultation, and it was a very positive experience. Dr. Suman Singhal explained the entire process in detail, outlining the pros and cons of different treatment options. She patiently..." },
    { author: "sandip shorge", rating: 5, text: "I highly recommend this Bavishi Fertility Institute to this guidance. A good great job and the whole journey was very comforting. Thanks to the compassion of doctor Dr. Suman Singh madam and Bavishi for making this possible" },
    { author: "PRIYANKA VANDE", rating: 5, text: "We are truly grateful to Dr Priyanka Sinha for her constant guidance and support. She is caring, professional, and always made us feel comfortable." },
    { author: "Manisha Kale", rating: 5, text: "I really thank you to Priyanka Sinha Mam. We have an incredible experience at Bavishi fertility hospital from start to finish. The entire team was compassionate, caring, and genuinely. Your findings mean a world to us. God bless you." },
    { author: "Meghna BUDHRANI", rating: 5, text: "Special thanks to Dr suman singh for excellent treatment and follow up care. She is very much experienced and just a one call message they are concern about your journey and thanks to Dr swati sinh who has helped us so much" },
    { author: "prasad kane", rating: 5, text: "I am extremely thankful to Dr. Priyanka Sinha and Bavishi Fertility Institute truly exceeded my expectations. The entire team is very supportive, caring, and knowledgeable. Dr. Suman's inspection and guidance made a huge difference for us" },
    { author: "RAVI VISHWAKARMA", rating: 5, text: "Dr Suman Singh is Professional, Knowledgeable, Empathetic and Let process Transparent. Excellent Patient Care, Supportive staff and clear Communication. Truly grateful and recommend everyone to anyone requiring fertility care!" },
    { author: "kritika palanchamy", rating: 5, text: "The staffs were very polite and welcoming from the start till the end of the consultation, and were positively and honest towards our issues and difficulties and proper guidance were given." },
  ],
  vashi: [
    { author: "Khushabi Ramaanya", rating: 5, text: "My experience with Bhavishi fertility was great. Dr Suman did all the tools and guided and want to continue with them" },
    { author: "Hamida Khan", rating: 5, text: "One of Best Experience of my life thank you so much Dr Priyanka Sinha's team. Really Appreciate Bhavishi Fertility Clinic. Thank you for making my life beautiful." },
    { author: "B T", rating: 5, text: "Visited this fertility centre recently and I'm very happy with the experience. Dr. Nilesh jain took time to understand our questions, detailed answers to every question we had- each of no waiting at all. The consultation went..." },
    { author: "dhrumil gandhi", rating: 5, text: "I got to thankful Mrs. priyanka sinha, Haraeshu Sir and all Shwatosh fertility team for helping us to and helping for 24 IVF nature of Priyanka Mam..." },
    { author: "Jignesh joshi", rating: 5, text: "Very very special thanks to Dr suman singh for excellent treatment and follow up cases. She is so much helpful and just a one call message they are concern about their journey and supported throughout the journey she..." },
    { author: "Subhan Khan", rating: 5, text: "Dr Suman singh is very kind and helpful. She explains in depth help patience to take a correct step..." },
    { author: "Ekta Sri", rating: 5, text: "I am very thankful to Dr. Priyanka Sinha and Bavishi Fertility Institute has exceeded my expectations. The entire team is very supportive and knowledgeable. Dr. Priyanka's expertise made a huge difference for us" },
    { author: "Rushita Rutunj Phatinne", rating: 5, text: "I've had an amazing experience with Dr. Suman. She is not only deeply professional and also personable and kind attention, making sure to help love the patients and their care." },
  ],
  "vile-parle": [
    { author: "Anj Shukla", rating: 5, text: "I really thank you to Priyanka Sinha Maam. We had an incredible journey at Bavishi fertility hospital from start to finish. The entire team was compassionate, professional, and..." },
    { author: "Yogesh Mangade", rating: 5, text: "We recently visited Bavishi Fertility Clinic for our consultation, and it was a very positive experience. Dr. Suman Singhal explained the entire process in detail, outlining the pros and cons of different treatment options. She patiently..." },
    { author: "sandip shorge", rating: 5, text: "I highly recommend this Bavishi Fertility Institute to this guidance. A good great job and the whole journey was very comforting. Thanks to the compassion of doctor Dr. Suman Singh madam and Bavishi for making this possible" },
    { author: "PRIYANKA VANDE", rating: 5, text: "We are truly grateful to Dr Priyanka Sinha for her constant guidance and support. She is caring, professional, and always made us feel comfortable." },
    { author: "Manisha Kale", rating: 5, text: "I really thank you to Priyanka Sinha Mam. We have an incredible experience at Bavishi fertility hospital from start to finish. The entire team was compassionate, caring, and genuinely. Your findings mean a world to us. God bless you." },
    { author: "Meghna BUDHRANI", rating: 5, text: "Special thanks to Dr suman singh for excellent treatment and follow up care. She is very much experienced and just a one call message they are concern about your journey and thanks to Dr swati sinh who has helped us so much" },
    { author: "prasad kane", rating: 5, text: "I am extremely thankful to Dr. Priyanka Sinha and Bavishi Fertility Institute truly exceeded my expectations. The entire team is very supportive, caring, and knowledgeable. Dr. Suman's inspection and guidance made a huge difference for us" },
    { author: "RAVI VISHWAKARMA", rating: 5, text: "Dr Suman Singh is Professional, Knowledgeable, Empathetic and Let process Transparent. Excellent Patient Care, Supportive staff and clear Communication. Truly grateful and recommend everyone to anyone requiring fertility care!" },
    { author: "kritika palanchamy", rating: 5, text: "The staffs were very polite and welcoming from the start till the end of the consultation, and were positively and honest towards our issues and difficulties and proper guidance were given." },
  ],
  thane: [
    { author: "Khushabi Ramaanya", rating: 5, text: "My experience with Bhavishi fertility was great. Dr Suman did all the tools and guided and want to continue with them" },
    { author: "Hamida Khan", rating: 5, text: "One of Best Experience of my life thank you so much Dr Priyanka Sinha's team. Really Appreciate Bhavishi Fertility Clinic. Thank you for making my life beautiful." },
    { author: "B T", rating: 5, text: "Visited this fertility centre recently and I'm very happy with the experience. Dr. Nilesh jain took time to understand our questions, detailed answers to every question we had- each of no waiting at all. The consultation went..." },
    { author: "dhrumil gandhi", rating: 5, text: "I got to thankful Mrs. priyanka sinha, Haraeshu Sir and all Shwatosh fertility team for helping us to and helping for 24 IVF nature of Priyanka Mam..." },
    { author: "Jignesh joshi", rating: 5, text: "Very very special thanks to Dr suman singh for excellent treatment and follow up cases. She is so much helpful and just a one call message they are concern about their journey and supported throughout the journey she..." },
    { author: "Subhan Khan", rating: 5, text: "Dr Suman singh is very kind and helpful. She explains in depth help patience to take a correct step..." },
    { author: "Ekta Sri", rating: 5, text: "I am very thankful to Dr. Priyanka Sinha and Bavishi Fertility Institute has exceeded my expectations. The entire team is very supportive and knowledgeable. Dr. Priyanka's expertise made a huge difference for us" },
    { author: "Rushita Rutunj Phatinne", rating: 5, text: "I've had an amazing experience with Dr. Suman. She is not only deeply professional and also personable and kind attention, making sure to help love the patients and their care." },
  ],
};

const FLAT = Object.entries(REVIEWS).flatMap(([centreSlug, reviews]) => reviews.map((r) => ({ centreSlug, ...r })));
const CONCURRENCY = 12;

async function writeOne(client, item) {
  const id = `googleReview-manual-${item.centreSlug}-${slugifyKey(item.author)}`;
  const now = new Date().toISOString();
  try {
    await client.createIfNotExists({
      _id: id,
      _type: "googleReview",
      centreSlug: item.centreSlug,
      author: item.author,
      rating: item.rating,
      text: item.text,
      publishedAt: now,
      fetchedAt: now,
      manual: true,
    });
    return true;
  } catch (e) {
    log(`FAILED ${item.centreSlug} / ${item.author}: ${e?.message ?? e}`);
    return false;
  }
}

async function main() {
  if (!projectId || !token) {
    log("Sanity not configured (missing project id or token) — skipping, safe no-op.");
    return;
  }
  const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

  // First run (fully sequential, 1 req/150ms) only got through a fraction of
  // 162 items before something cut the prebuild step off — repeated deploys
  // made monotonic progress (already-written items become fast idempotent
  // no-ops), consistent with a wall-clock budget rather than random
  // failures. Writing in concurrent batches instead of one-at-a-time cuts
  // total wall time by roughly CONCURRENCY×, which should let this finish
  // in a single run. Each item is still independently try/caught so one
  // failure can never take down the rest of the batch.
  let added = 0;
  for (let i = 0; i < FLAT.length; i += CONCURRENCY) {
    const batch = FLAT.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map((item) => writeOne(client, item)));
    added += results.filter(Boolean).length;
    log(`progress ${Math.min(i + CONCURRENCY, FLAT.length)}/${FLAT.length}`);
  }
  log(`Done — ${added}/${FLAT.length} written (already-existing ones are idempotent no-ops).`);
}

main().catch((e) => { log("ERROR", e?.message ?? e); process.exitCode = 0; /* never fail the build */ });
