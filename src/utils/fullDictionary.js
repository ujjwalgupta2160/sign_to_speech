// Complete Sign Language Lexicon: Full Alphabet (A-Z), Numbers (0-10), and Comprehensive Vocabulary
// Designed for Indian Sign Language (ISL) & American Sign Language (ASL)

export const ALPHABET_A_TO_Z = [
  { id: 'letter_a', letter: 'A', name: 'Letter A', description: 'Closed fist with thumb resting alongside index finger pointing upward', category: 'Alphabet', isLetter: true },
  { id: 'letter_b', letter: 'B', name: 'Letter B', description: 'Four fingers straight up touching, thumb folded across palm', category: 'Alphabet', isLetter: true },
  { id: 'letter_c', letter: 'C', name: 'Letter C', description: 'Curved hand forming a C shape with fingers and thumb', category: 'Alphabet', isLetter: true },
  { id: 'letter_d', letter: 'D', name: 'Letter D', description: 'Index finger straight up, thumb touching middle finger forming an O', category: 'Alphabet', isLetter: true },
  { id: 'letter_e', letter: 'E', name: 'Letter E', description: 'All fingers curled tightly in, thumb folded horizontally under fingertips', category: 'Alphabet', isLetter: true },
  { id: 'letter_f', letter: 'F', name: 'Letter F', description: 'Index and thumb forming a circle, other three fingers upright and spread', category: 'Alphabet', isLetter: true },
  { id: 'letter_g', letter: 'G', name: 'Letter G', description: 'Index and thumb pointing sideways parallel like a small pinch distance', category: 'Alphabet', isLetter: true },
  { id: 'letter_h', letter: 'H', name: 'Letter H', description: 'Index and middle fingers extended sideways horizontally together', category: 'Alphabet', isLetter: true },
  { id: 'letter_i', letter: 'I', name: 'Letter I', description: 'Pinky finger straight up, other fingers folded into fist with thumb across', category: 'Alphabet', isLetter: true },
  { id: 'letter_j', letter: 'J', name: 'Letter J', description: 'Pinky finger tracing a J curve in the air', category: 'Alphabet', isLetter: true },
  { id: 'letter_k', letter: 'K', name: 'Letter K', description: 'Index finger up, middle finger angled forward, thumb tucked between them', category: 'Alphabet', isLetter: true },
  { id: 'letter_l', letter: 'L', name: 'Letter L', description: 'Thumb and index finger forming a sharp 90-degree L shape', category: 'Alphabet', isLetter: true },
  { id: 'letter_m', letter: 'M', name: 'Letter M', description: 'Three fingers draped over the thumb tucked between ring and pinky', category: 'Alphabet', isLetter: true },
  { id: 'letter_n', letter: 'N', name: 'Letter N', description: 'Two fingers (index & middle) draped over thumb', category: 'Alphabet', isLetter: true },
  { id: 'letter_o', letter: 'O', name: 'Letter O', description: 'All fingertips touching thumb tip forming a circular O shape', category: 'Alphabet', isLetter: true },
  { id: 'letter_p', letter: 'P', name: 'Letter P', description: 'Letter K hand shape pointed downward towards floor', category: 'Alphabet', isLetter: true },
  { id: 'letter_q', letter: 'Q', name: 'Letter Q', description: 'Letter G shape pointing downward towards floor', category: 'Alphabet', isLetter: true },
  { id: 'letter_r', letter: 'R', name: 'Letter R', description: 'Index and middle fingers crossed over each other like good luck gesture', category: 'Alphabet', isLetter: true },
  { id: 'letter_s', letter: 'S', name: 'Letter S', description: 'Tight fist with thumb crossed firmly over all four fingers', category: 'Alphabet', isLetter: true },
  { id: 'letter_t', letter: 'T', name: 'Letter T', description: 'Fist with thumb poking through between index and middle fingers', category: 'Alphabet', isLetter: true },
  { id: 'letter_u', letter: 'U', name: 'Letter U', description: 'Index and middle fingers extended straight up together touching', category: 'Alphabet', isLetter: true },
  { id: 'letter_v', letter: 'V', name: 'Letter V', description: 'Index and middle fingers extended straight up spread into a V', category: 'Alphabet', isLetter: true },
  { id: 'letter_w', letter: 'W', name: 'Letter W', description: 'Index, middle, and ring fingers extended and spread into a W', category: 'Alphabet', isLetter: true },
  { id: 'letter_x', letter: 'X', name: 'Letter X', description: 'Index finger hooked like a pirate hook, other fingers closed', category: 'Alphabet', isLetter: true },
  { id: 'letter_y', letter: 'Y', name: 'Letter Y', description: 'Thumb and pinky extended wide, middle three fingers folded', category: 'Alphabet', isLetter: true },
  { id: 'letter_z', letter: 'Z', name: 'Letter Z', description: 'Index finger drawing a Z shape in the air', category: 'Alphabet', isLetter: true }
];

export const NUMBERS_0_TO_10 = [
  { id: 'num_0', name: '0 (Zero)', digit: '0', description: 'O shape formed with fingers and thumb', category: 'Numbers' },
  { id: 'num_1', name: '1 (One)', digit: '1', description: 'Index finger straight up, all other fingers closed into fist', category: 'Numbers' },
  { id: 'num_2', name: '2 (Two)', digit: '2', description: 'Index and middle fingers extended up spread into a V shape', category: 'Numbers' },
  { id: 'num_3', name: '3 (Three)', digit: '3', description: 'Thumb, index, and middle fingers extended outward', category: 'Numbers' },
  { id: 'num_4', name: '4 (Four)', digit: '4', description: 'Four fingers extended straight up, thumb tucked across palm', category: 'Numbers' },
  { id: 'num_5', name: '5 (Five)', digit: '5', description: 'All five fingers spread wide open', category: 'Numbers' },
  { id: 'num_6', name: '6 (Six)', digit: '6', description: 'Pinky and thumb touching tips, other three fingers extended', category: 'Numbers' },
  { id: 'num_7', name: '7 (Seven)', digit: '7', description: 'Ring finger and thumb touching tips, other fingers extended', category: 'Numbers' },
  { id: 'num_8', name: '8 (Eight)', digit: '8', description: 'Middle finger and thumb touching tips, other fingers extended', category: 'Numbers' },
  { id: 'num_9', name: '9 (Nine)', digit: '9', description: 'Index finger and thumb touching tips, other fingers extended', category: 'Numbers' },
  { id: 'num_10', name: '10 (Ten)', digit: '10', description: 'Thumbs-up fist shaking side to side gently', category: 'Numbers' }
];

export const FULL_SIGN_VOCABULARY = [
  // --- Greetings & Essentials ---
  {
    id: 'namaste',
    name: 'Namaste (नमस्ते)',
    category: 'Greetings',
    description: 'Both palms pressed flat together at chest level in Anjali Mudra prayer pose',
    phrase: 'Namaste, greetings!',
    hindiPhrase: 'नमस्ते!',
    tags: ['Two Hands', 'Prayer', 'Universal']
  },
  {
    id: 'dhanyavaad',
    name: 'Dhanyavaad (धन्यवाद / Thank You)',
    category: 'Greetings',
    description: 'Flat open hand moving smoothly from chin forward towards the other person',
    phrase: 'Dhanyavaad, thank you very much.',
    hindiPhrase: 'धन्यवाद!',
    tags: ['Courtesy', 'Flat Hand']
  },
  {
    id: 'swagatam',
    name: 'Swagatam (स्वागतम / Welcome)',
    category: 'Greetings',
    description: 'Both hands open, palms facing upward and sweeping gently inward toward chest',
    phrase: 'Aapka swagatam hai, welcome!',
    hindiPhrase: 'आपका स्वागत है!',
    tags: ['Two Hands', 'Welcome']
  },
  {
    id: 'alvida',
    name: 'Alvida (अलविदा / Goodbye)',
    category: 'Greetings',
    description: 'Open hand held at shoulder height waving side to side smoothly',
    phrase: 'Alvida, see you soon!',
    hindiPhrase: 'अलविदा!',
    tags: ['Farewell', 'Wave']
  },
  {
    id: 'kripya',
    name: 'Kripya (कृपया / Please)',
    category: 'Greetings',
    description: 'Flat open palm held forward gently at chest level in humble request',
    phrase: 'Kripya, please.',
    hindiPhrase: 'कृपया!',
    tags: ['Courtesy']
  },
  {
    id: 'maaf_kijiye',
    name: 'Maaf Kijiye (माफ़ कीजिये / Sorry)',
    category: 'Greetings',
    description: 'Fist rotated in circular motion gently over the heart/chest',
    phrase: 'Mujhe maaf kijiye, I am sorry.',
    hindiPhrase: 'माफ़ कीजिये!',
    tags: ['Courtesy', 'Fist']
  },
  {
    id: 'shubh_prabhat',
    name: 'Good Morning (शुभ प्रभात)',
    category: 'Greetings',
    description: 'Sign for Good (thumbs up) followed by sun rising gesture with open hand',
    phrase: 'Shubh prabhat, good morning!',
    hindiPhrase: 'शुभ प्रभात!',
    tags: ['Morning', 'Two Steps']
  },
  {
    id: 'shubh_ratri',
    name: 'Good Night (शुभ रात्रि)',
    category: 'Greetings',
    description: 'Sign for Good followed by one hand arching downward over the other like sunset',
    phrase: 'Shubh ratri, good night and sweet dreams.',
    hindiPhrase: 'शुभ रात्रि!',
    tags: ['Night', 'Sunset']
  },

  // --- Affirmations & Responses ---
  {
    id: 'haan',
    name: 'Haan (हाँ / Yes)',
    category: 'Responses',
    description: 'Closed fist with thumb tucked, nodding downward affirmatively',
    phrase: 'Haan, yes.',
    hindiPhrase: 'हाँ!',
    tags: ['Fist', 'Affirmative']
  },
  {
    id: 'nahi',
    name: 'Nahi (नहीं / No)',
    category: 'Responses',
    description: 'Index finger extended and waving side to side, or index and thumb snapping together',
    phrase: 'Nahi, no.',
    hindiPhrase: 'नहीं!',
    tags: ['Index Finger', 'Negative']
  },
  {
    id: 'theek_hai',
    name: 'Theek Hai (ठीक है / All Good)',
    category: 'Responses',
    description: 'Firm thumbs-up with upright thumb, other 4 fingers curled tightly into palm',
    phrase: 'Sab theek hai, all is good.',
    hindiPhrase: 'सब ठीक है!',
    tags: ['Thumbs Up']
  },
  {
    id: 'samajh_gaya',
    name: 'Samajh Gaya (समझ गया / Understood)',
    category: 'Responses',
    description: 'Index finger touching temple or forehead then gesturing outward',
    phrase: 'Main samajh gaya, I understand.',
    hindiPhrase: 'मैं समझ गया!',
    tags: ['Mind', 'Comprehension']
  },
  {
    id: 'nahi_samajha',
    name: 'Nahi Samjha (नहीं समझा / I Do Not Understand)',
    category: 'Responses',
    description: 'Index finger touching forehead followed by hand waving side to side with slight head shake',
    phrase: 'Main nahi samjha, I do not understand. Please explain.',
    hindiPhrase: 'मैं नहीं समझा!',
    tags: ['Comprehension', 'Question']
  },

  // --- Questions ---
  {
    id: 'kya',
    name: 'Kya? (क्या? / What?)',
    category: 'Questions',
    description: 'Both hands open palm-up, shaking slightly side to side with questioning expression',
    phrase: 'Kya baat hai? What is it?',
    hindiPhrase: 'क्या?',
    tags: ['Two Hands', 'Question']
  },
  {
    id: 'kahan',
    name: 'Kahan? (कहाँ? / Where?)',
    category: 'Questions',
    description: 'Index finger pointing up and oscillating side to side',
    phrase: 'Kahan jaana hai? Where is it located?',
    hindiPhrase: 'कहाँ?',
    tags: ['Location', 'Index Finger']
  },
  {
    id: 'kaise',
    name: 'Kaise? (कैसे? / How?)',
    category: 'Questions',
    description: 'Both curved hands back to back, rotating upward into palms up',
    phrase: 'Aap kaise hain? How are you?',
    hindiPhrase: 'आप कैसे हैं?',
    tags: ['Inquiry', 'Health']
  },
  {
    id: 'kyun',
    name: 'Kyun? (क्यों? / Why?)',
    category: 'Questions',
    description: 'Fingertips touching forehead and drawing away into a Y-hand shape',
    phrase: 'Kyun? Why did this happen?',
    hindiPhrase: 'क्यों?',
    tags: ['Reasoning']
  },
  {
    id: 'kaun',
    name: 'Kaun? (कौन? / Who?)',
    category: 'Questions',
    description: 'Index finger circling around chin or lips',
    phrase: 'Kaun hai? Who is that?',
    hindiPhrase: 'कौन?',
    tags: ['Person']
  },

  // --- Emergency, Health & Safety ---
  {
    id: 'madad',
    name: 'Madad (मदद / Help)',
    category: 'Emergency',
    description: 'Non-dominant flat hand palm up, dominant hand as thumbs-up fist resting upon it',
    phrase: 'Mujhe turant madad chahiye, I need urgent help.',
    hindiPhrase: 'मदद चाहिए!',
    tags: ['Emergency', 'Two Hands']
  },
  {
    id: 'doctor',
    name: 'Doctor (डॉक्टर)',
    category: 'Emergency',
    description: 'Two fingers (index & middle) tapping the inner pulse of opposite wrist',
    phrase: 'Doctor ko turant bulaiye, call a doctor immediately.',
    hindiPhrase: 'डॉक्टर को बुलाइए!',
    tags: ['Medical', 'Two Hands']
  },
  {
    id: 'hospital',
    name: 'Hospital (अस्पताल)',
    category: 'Emergency',
    description: 'Index finger drawing a medical cross (+) on the upper opposite shoulder',
    phrase: 'Hospital le chaliye, take me to the hospital.',
    hindiPhrase: 'अस्पताल ले चलिए!',
    tags: ['Medical', 'Cross']
  },
  {
    id: 'dard',
    name: 'Dard (दर्द / Pain)',
    category: 'Emergency',
    description: 'Both index fingers pointing towards each other and twisting repeatedly near pain location',
    phrase: 'Yahan bahut dard ho raha hai, there is severe pain here.',
    hindiPhrase: 'दर्द हो रहा है!',
    tags: ['Pain', 'Medical']
  },
  {
    id: 'dawa',
    name: 'Dawa (दवा / Medicine)',
    category: 'Emergency',
    description: 'Middle finger grinding lightly in the open palm of the opposite hand like crushing medicine',
    phrase: 'Mujhe dawa chahiye, I need my medicine.',
    hindiPhrase: 'दवा चाहिए!',
    tags: ['Medicine', 'Crush']
  },
  {
    id: 'khatra',
    name: 'Khatra (खतरा / Danger)',
    category: 'Emergency',
    description: 'Both open hands crossing and pushing outward forcefully with warning look',
    phrase: 'Savdhan, khatra hai! Warning, danger!',
    hindiPhrase: 'खतरा है!',
    tags: ['Safety', 'Alert']
  },

  // --- Daily Needs & Food ---
  {
    id: 'pani',
    name: 'Pani (पानी / Water)',
    category: 'Daily Needs',
    description: 'Three middle fingers extended in a W shape, index tapping chin/lips gently',
    phrase: 'Kripya thoda pani dijiye, please give me some water.',
    hindiPhrase: 'पानी चाहिए!',
    tags: ['Drink', 'W Shape']
  },
  {
    id: 'khana',
    name: 'Khana (खाना / Food)',
    category: 'Daily Needs',
    description: 'Fingertips gathered touching thumb, brought to mouth repeatedly in eating motion',
    phrase: 'Mujhe bhookh lagi hai, khana chahiye. I am hungry, I need food.',
    hindiPhrase: 'खाना चाहिए!',
    tags: ['Food', 'Eat']
  },
  {
    id: 'chai',
    name: 'Chai (चाय / Tea)',
    category: 'Daily Needs',
    description: 'Fingers pinching imaginary teabag dipping into cup made with other hand',
    phrase: 'Chai piyenge? Would you like some tea?',
    hindiPhrase: 'चाय पिएंगे?',
    tags: ['Tea', 'Beverage']
  },
  {
    id: 'doodh',
    name: 'Doodh (दूध / Milk)',
    category: 'Daily Needs',
    description: 'Fist opening and squeezing like milking a cow',
    phrase: 'Doodh chahiye, milk please.',
    hindiPhrase: 'दूध चाहिए!',
    tags: ['Milk', 'Squeeze']
  },
  {
    id: 'shauchalay',
    name: 'Washroom / Toilet (शौचालय)',
    category: 'Daily Needs',
    description: 'Hand in T-shape (thumb between index and middle) shaking gently',
    phrase: 'Washroom kahan hai? Where is the restroom?',
    hindiPhrase: 'शौचालय कहाँ है?',
    tags: ['Restroom', 'Urgent']
  },
  {
    id: 'ruko',
    name: 'Ruko (रुको / Stop)',
    category: 'Daily Needs',
    description: 'Open flat hand with palm facing directly outward firmly',
    phrase: 'Kripya yahan ruko, please stop here.',
    hindiPhrase: 'रुको!',
    tags: ['Stop', 'Halt']
  },

  // --- Family & People ---
  {
    id: 'parivar',
    name: 'Parivar (परिवार / Family)',
    category: 'Family',
    description: 'Both F-hand shapes with index and thumb touching, circling outward and meeting pinkies',
    phrase: 'Yeh mera parivar hai, this is my family.',
    hindiPhrase: 'परिवार!',
    tags: ['Family', 'Circle']
  },
  {
    id: 'mataji',
    name: 'Mataji / Mother (माँ)',
    category: 'Family',
    description: 'Open hand with thumb touching chin (or nose stud sign in ISL)',
    phrase: 'Meri mataji, my mother.',
    hindiPhrase: 'माँ!',
    tags: ['Mother', 'Chin']
  },
  {
    id: 'pitaji',
    name: 'Pitaji / Father (पिताजी)',
    category: 'Family',
    description: 'Open hand with thumb touching forehead (or mustache twist sign in ISL)',
    phrase: 'Mere pitaji, my father.',
    hindiPhrase: 'पिताजी!',
    tags: ['Father', 'Forehead']
  },
  {
    id: 'bhai',
    name: 'Bhai / Brother (भाई)',
    category: 'Family',
    description: 'Index fingers touching side by side after touching forehead',
    phrase: 'Mera bhai, my brother.',
    hindiPhrase: 'भाई!',
    tags: ['Brother']
  },
  {
    id: 'behen',
    name: 'Behen / Sister (बहन)',
    category: 'Family',
    description: 'Index fingers touching side by side after touching chin',
    phrase: 'Meri behen, my sister.',
    hindiPhrase: 'बहन!',
    tags: ['Sister']
  },
  {
    id: 'dost',
    name: 'Dost (दोस्त / Friend)',
    category: 'Family',
    description: 'Both index fingers curved and interlocking like two hooks embracing',
    phrase: 'Aap mere sachhe dost hain, you are my true friend.',
    hindiPhrase: 'सच्चा दोस्त!',
    tags: ['Friend', 'Bond']
  },
  {
    id: 'bachha',
    name: 'Bachha (बच्चा / Child, Baby)',
    category: 'Family',
    description: 'Both arms cradling and rocking an imaginary baby',
    phrase: 'Chhota bachha, small child.',
    hindiPhrase: 'बच्चा!',
    tags: ['Child', 'Baby']
  },

  // --- Emotions & Feelings ---
  {
    id: 'khush',
    name: 'Khush (खुश / Happy)',
    category: 'Emotions',
    description: 'Open flat hand brushing upward over chest in buoyant happy strokes',
    phrase: 'Main aaj bahut khush hoon, I am very happy today!',
    hindiPhrase: 'बहुत खुश हूँ!',
    tags: ['Joy', 'Chest Brush']
  },
  {
    id: 'udaas',
    name: 'Udaas (उदास / Sad)',
    category: 'Emotions',
    description: 'Open hand held before face, fingers drooping downward slowly with solemn look',
    phrase: 'Main udaas hoon, I am feeling sad.',
    hindiPhrase: 'उदास हूँ!',
    tags: ['Sadness', 'Face Droop']
  },
  {
    id: 'gussa',
    name: 'Gussa (गुस्सा / Angry)',
    category: 'Emotions',
    description: 'Clawed hand moving upward from chest toward face with intense expression',
    phrase: 'Mujhe gussa aa raha hai, I am angry.',
    hindiPhrase: 'गुस्सा!',
    tags: ['Anger', 'Claw']
  },
  {
    id: 'shanti',
    name: 'Shanti (शांति / Peace)',
    category: 'Emotions',
    description: 'Index and middle fingers extended into a crisp V shape (Peace & Harmony)',
    phrase: 'Shanti aur prem, peace and love to all.',
    hindiPhrase: 'शांति!',
    tags: ['Peace', 'V Shape']
  },
  {
    id: 'pyaar',
    name: 'Pyaar (प्यार / Love)',
    category: 'Emotions',
    description: 'Thumb, index, and pinky extended (ILY sign) or crossed arms over chest',
    phrase: 'Dil se prem aur pyaar, love from the heart.',
    hindiPhrase: 'प्यार!',
    tags: ['Love', 'ILY']
  },
  {
    id: 'thaka_hua',
    name: 'Thaka Hua (थका हुआ / Tired)',
    category: 'Emotions',
    description: 'Fingertips resting on chest, dropping down limply as shoulders relax',
    phrase: 'Main bahut thak gaya hoon, I am exhausted and tired.',
    hindiPhrase: 'थक गया हूँ!',
    tags: ['Tired', 'Fatigue']
  },

  // --- Actions & Work ---
  {
    id: 'kaam',
    name: 'Kaam (काम / Work)',
    category: 'Actions',
    description: 'Fists tapping wrist/base of hand repeatedly with purpose',
    phrase: 'Mujhe kaam karna hai, I have work to do.',
    hindiPhrase: 'काम करना है!',
    tags: ['Work', 'Fist Tap']
  },
  {
    id: 'padhai',
    name: 'Padhai / Study (पढ़ाई)',
    category: 'Actions',
    description: 'Open flat hand as a book, other hand scooping knowledge into forehead',
    phrase: 'Main padhai kar raha hoon, I am studying.',
    hindiPhrase: 'पढ़ाई!',
    tags: ['Study', 'Book']
  },
  {
    id: 'dekhna',
    name: 'Dekhna (देखना / Look, See)',
    category: 'Actions',
    description: 'V-sign pointing from eyes outward towards the target object',
    phrase: 'Wahan dekhiye, look over there.',
    hindiPhrase: 'देखिये!',
    tags: ['Vision', 'V Hand']
  },
  {
    id: 'sunna',
    name: 'Sunna (सुनना / Listen)',
    category: 'Actions',
    description: 'Cupped hand behind ear leaning forward attentively',
    phrase: 'Dhyan se suniye, please listen carefully.',
    hindiPhrase: 'सुनिए!',
    tags: ['Listen', 'Ear']
  },
  {
    id: 'bolna',
    name: 'Bolna (बोलना / Speak, Talk)',
    category: 'Actions',
    description: 'Index finger rolling forward in small circles from mouth',
    phrase: 'Kripya bataiye, please speak and tell me.',
    hindiPhrase: 'बताइए!',
    tags: ['Speak', 'Mouth']
  },
  {
    id: 'aana',
    name: 'Aana (आना / Come)',
    category: 'Actions',
    description: 'Index fingers or open hands beckoning inward toward yourself',
    phrase: 'Yahan aaiye, please come here.',
    hindiPhrase: 'यहाँ आइए!',
    tags: ['Motion', 'Beckon']
  },
  {
    id: 'jaana',
    name: 'Jaana (जाना / Go)',
    category: 'Actions',
    description: 'Index fingers pointing and rolling outward away from body',
    phrase: 'Wahan jaana hai, we need to go there.',
    hindiPhrase: 'जाना है!',
    tags: ['Motion', 'Go']
  },
  {
    id: 'sona',
    name: 'Sona (सोना / Sleep)',
    category: 'Actions',
    description: 'Palms joined resting against cheek with head tilted gently',
    phrase: 'Mujhe neend aa rahi hai, I want to sleep.',
    hindiPhrase: 'सोना है!',
    tags: ['Sleep', 'Rest']
  },

  // --- Time & Calendar ---
  {
    id: 'aaj',
    name: 'Aaj (आज / Today, Now)',
    category: 'Time',
    description: 'Both Y-hands or open hands dropping downward firmly in front of body',
    phrase: 'Aaj ka din, today.',
    hindiPhrase: 'आज!',
    tags: ['Present', 'Today']
  },
  {
    id: 'kal_aane_wala',
    name: 'Kal (कल / Tomorrow)',
    category: 'Time',
    description: 'Thumb touching cheek and flicking forward toward the future',
    phrase: 'Kal milenge, see you tomorrow.',
    hindiPhrase: 'कल मिलेंगे!',
    tags: ['Future', 'Tomorrow']
  },
  {
    id: 'kal_beeta_hua',
    name: 'Kal (बीता कल / Yesterday)',
    category: 'Time',
    description: 'Thumb touching cheek and moving backward over the shoulder into the past',
    phrase: 'Kal beeta hua, yesterday.',
    hindiPhrase: 'बीता कल!',
    tags: ['Past', 'Yesterday']
  },
  {
    id: 'samay',
    name: 'Samay (समय / Time, What time is it?)',
    category: 'Time',
    description: 'Index finger tapping the wrist repeatedly where a watch would sit',
    phrase: 'Kya samay hua hai? What time is it?',
    hindiPhrase: 'क्या समय हुआ है?',
    tags: ['Clock', 'Wrist Tap']
  },

  // --- SignBridge 76 ISL Benchmark Classes: Days, Months & Nature ---
  {
    id: 'somvar',
    name: 'Somvar / Monday (सोमवार)',
    category: 'Time',
    description: 'Letter M hand shape circling gently in front of shoulder',
    phrase: 'Somvar, Monday.',
    hindiPhrase: 'सोमवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'mangalvar',
    name: 'Mangalvar / Tuesday (मंगलवार)',
    category: 'Time',
    description: 'Letter T hand shape circling gently in front of shoulder',
    phrase: 'Mangalvar, Tuesday.',
    hindiPhrase: 'मंगलवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'budhvar',
    name: 'Budhvar / Wednesday (बुधवार)',
    category: 'Time',
    description: 'Letter W hand shape circling gently in front of shoulder',
    phrase: 'Budhvar, Wednesday.',
    hindiPhrase: 'बुधवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'guruvar',
    name: 'Guruvar / Thursday (गुरुवार)',
    category: 'Time',
    description: 'Letter H or Th hand shape circling gently',
    phrase: 'Guruvar, Thursday.',
    hindiPhrase: 'गुरुवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'shukravar',
    name: 'Shukravar / Friday (शुक्रवार)',
    category: 'Time',
    description: 'Letter F hand shape circling gently in front of shoulder',
    phrase: 'Shukravar, Friday.',
    hindiPhrase: 'शुक्रवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'shanivar',
    name: 'Shanivar / Saturday (शनिवार)',
    category: 'Time',
    description: 'Letter S fist circling gently in front of shoulder',
    phrase: 'Shanivar, Saturday.',
    hindiPhrase: 'शनिवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'ravivar',
    name: 'Ravivar / Sunday (रविवार)',
    category: 'Time',
    description: 'Both open hands tracing sun rays or circle overhead',
    phrase: 'Ravivar, Sunday holiday.',
    hindiPhrase: 'रविवार!',
    tags: ['Uni-Sign', 'Day', 'ISL']
  },
  {
    id: 'dopahar',
    name: 'Afternoon / Dopahar (दोपहर)',
    category: 'Time',
    description: 'Forearm resting horizontal while dominant hand points straight upward like midday sun',
    phrase: 'Dopahar ka samay, good afternoon.',
    hindiPhrase: 'दोपहर!',
    tags: ['Uni-Sign', 'Afternoon']
  },
  {
    id: 'shaam',
    name: 'Evening / Shaam (शाम)',
    category: 'Time',
    description: 'Curved hand dipping downward over horizon line',
    phrase: 'Shaam ka samay, good evening.',
    hindiPhrase: 'शुभ संध्या!',
    tags: ['Uni-Sign', 'Evening']
  },

  // --- SignBridge 76 ISL Benchmark Classes: Animals & Living Beings ---
  {
    id: 'janwar',
    name: 'Janwar / Animal (जानवर)',
    category: 'Animals',
    description: 'Fingertips touching chest and rocking inward and outward like breathing',
    phrase: 'Yeh ek janwar hai, this is an animal.',
    hindiPhrase: 'जानवर!',
    tags: ['Uni-Sign', 'Animal']
  },
  {
    id: 'kutta',
    name: 'Kutta / Dog (कुत्ता)',
    category: 'Animals',
    description: 'Snapping fingers and patting thigh, or panting gesture with hands',
    phrase: 'Wafadar kutta, friendly dog.',
    hindiPhrase: 'कुत्ता!',
    tags: ['Uni-Sign', 'Dog']
  },
  {
    id: 'billi',
    name: 'Billi / Cat (बिल्ली)',
    category: 'Animals',
    description: 'Thumb and index fingers stroking imaginary whiskers on cheeks',
    phrase: 'Chhoti billi, cute cat.',
    hindiPhrase: 'बिल्ली!',
    tags: ['Uni-Sign', 'Cat', 'Whiskers']
  },
  {
    id: 'chidiya',
    name: 'Chidiya / Bird (चिड़िया)',
    category: 'Animals',
    description: 'Index and thumb opening and closing at lips like a beak while hands flap like wings',
    phrase: 'Chidiya udd rahi hai, bird flying.',
    hindiPhrase: 'चिड़िया!',
    tags: ['Uni-Sign', 'Bird']
  },
  {
    id: 'machhli',
    name: 'Machhli / Fish (मछली)',
    category: 'Animals',
    description: 'Flat vertical hand swimming forward through water in gentle s-curves',
    phrase: 'Pani mein machhli, fish in water.',
    hindiPhrase: 'मछली!',
    tags: ['Uni-Sign', 'Fish']
  },
  {
    id: 'gaay',
    name: 'Gaay / Cow (गाय)',
    category: 'Animals',
    description: 'Y-hand or thumbs at temples pointing outward like cow horns',
    phrase: 'Gaay doodh deti hai, the cow gives milk.',
    hindiPhrase: 'गाय!',
    tags: ['Uni-Sign', 'Cow', 'Horns']
  },
  {
    id: 'ghoda',
    name: 'Ghoda / Horse (घोड़ा)',
    category: 'Animals',
    description: 'Two fingers at forehead flicking upward like perked horse ears',
    phrase: 'Tez daudne wala ghoda, fast horse.',
    hindiPhrase: 'घोड़ा!',
    tags: ['Uni-Sign', 'Horse']
  },
  {
    id: 'chuha',
    name: 'Chuha / Mouse (चूहा)',
    category: 'Animals',
    description: 'Index finger flicking across the tip of the nose twice',
    phrase: 'Chhota chuha, small mouse.',
    hindiPhrase: 'चूहा!',
    tags: ['Uni-Sign', 'Mouse']
  },

  // --- SignBridge 76 ISL Benchmark Classes: Descriptors & Attributes ---
  {
    id: 'sundar',
    name: 'Sundar / Beautiful (सुंदर)',
    category: 'Emotions',
    description: 'Open 5-hand circling around face, fingers gathering together at chin gracefully',
    phrase: 'Bahut sundar hai, very beautiful!',
    hindiPhrase: 'बहुत सुंदर!',
    tags: ['Uni-Sign', 'Beauty']
  },
  {
    id: 'bada',
    name: 'Bada / Big (बड़ा)',
    category: 'Actions',
    description: 'Both curved L-hands moving wide apart showing massive size',
    phrase: 'Bahut bada aakar, very big.',
    hindiPhrase: 'बड़ा!',
    tags: ['Uni-Sign', 'Size']
  },
  {
    id: 'chhota',
    name: 'Chhota / Small (छोटा)',
    category: 'Actions',
    description: 'Both open palms moving close together showing compact size',
    phrase: 'Chhota aakar, small size.',
    hindiPhrase: 'छोटा!',
    tags: ['Uni-Sign', 'Size']
  },
  {
    id: 'lamba',
    name: 'Lamba / Tall, Long (लंबा)',
    category: 'Actions',
    description: 'Dominant hand rising high above head showing impressive height',
    phrase: 'Kafi lamba hai, very tall.',
    hindiPhrase: 'लंबा!',
    tags: ['Uni-Sign', 'Height']
  },
  {
    id: 'tez',
    name: 'Tez / Fast (तेज़)',
    category: 'Actions',
    description: 'Index fingers hooked and snapping back quickly like firing arrows',
    phrase: 'Turant aur tez, very fast.',
    hindiPhrase: 'तेज़!',
    tags: ['Uni-Sign', 'Speed']
  },
  {
    id: 'dheere',
    name: 'Dheere / Slow (धीरे)',
    category: 'Actions',
    description: 'Hand stroking slowly up the back of the other arm',
    phrase: 'Dheere dheere chalo, slowly please.',
    hindiPhrase: 'धीरे!',
    tags: ['Uni-Sign', 'Speed']
  },
  {
    id: 'garam',
    name: 'Garam / Hot (गरम)',
    category: 'Daily Needs',
    description: 'Clawed hand at mouth twisting quickly outward like expelling heat',
    phrase: 'Yeh bahut garam hai, it is very hot.',
    hindiPhrase: 'गरम है!',
    tags: ['Uni-Sign', 'Temperature']
  },
  {
    id: 'thanda',
    name: 'Thanda / Cold (ठंडा)',
    category: 'Daily Needs',
    description: 'Both fists shaking near chest like shivering in cold weather',
    phrase: 'Bahut thand lag rahi hai, it is very cold.',
    hindiPhrase: 'ठंडा है!',
    tags: ['Uni-Sign', 'Cold']
  },
  {
    id: 'mehenga',
    name: 'Mehenga / Expensive (महंगा)',
    category: 'Daily Needs',
    description: 'Flat O-hand bursting open and throwing money away upward',
    phrase: 'Yeh kafi mehenga hai, this is expensive.',
    hindiPhrase: 'महंगा!',
    tags: ['Uni-Sign', 'Money']
  },
  {
    id: 'sasta',
    name: 'Sasta / Cheap (सस्ता)',
    category: 'Daily Needs',
    description: 'Dominant flat hand brushing downward off non-dominant palm',
    phrase: 'Kafi sasta aur kifayati, cheap and affordable.',
    hindiPhrase: 'सस्ता!',
    tags: ['Uni-Sign', 'Price']
  },
  {
    id: 'bimar',
    name: 'Bimar / Sick (बीमार)',
    category: 'Emergency',
    description: 'Middle finger touching forehead while other middle finger touches stomach',
    phrase: 'Tabiyat theek nahi, I feel sick.',
    hindiPhrase: 'बीमार हूँ!',
    tags: ['Uni-Sign', 'Health']
  },
  {
    id: 'swasth',
    name: 'Swasth / Healthy (स्वस्थ)',
    category: 'Emergency',
    description: 'Both hands touching shoulders and pulling forward into strong firm fists',
    phrase: 'Swasth aur tandurust, healthy and energetic.',
    hindiPhrase: 'स्वस्थ!',
    tags: ['Uni-Sign', 'Fitness']
  },
  {
    id: 'kapde',
    name: 'Kapde / Clothes, Shirt, Dress (कपड़े)',
    category: 'Daily Needs',
    description: 'Thumbs brushing downward against chest clothes twice',
    phrase: 'Naye kapde, clean clothes.',
    hindiPhrase: 'कपड़े!',
    tags: ['Uni-Sign', 'Clothing']
  },
  {
    id: 'jootey',
    name: 'Jootey / Shoes (जूते)',
    category: 'Daily Needs',
    description: 'Both closed fists bumping together side-by-side twice at waist level',
    phrase: 'Jootey pehno, wear shoes.',
    hindiPhrase: 'जूते!',
    tags: ['Uni-Sign', 'Footwear']
  }
];
