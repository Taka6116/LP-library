// Core domain types for the LP Builder Library.
// Section data and presentation are intentionally decoupled: data lives in
// data/sectionLibrary.ts, components resolve via lib/previewMap.ts using
// `componentType`. This keeps the door open for JSON export, template saving,
// per-client theming, and code generation later.

export type SectionPattern = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  tags: string[];
  /** Key into previewMap that resolves the React component to render. */
  componentType: string;
  recommendedFor: string[];
};

export type SectionCategory = {
  id: string;
  label: string;
  labelJa: string;
  /** Determines the vertical order sections appear in the generated LP. */
  order: number;
  description: string;
  sections: SectionPattern[];
};

/** categoryId -> selected sectionId (one section per category). */
export type SelectedSections = {
  [categoryId: string]: string;
};

export type BuilderMode = "library" | "preview";

// Future theming contract. Preview components should accept (and tolerate the
// absence of) a theme prop so案件ごとの差し替え becomes a prop change, not a rewrite.
export type LPTheme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  radius: "sm" | "md" | "lg" | "xl";
  animation: "none" | "fade" | "slide" | "scale";
};

export type PreviewVariant = "card" | "full";

export type PreviewComponentProps = {
  /** Rendered compact inside a SectionPatternCard, or full-width in the LP. */
  variant?: PreviewVariant;
  theme?: Partial<LPTheme>;
};
