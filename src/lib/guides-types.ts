export interface GuideSection {
  title: string;
  paragraphs: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

/**
 * A single informational guide page (/<locale>/guides/<slug>/).
 * Guides are written by hand per locale (no machine fallback): each language
 * gets its own copy that targets the local long-tail query and links to
 * indexable (retained) tool pages via `relatedTools`.
 */
export interface Guide {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  updated: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedTools: string[];
}
