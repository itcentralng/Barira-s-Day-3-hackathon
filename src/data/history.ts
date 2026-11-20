/**
 * Exhibition content. Every date and milestone wording below is from the
 * approved record supplied for the exhibition — do not edit or extend it
 * without a verified source.
 */

export type Section = {
  id: string;
  path: "/story" | "/timeline" | "/eras" | "/archive" | "/records" | "/videos" | "/legacy";
  n: string;
  title: string;
  short: string;
};

export const SECTIONS: Section[] = [
  { id: "story", path: "/story", n: "02", title: "Story of the Department", short: "Story" },
  { id: "timeline", path: "/timeline", n: "03", title: "Historical Timeline", short: "Timeline" },
  { id: "eras", path: "/eras", n: "04", title: "Era Explorer", short: "Eras" },
  { id: "archive", path: "/archive", n: "05", title: "Photographic Archive", short: "Photographs" },
  { id: "records", path: "/records", n: "06", title: "Memorabilia & Records", short: "Records" },
  { id: "videos", path: "/videos", n: "07", title: "Video Archive", short: "Film" },
  { id: "legacy", path: "/legacy", n: "08", title: "Facts & Legacy", short: "Legacy" },
];

export type Milestone = {
  date: string;
  /** Short year label shown on the timeline track. */
  year: string;
  text: string;
  photoId: string;
  era: number;
};

/** The ten approved milestones, in their approved order and wording. */
export const MILESTONES: Milestone[] = [
  { date: "16 March 1978", year: "1978", text: "Air Faculty established, running Senior Course only.", photoId: "acsc-1", era: 0 },
  { date: "26 February 1979", year: "1979", text: "Junior Division Staff Course established at NAF Base Kaduna.", photoId: "1979-02-junior-course-air-faculty-context", era: 0 },
  { date: "August 1986", year: "1986", text: "Air Faculty relocates from Kaduna to Command and Staff College, Jaji.", photoId: "college-hq", era: 1 },
  { date: "3 July 1986 – 4 July 1987", year: "1986–87", text: "Purpose-built DAW building founded and commissioned.", photoId: "jaji-college-campus", era: 1 },
  { date: "9 June 2000", year: "2000", text: "Air Marshal Isaac Alfa Hall commissioned.", photoId: "1988-10-joint-studies-context", era: 2 },
  { date: "2 December 2002", year: "2002", text: "Air Faculty redesignated Department of Air Warfare.", photoId: "2002-department-date-review-context", era: 2 },
  { date: "27 May 2019", year: "2019", text: "SB Abubakar Centre commissioned.", photoId: "today-officer-research-context", era: 3 },
  { date: "12 February 2024", year: "Feb 2024", text: "Air Operations Seminar replaces annual Air Space Management Seminar.", photoId: "department-of-air-warfare-hero-seminar-2024", era: 3 },
  { date: "February 2024", year: "Feb 2024", text: "First bi-service Air-Land Exercise IMONGO DOO.", photoId: "2026-05-13-senior-course-48-in-the-field", era: 3 },
  { date: "December 2024", year: "Dec 2024", text: "Outdated DAW Handbook reviewed.", photoId: "2026-college-joint-education-context", era: 3 },
];

export type Era = {
  numeral: string;
  title: string;
  range: string;
  summary: string;
  milestoneIdx: number[];
  coverId: string;
  photoIds: string[];
};

/** Periods grouped strictly from the approved milestones. */
export const ERAS: Era[] = [
  {
    numeral: "I",
    title: "Foundations",
    range: "1978 – 1979",
    summary:
      "The Air Faculty is established on 16 March 1978, running the Senior Course only. On 26 February 1979 the Junior Division Staff Course is established at NAF Base Kaduna.",
    milestoneIdx: [0, 1],
    coverId: "acsc-1",
    photoIds: ["acsc-1", "csc-1", "inaugural-speech", "1979-02-junior-course-air-faculty-context", "1979-air-faculty-context"],
  },
  {
    numeral: "II",
    title: "Home at Jaji",
    range: "1986 – 1987",
    summary:
      "In August 1986 the Air Faculty relocates from Kaduna to the Command and Staff College, Jaji. Between 3 July 1986 and 4 July 1987 its purpose-built building is founded and commissioned.",
    milestoneIdx: [2, 3],
    coverId: "college-hq",
    photoIds: ["college-hq", "jaji-college-campus", "dh-1", "dh-2", "dh-3"],
  },
  {
    numeral: "III",
    title: "Faculty to Department",
    range: "2000 – 2002",
    summary:
      "The Air Marshal Isaac Alfa Hall is commissioned on 9 June 2000. On 2 December 2002 the Air Faculty is redesignated the Department of Air Warfare.",
    milestoneIdx: [4, 5],
    coverId: "2002-department-date-review-context",
    photoIds: ["2002-department-date-review-context", "1988-10-joint-studies-context", "1999-air-warfare-leadership-context", "2002-afcsc-redesignation-date-review-context"],
  },
  {
    numeral: "IV",
    title: "Air Warfare Studies Today",
    range: "2019 – 2024",
    summary:
      "The SB Abubakar Centre is commissioned on 27 May 2019. In 2024 the Air Operations Seminar replaces the annual Air Space Management Seminar, the first bi-service Air-Land Exercise IMONGO DOO is held, and the outdated DAW Handbook is reviewed.",
    milestoneIdx: [6, 7, 8, 9],
    coverId: "department-of-air-warfare-hero-seminar-2024",
    photoIds: [
      "department-of-air-warfare-hero-seminar-2024",
      "today-officer-research-context",
      "2026-05-13-senior-course-48-in-the-field",
      "2026-05-13-senior-course-48-group-photo",
      "2026-college-joint-education-context",
    ],
  },
];

export type StoryChapter = {
  kicker: string;
  range: string;
  title: string;
  paragraphs: string[];
  mainId: string;
  secondId: string;
  dates: { date: string; text: string }[];
};

export const STORY: StoryChapter[] = [
  {
    kicker: "The College",
    range: "1977 – 1978",
    title: "In the Beginning",
    paragraphs: [
      "The Department's story begins inside a college. The archive's earliest prints record its first steps: the inaugural address by General Olusegun Obasanjo, then Head of State and Commander-in-Chief, and the inauguration of CSC Course 1.",
      "Another print records the Army Command and Staff College of 1977/78 — ACSC 1, its first course.",
    ],
    mainId: "inaugural-speech",
    secondId: "acsc-1",
    dates: [{ date: "1977/78", text: "ACSC 1, as printed on the archival photograph" }],
  },
  {
    kicker: "An Air Faculty",
    range: "1978 – 1979",
    title: "Air Power Enters the Classroom",
    paragraphs: [
      "On 16 March 1978 an Air Faculty was established, running the Senior Course only.",
      "Less than a year later, on 26 February 1979, the Junior Division Staff Course was established at NAF Base Kaduna. The air arm it served had itself been born in April 1964 — a story told in the archive film in the Video Archive.",
    ],
    mainId: "1979-air-faculty-context",
    secondId: "1977-first-naf-students-context",
    dates: [
      { date: "16 March 1978", text: "Air Faculty established" },
      { date: "26 February 1979", text: "Junior Division Staff Course at NAF Base Kaduna" },
    ],
  },
  {
    kicker: "A Permanent Home",
    range: "1986 – 1987",
    title: "Coming to Jaji",
    paragraphs: [
      "In August 1986 the Air Faculty relocated from Kaduna to the Command and Staff College, Jaji.",
      "A purpose-built DAW building was founded and commissioned between 3 July 1986 and 4 July 1987, giving air warfare studies a dedicated home on the campus.",
    ],
    mainId: "college-hq",
    secondId: "jaji-college-campus",
    dates: [
      { date: "August 1986", text: "Relocation from Kaduna to Jaji" },
      { date: "3 July 1986 – 4 July 1987", text: "DAW building founded and commissioned" },
    ],
  },
  {
    kicker: "A New Name",
    range: "2000 – 2002",
    title: "The Department of Air Warfare",
    paragraphs: [
      "On 9 June 2000 the Air Marshal Isaac Alfa Hall was commissioned.",
      "On 2 December 2002 the Air Faculty was redesignated the Department of Air Warfare — the name it carries today.",
    ],
    mainId: "2002-department-date-review-context",
    secondId: "1999-air-warfare-leadership-context",
    dates: [
      { date: "9 June 2000", text: "Air Marshal Isaac Alfa Hall commissioned" },
      { date: "2 December 2002", text: "Redesignated Department of Air Warfare" },
    ],
  },
  {
    kicker: "Leadership and Knowledge",
    range: "2019 – 2024",
    title: "Air Warfare Studies Today",
    paragraphs: [
      "The SB Abubakar Centre was commissioned on 27 May 2019. In February 2024 the Air Operations Seminar replaced the annual Air Space Management Seminar, and the first bi-service Air-Land Exercise, IMONGO DOO, was held.",
      "In December 2024 the outdated DAW Handbook was reviewed — part of the Department's place within a tri-service college whose crest carries the motto “Leadership and Knowledge”.",
    ],
    mainId: "department-of-air-warfare-hero-seminar-2024",
    secondId: "2026-05-13-senior-course-48-in-the-field",
    dates: [
      { date: "27 May 2019", text: "SB Abubakar Centre commissioned" },
      { date: "February 2024", text: "Air Operations Seminar · Exercise IMONGO DOO" },
      { date: "December 2024", text: "DAW Handbook reviewed" },
    ],
  },
];

export type FilmChapter = { start: number; title: string; caption: string; thumb: number };

/** Chapters of the supplied archive film (birth.mp4, 2 min 05 s), mapped from its on-screen content. */
export const FILM_CHAPTERS: FilmChapter[] = [
  { start: 0, title: "A Formidable Force", caption: "Opening titles of the Nigerian Air Force film", thumb: 1 },
  { start: 12, title: "April 1964", caption: "The founding moment, as dated on screen", thumb: 2 },
  { start: 24, title: "The Founding Objectives", caption: "The purposes of the new air force, set out on screen", thumb: 3 },
  { start: 56, title: "Taking to the Skies", caption: "Transport aircraft and formation flying", thumb: 4 },
  { start: 68, title: "The Pioneers", caption: "Archival photographs of early ceremonies", thumb: 5 },
  { start: 84, title: "Two Colonels", caption: "Colonel Gerhard Kahtz and Colonel Wolfgang Timming, as named on screen", thumb: 6 },
  { start: 96, title: "The First Aircraft", caption: "Early aircraft on the flight line", thumb: 7 },
  { start: 116, title: "Training Begins", caption: "Instruction scenes from the early years", thumb: 8 },
];

export const FILM_OBJECTIVES = [
  "To achieve a full complement of the military defence system of the Federal Republic of Nigeria both in the air and on the ground.",
  "To ensure a fast versatile mobility of the Armed Forces.",
  "To provide close air support for the ground-based and sea borne forces in all phases of operations and to ensure the territorial integrity of a united Nigeria.",
  "To give the country the deserved prestige that is invaluable in international matters.",
];

export type BaseMarker = { photoId: string; name: string; lon: number; lat: number; labelSide: "left" | "right" };

export const BASES: BaseMarker[] = [
  { photoId: "jaji-college-campus", name: "Jaji", lon: 7.58, lat: 10.82, labelSide: "right" },
  { photoId: "sokoto-government-house-security-visit-2024", name: "Sokoto", lon: 5.24, lat: 13.06, labelSide: "right" },
  { photoId: "katsina-air-operations-project-visit-2020", name: "Katsina", lon: 7.6, lat: 12.99, labelSide: "right" },
  { photoId: "maiduguri-hangar-opening-2020", name: "Maiduguri", lon: 13.15, lat: 11.85, labelSide: "left" },
  { photoId: "bauchi-regiment-training-2020", name: "Bauchi", lon: 9.84, lat: 10.31, labelSide: "right" },
  { photoId: "jos-military-schools-ceremony-2020", name: "Jos", lon: 8.89, lat: 9.9, labelSide: "right" },
  { photoId: "yola-base-visit-2024", name: "Yola", lon: 12.46, lat: 9.21, labelSide: "left" },
  { photoId: "minna-airport-runway-2024", name: "Minna", lon: 6.55, lat: 9.61, labelSide: "left" },
  { photoId: "ilorin-civilian-airport-location-context-2022", name: "Ilorin", lon: 4.55, lat: 8.5, labelSide: "right" },
  { photoId: "enugu-airport-location-context-2021", name: "Enugu", lon: 7.49, lat: 6.44, labelSide: "right" },
  { photoId: "benin-city-107-air-maritime-group-visit-2020", name: "Benin City", lon: 5.62, lat: 6.34, labelSide: "left" },
];

export type RecordItem = {
  id: string;
  kind: "photo" | "chronology";
  photoId?: string;
  title: string;
  type: string;
  transcription?: string;
  description: string;
};

export const RECORDS: RecordItem[] = [
  {
    id: "inaugural",
    kind: "photo",
    photoId: "inaugural-speech",
    title: "“In the Beginning”",
    type: "Archival print with printed caption",
    transcription: "“In the beginning” — Inaugural address by Gen Olusegun Obasanjo, the Head of State and C-in-C",
    description: "A monochrome print of the inaugural address, captioned on the mount.",
  },
  {
    id: "acsc1",
    kind: "photo",
    photoId: "acsc-1",
    title: "ACSC 1 — Course Photograph",
    type: "Archival course photograph",
    transcription: "Army Command and Staff College 1977/78 — ACSC 1",
    description: "A panoramic group photograph of the course in rows, captioned beneath.",
  },
  {
    id: "csc1",
    kind: "photo",
    photoId: "csc-1",
    title: "Inauguration of CSC Course 1",
    type: "Archival print with printed caption",
    transcription: "Inauguration of CSC Course 1",
    description: "A group photograph taken outdoors in front of a single-storey building.",
  },
  {
    id: "hq",
    kind: "photo",
    photoId: "college-hq",
    title: "Former College HQ Complex",
    type: "Archival colour print",
    transcription: "Former College HQ Complex",
    description: "A colour print of the former headquarters buildings and forecourt.",
  },
  {
    id: "chronology",
    kind: "chronology",
    title: "The Approved Chronology",
    type: "Exhibition record · ten approved milestones",
    description: "The ten milestones approved for this exhibition, set out as a single record.",
  },
  {
    id: "dh1",
    kind: "photo",
    photoId: "dh-1",
    title: "Guard of Honour",
    type: "Archival print · no printed caption",
    description: "A dignitary inspects a uniformed guard of honour. Event and date are not recorded on the print.",
  },
  {
    id: "dh2",
    kind: "photo",
    photoId: "dh-2",
    title: "Salute on the Dais",
    type: "Archival print · no printed caption",
    description: "An officer salutes from a dais as guests look on. Event and date are not recorded on the print.",
  },
  {
    id: "dh3",
    kind: "photo",
    photoId: "dh-3",
    title: "Arrival of a Dignitary",
    type: "Archival print · no printed caption",
    description: "A dignitary is received on arrival by car. Event and date are not recorded on the print.",
  },
  {
    id: "crest",
    kind: "photo",
    photoId: "afcsc-crest",
    title: "The College Crest",
    type: "Institutional insignia",
    transcription: "Armed Forces Command and Staff College · Leadership and Knowledge · Nigeria",
    description: "The crest of the Armed Forces Command and Staff College, bearing the motto “Leadership and Knowledge”.",
  },
];
