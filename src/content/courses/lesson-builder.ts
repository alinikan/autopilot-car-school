import type { Lesson, LessonPage, Question } from '../types.ts';
import type { BrandCourse, ModelGuide } from './types.ts';
import data from './catalog.ts';
export const brandCourses = data as BrandCourse[];
export const checkedOn = '2026-11-08';
const firstSentence = (text: string) =>
  text.split('. ')[0] + (text.split('. ')[0].endsWith('.') ? '' : '.');
const question = (
  prompt: string,
  correct: string,
  wrong: string[],
  why: string,
  extra: Partial<Question> = {},
): Omit<Question, 'id'> => ({
  prompt,
  options: [correct, ...new Set(wrong.filter((x) => x !== correct))].slice(0, 4),
  answer: 0,
  why,
  ...extra,
});
function makeLesson(
  course: BrandCourse,
  id: string,
  title: string,
  subtitle: string,
  pages: LessonPage[],
  questions: Omit<Question, 'id'>[],
  extra: Partial<Lesson> = {},
): Lesson {
  const words = pages.reduce(
    (n, p) =>
      n +
      [
        p.title,
        p.text,
        p.example,
        ...(p.paragraphs || []),
        ...(p.bullets || []),
        ...(p.table?.rows.flat() || []),
      ]
        .join(' ')
        .split(/\s+/).length,
    0,
  );
  return {
    id: `brand-${course.id}-${id}`,
    trackId: course.id,
    title,
    subtitle,
    unit: 1,
    kind: 'Manufacturer course',
    minutes: Math.max(8, Math.ceil(words / 100 + questions.length * 1.2 + 3)),
    pages,
    source: course.source,
    sources: [{ label: `${course.name} official model range`, url: course.source }],
    questions: questions.map((q, i) => {
      const offset = (i + id.length) % q.options.length;
      return {
        ...q,
        id: `brand-${course.id}-${id}-q${i}`,
        options: [...q.options.slice(offset), ...q.options.slice(0, offset)],
        answer: (q.answer - offset + q.options.length) % q.options.length,
      };
    }),
    ...extra,
  };
}
function orientation(c: BrandCourse): Lesson {
  const rows = c.models.map((m) => [m.name, m.body, m.role]);
  return makeLesson(
    c,
    'map',
    `Meet ${c.name}`,
    `The badge, the name and the model families — explained from zero.`,
    [
      {
        title: `First, put ${c.name} on your map`,
        text: c.intro,
        paragraphs: [
          `Start by separating the maker from the model. ${c.name} is the brand. ${c.models[0].name} is one model family within it. A family can contain different versions, just as one phone model can come with different storage sizes.`,
          `The country shown here is the brand’s origin. It does not tell you where every car was built. The assembly location can change by model and year; the vehicle’s own label is the place to check.`,
        ],
        example: `If a friend says “I drive a ${c.name},” you know the brand but not yet the shape, size, engine or equipment. Your next question can simply be: “Which model?”`,
      },
      {
        title: 'Build a mental shelf for the models',
        text: 'Learn the jobs before trying to memorize every badge. A small everyday car, a family SUV and a sports car solve different problems. Put each name on a shelf, then attach its details later.',
        table: { headers: ['Family', 'Shape', 'Its place in the range'], rows },
        example: `Say these three names aloud: ${c.models
          .slice(0, 3)
          .map((m) => m.name)
          .join(', ')}. Then cover the first column and try to recover each name from its job.`,
      },
      {
        title: 'Read the name in layers',
        text: c.naming,
        paragraphs: [
          'Model family = the main product. Body style = its shape. Powertrain = the engine, electric motor and related parts that move it. Trim = a bundle of equipment. Package = a group of optional extras. A new model year can change any of these.',
          'When somebody says a version is “higher,” ask what changed. It could mean more power, more screens, a nicer seat material, or just different styling. None of those automatically means more useful space.',
        ],
        example: c.warning,
      },
      {
        title: 'How to learn this course',
        text: 'Begin with the map, take the individual family lessons, then compare them. You do not have to remember every fact on your first visit. Read a page, explain it in your own words, and use the activity before trying the quiz.',
        bullets: [
          'Name it: brand → family → body → version → model year.',
          'Explain it: what is this car meant to do?',
          'Compare it: what do I gain, and what do I give up?',
          'Retrieve it: close the explanation and answer from memory.',
        ],
        example:
          'In a conversation you can say: “I know the family, but which year and engine version are you talking about?” That is a useful, informed question.',
      },
    ],
    [
      question(
        `Which is a model family made by ${c.name}?`,
        c.models[0].name,
        ['A model year', 'A fuel price', 'A registration number'],
        `${c.models[0].name} is a family within the ${c.name} brand.`,
        { badge: c.name },
      ),
      question(
        'Does a brand’s home country tell you where every example was assembled?',
        'No — check the particular vehicle',
        ['Yes, without exceptions', 'Only if it has an SUV body', 'Only if its badge is silver'],
        'Brand origin and vehicle assembly location are different facts.',
      ),
      question(
        `Your friend says “a higher-spec ${c.name}.” What should you ask?`,
        'Which model, year, engine and equipment?',
        [
          'How shiny is its badge?',
          'Does higher always mean larger?',
          'Is every version mechanically identical?',
        ],
        'The full specification tells you what changed and whether it matters to you.',
      ),
      question(
        `Which family’s role is “${c.models[1].role}”?`,
        c.models[1].name,
        [c.models[0].name, ...c.models.slice(2, 4).map((m) => m.name)].slice(0, 3),
        c.models[1].explanation,
      ),
    ],
    {
      outcomes: [
        'Recognize the brand',
        'Group its model families',
        'Separate model, trim and powertrain',
      ],
      recap: [
        `${c.name} originated in ${c.country}.`,
        c.naming,
        'Ask for the model year before comparing specifications.',
      ],
    },
  );
}
function modelLesson(c: BrandCourse, m: ModelGuide): Lesson {
  const others = c.models.filter((x) => x.id !== m.id).slice(0, 3);
  const electric = c.id === 'tesla' || (/electric/i.test(m.body) && !/(hybrid|gas)/i.test(m.body));
  const pages: LessonPage[] = [
    {
      title: `${m.name}, in one clear idea`,
      text: m.explanation,
      paragraphs: [
        `Put it in this category: ${m.body}. Its role in this course is “${m.role}.” Learn that role first. The name alone is not a complete specification; a used example and a current one can share a family name while having different interiors, engines and dimensions.`,
      ],
      example: m.scenario,
      image: m.image,
      photos: m.photos,
      imageNote: m.imageNote,
    },
    {
      title: 'What it offers — and what to question',
      text: m.tradeoff,
      paragraphs: m.practicalDetails || [
        'A useful comparison starts with your actual trip. How many people travel regularly? What needs to fit through the boot or hatch opening? Is the parking space tight? Do you have a convenient charging spot? Make those requirements concrete before looking at a more expensive version.',
        'Try the tasks the car must perform. Sit behind your normal driving position, load the bulky item you actually carry, and check the car against your parking space. A category such as “SUV” cannot answer those questions on its own.',
      ],
      example: `Practice sentence: “I would consider the ${m.name} for ${m.role.toLowerCase()}, but first I would check whether its compromises suit my use.”`,
    },
    {
      title: 'Understand the mechanical choices',
      text: m.power,
      paragraphs: electric
        ? [
            'Battery capacity is an energy amount, measured in kWh. Charging power is a rate, measured in kW. They answer different questions: how much energy can be stored, and how quickly energy is being delivered? Neither number alone guarantees a trip’s range or a complete charging time.',
            'An electric motor is not a petrol cylinder. Rear-wheel drive and all-wheel drive describe which wheels can be driven. Compare the exact motor/drive, battery and Canadian model-year specification, rather than assuming every electric version is identical.',
          ]
        : [
            'An engine’s cylinder count describes its layout, not its quality. A turbo pushes more air into an engine so it can make more power. A hybrid adds electric assistance; a plug-in hybrid has a battery you can recharge from an external source. An electric car has no petrol engine.',
            'Look up the exact year and version rather than borrowing a specification from a review of another car. Fuel requirement, driven wheels, power and efficiency can all change within one family. Compare Canadian L/100 km ratings on the same test basis; lower means less fuel used for the same distance.',
          ],
      example: electric
        ? 'Illustrative arithmetic: a 200-km trip at 18 kWh/100 km uses 36 kWh before considering any separate charging losses. These are practice inputs, not a rating or guarantee for this model.'
        : 'If two listings show “2.0” and “3.0,” those may be engine sizes in litres. They are not automatically the number of cylinders or a score out of ten. Read the engine specification to find both.',
    },
    {
      title: 'Compare it with its neighbours',
      text: m.compare,
      paragraphs: [
        '“Better” needs an ending: better for carrying passengers, better for easy loading, better for tight parking, or better for a particular driving experience. A car can win one of those comparisons and lose another.',
        'To make the decision fair, compare similar model years and equipment. A highly equipped smaller model can cost more than a basic larger one. A used luxury car’s purchase price also does not turn its replacement parts or insurance into those of a new small economy car.',
      ],
      example: `Explain the ${m.name} to a friend without using the words “better” or “worse.” Say what it does and name one compromise. Then use ${m.memory.toLowerCase()} as your memory hook.`,
    },
    {
      title: 'Read a price without getting tricked',
      text: m.price
        ? `Here is a sourced Canadian price example for a specific version. It is a dated starting MSRP, not a dealer quote, not the price of every ${m.name}, and not an amount you can divide by a loan term to get a real payment.`
        : `A reliable numeric Canadian starting price is not included for this family in this edition. Use the linked official Canadian range/configurator and select a year and exact version. This is more useful than attaching an unverified number to the family name.`,
      prices: m.price ? [m.price] : undefined,
      paragraphs: [
        'MSRP means manufacturer’s suggested retail price. Start with that, then identify included or extra equipment, freight and preparation, other charges, taxes, and any financing cost. Compare itemized totals using the same assumptions.',
        'For ownership, also make room for energy, insurance, servicing, tires, parking and depreciation. Depreciation is the value the car loses while you own it. You cannot predict those costs just from the badge.',
      ],
      example:
        'A $500 monthly payment for 84 months adds up to $42,000 in payments. Add any down payment and other amounts outside those payments. That arithmetic does not by itself tell you the interest rate or whether the deal is good.',
    },
    {
      title: 'Make it stick',
      text: `Memory hook: ${m.memory} ${m.compare}`,
      bullets: [
        `Say the brand and family: ${c.name} → ${m.name}.`,
        `Name the shape: ${m.body}.`,
        `Explain its job: ${m.role}.`,
        'Give one reason it might suit someone and one reason it might not.',
        'Ask for the model year, exact version and itemized price.',
      ],
      example: m.scenario,
    },
  ];
  // The detailed tracks retain six teaching pages; shorter courses have a deliberate four-page path.
  const selected = c.deep ? pages : [pages[0], pages[1], pages[3], pages[4]];
  const qs = [
    question(
      `Where does the ${m.name} fit?`,
      m.role,
      others.map((x) => x.role),
      m.explanation,
    ),
    question(
      m.image
        ? 'Which model family from this course is shown?'
        : `Which model family matches this clue: “${m.memory}”?`,
      m.name,
      others.map((x) => x.name),
      m.explanation,
      m.image ? { image: m.image, imageNote: m.imageNote } : {},
    ),
    question(
      `Which is the best way to compare two ${m.name} listings?`,
      'Match the year, engine, equipment and total price',
      [
        'Choose whichever has the bigger badge',
        'Assume all trims have the same equipment',
        'Compare only the monthly payment',
      ],
      'Two cars with the same family name can have different powertrains, equipment and costs.',
    ),
    question(
      `Which quoted comparison reminder belongs to the ${m.name} summary?`,
      firstSentence(m.compare),
      others.map((x) => firstSentence(x.compare)),
      m.explanation,
    ),
    question(
      `A friend asks about a ${m.name}. Which description fits?`,
      firstSentence(m.explanation),
      others.map((x) => firstSentence(x.explanation)),
      `${m.memory}. ${m.explanation}`,
    ),
    ...(c.deep
      ? [
          m.knowledgeCheck
            ? question(
                m.knowledgeCheck.prompt,
                m.knowledgeCheck.correct,
                m.knowledgeCheck.wrong,
                m.knowledgeCheck.why,
              )
            : electric && !['mazda', 'bmw', 'mercedes-benz'].includes(c.id)
              ? question(
                  'Which detail describes an energy amount rather than a charging rate?',
                  'Battery capacity in kWh',
                  ['Peak charging power in kW', 'The model-family number', 'The wheel diameter'],
                  'kWh measures an amount of energy; kW measures a rate. The units are different.',
                )
              : question(
                  'A listing gives engine size but not cylinder count. What should you do?',
                  'Read the exact engine specification',
                  [
                    'Use the model number as the cylinder count',
                    'Assume litres equal cylinders',
                    'Count the exhaust tips',
                  ],
                  'Engine displacement, cylinder count and model badge are separate pieces of information.',
                ),
        ]
      : []),
  ];
  return makeLesson(
    c,
    m.id,
    `${m.name}: ${m.role}`,
    `${m.body}. What it is, who it suits, and what to compare.`,
    selected,
    qs,
    {
      source: m.source,
      sources: [
        { label: `${m.name} — official reference`, url: m.source },
        ...(m.price ? [{ label: 'Canadian price source', url: m.price.source }] : []),
      ],
      recap: [m.explanation, m.memory, m.compare],
      outcomes: [
        `Place the ${m.name} in the range`,
        'Explain a real trade-off',
        'Compare versions and prices fairly',
      ],
    },
  );
}
function compareLesson(c: BrandCourse): Lesson {
  const a = c.models[0],
    b = c.models[1],
    d = c.models.find((m) => m.id === c.comparisonAnchor) || c.models[c.models.length - 1];
  return makeLesson(
    c,
    'decisions',
    `Compare ${c.name} models`,
    `Work through real needs, then match the family to its job.`,
    [
      {
        title: 'A fair comparison starts with a job',
        text: `You now know the names. Connect them to decisions. ${a.name}: ${a.role}. ${b.name}: ${b.role}. ${d.name}: ${d.role}. A badge or a higher model number cannot decide which is appropriate.`,
        paragraphs: [
          'Write down three must-haves and two things you can compromise on. A must-have is something the car has to do, such as fitting a particular passenger arrangement. A preference is something you like, such as a certain screen or wheel design. Do not let a preference hide a failed must-have.',
        ],
        example: `Your friend says “Why not just get the most expensive ${c.name}?” Reply: “What problem would spending more solve for me?”`,
      },
      {
        title: 'Compare the actual differences',
        text: 'Read across each row. These are family roles, not rankings or promises that every version has the same specification.',
        table: {
          headers: ['Family', 'Role', 'Remember'],
          rows: c.models.map((m) => [m.name, m.role, m.memory]),
        },
        example: `Cover the family column. Can you recover ${a.name}, ${b.name} and ${d.name} from the other two columns?`,
      },
      {
        title: 'Talk through the trade-offs',
        text: `${a.compare} ${b.compare}`,
        paragraphs: [
          `${d.name}: ${d.tradeoff}`,
          'Our worked scenarios are teaching examples based on the role of each family. They are not measured scores for reliability, safety, ownership cost or driving quality. Those need evidence about the particular year and version.',
        ],
        example: `Finish this sentence twice: “Compared with ___, I would choose ___ if I cared more about ___, but I would accept ___.”`,
      },
      {
        title: 'Turn recognition into recall',
        text: 'Use the matching activity next. Read the job, choose its model family, and explain your choice aloud. The quiz then asks you to retrieve what you learned without looking at the table.',
        bullets: [
          'Start with the broad category, then the family.',
          'Use more than one visual detail; paint colour is not identity.',
          'Model years and generations can look different.',
          'If you are uncertain, say what you recognize and what you still need to check.',
        ],
        example: `“It looks like a ${c.name}, and I think it belongs to the ${b.name} family. I would check the rear badge and model year before identifying the exact version.”`,
      },
    ],
    [
      question(
        `Which family’s role is “${a.role}”?`,
        a.name,
        c.models.slice(1, 4).map((m) => m.name),
        a.explanation,
      ),
      question(
        `Which family’s role is “${d.role}”?`,
        d.name,
        c.models.slice(0, 3).map((m) => m.name),
        d.explanation,
      ),
      question(
        'Your comparison has a cheap base model and a heavily optioned higher trim. What is missing?',
        'A comparison of similar equipment and itemized totals',
        [
          'A winner chosen only by the model number',
          'A rule that all prices include the same things',
          'A rule that larger cars always cost less',
        ],
        'Body size, performance and equipment are separate. Check the actual configuration.',
      ),
      question(
        `A friend asks which ${c.name} is best. What comes first?`,
        'Their needs, budget and exact versions',
        [
          'The largest number in the range',
          'The flashiest wheels',
          'The most expensive monthly payment',
        ],
        'A useful answer explains the needs a car meets and the compromises it involves.',
      ),
    ],
    {
      activity: 'match',
      match: c.models
        .slice(0, 6)
        .map((m) => ({ name: m.name, description: m.role, image: m.image })),
      outcomes: [
        'Explain differences without ranking by prestige',
        'Choose relevant comparison criteria',
        'Retrieve names from roles',
      ],
      recap: c.models.map((m) => `${m.name}: ${m.role}`),
    },
  );
}
function moneyLesson(c: BrandCourse): Lesson {
  const prices = c.models.flatMap((m) => (m.price ? [m.price] : []));
  return makeLesson(
    c,
    'costs',
    `${c.name}: prices, trims & ownership`,
    `Understand the asking price, then practise the arithmetic.`,
    [
      {
        title: 'Separate three very different numbers',
        text: 'A starting MSRP is a reference for a specified base version. An itemized cash purchase total includes the selected car and the applicable charges listed in that quote. A financed total also depends on the amount borrowed, the rate and the term. Comparing one of these against another is misleading.',
        example:
          'Illustrative arithmetic: $40,000 for a car plus $2,000 of listed extras is $42,000 before any other applicable charges. Ask what each number includes; do not assume that “starting from” is the amount you will pay.',
      },
      {
        title: 'Read the Canadian price examples',
        text: prices.length
          ? `These are dated CAD snapshots from manufacturer or named Canadian retailer sources, checked ${checkedOn}. Different model years can appear in the same table because new models arrive at different times. They are learning references, not live offers.`
          : `This course links to ${c.name}’s official range rather than presenting an unverified Canadian price table. Choose your province, model year, powertrain and trim in the configurator, and bring the itemized result back to the comparison checklist.`,
        prices: prices.length ? prices : undefined,
        paragraphs: [
          c.warning,
          'An expired retailer offer is not an available offer. A screenshot of a price must retain the source, currency, model year and exclusions to remain meaningful.',
        ],
        example:
          'A base vehicle and a premium engine version can have the same family name and very different prices. A family-level price is the beginning of a conversation, not a complete specification.',
      },
      {
        title: 'A trim decision in plain language',
        text: 'Imagine two versions of the same model. One adds heated seats and better headlights. Another adds more power and larger wheels. Write down which changes you will actually use, and check replacement tire prices before choosing a wheel size. Equipment can be standard on one model year and optional on another.',
        paragraphs: [
          'A styling package can change appearance without making the car equivalent to a dedicated performance version. An engine badge can change performance without increasing passenger room. Read the equipment list and mechanical specification separately.',
          'For energy costs, use a common annual distance. Illustrative example: 15,000 km at 7 L/100 km uses 1,050 litres; at 9 L/100 km it uses 1,350 litres. The difference is 300 litres. Multiply by your fuel price to estimate the difference in fuel cost, before other costs.',
        ],
        example:
          'At an illustrative $1.80/L, that 300-litre difference is $540 a year. $1.80 is a practice input, not a claim about today’s BC pump price.',
      },
      {
        title: 'Use a complete ownership checklist',
        text: 'Ownership cost combines several moving pieces. The monthly payment is only one of them. Ask for an insurance quote for the exact version, look up the scheduled maintenance, price the tires, and consider your parking and charging arrangements.',
        bullets: [
          'Purchase: exact car, options, charges and taxes.',
          'Finance: amount borrowed, term, rate and total payments.',
          'Running: fuel or electricity, insurance, service and tires.',
          'Future value: likely resale value is uncertain, not guaranteed.',
          'Used cars: condition, maintenance history and inspection matter.',
        ],
        example:
          'A used car can have a lower asking price than a new one but still need expensive work soon. Compare the condition and expected costs, not just the age of the badge.',
      },
    ],
    [
      question(
        'What does MSRP stand for?',
        'Manufacturer’s suggested retail price',
        [
          'Monthly scheduled repayment',
          'Maintenance service reserve payment',
          'Minimum safe resale price',
        ],
        'MSRP is a suggested vehicle price; you must check what the quote includes.',
      ),
      question(
        'In the example, 15,000 km at 9 rather than 7 L/100 km uses how much extra fuel?',
        '300 litres',
        ['30 litres', '3,000 litres', 'Exactly $300'],
        '15,000 ÷ 100 × (9 − 7) = 300 litres. Convert litres into dollars using a fuel price.',
      ),
      question(
        'What is $500 × 84 monthly payments?',
        '$42,000, before amounts outside those payments',
        [
          '$6,000 for the entire loan',
          '$40,000 including every possible charge',
          'Proof that it is a good deal',
        ],
        '500 × 84 = 42,000. Include any down payment and other costs separately.',
      ),
      question(
        'Why does a useful price need a model year and a source?',
        'Versions, prices and included charges change',
        [
          'Because every car has the same trim',
          'Because MSRP includes all future maintenance',
          'Because old offers never expire',
        ],
        'Currency, year, exact version, date and exclusions give the number context.',
      ),
    ],
    {
      activity: 'budget',
      outcomes: [
        'Read a dated Canadian price',
        'Separate trim from mechanical differences',
        'Calculate a simple comparison',
      ],
      recap: [
        'Compare itemized totals with matching assumptions.',
        'MSRP, monthly payment and ownership cost are different.',
        'Exact year and version matter more than a family-level headline.',
      ],
    },
  );
}
function workshops(c: BrandCourse): Lesson[] {
  return (c.workshops || []).map((w) =>
    makeLesson(c, `lab-${w.id}`, w.title, w.subtitle, w.pages, w.questions, {
      kind: 'Workshop',
      source: w.source,
      sources: [{ label: `${c.name} workshop source`, url: w.source }],
      outcomes: [
        'Explain the naming distinction',
        'Apply it to a realistic situation',
        'Recall the reason for a choice',
      ],
      recap: w.pages.map((p) => firstSentence(p.text)),
    }),
  );
}
export const manufacturerLessons: Lesson[] = brandCourses.flatMap((c) => [
  orientation(c),
  ...c.models.map((m) => modelLesson(c, m)),
  ...workshops(c),
  compareLesson(c),
  moneyLesson(c),
]);
export const courseLessons = (id: string) => manufacturerLessons.filter((l) => l.trackId === id);
export const detailedCourses = brandCourses.filter((c) => c.deep);
export const featuredCourses = ['tesla', 'toyota', 'honda', 'hyundai', 'subaru', 'ford']
  .map((id) => brandCourses.find((c) => c.id === id)!)
  .filter(Boolean);
