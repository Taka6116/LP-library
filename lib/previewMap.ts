import type { ComponentType } from "react";
import type { PreviewComponentProps } from "@/types/section";

import { HeroProblemFirst } from "@/components/previews/HeroProblemFirst";
import { HeroOutcomeFirst } from "@/components/previews/HeroOutcomeFirst";
import { HeroVisualDashboard } from "@/components/previews/HeroVisualDashboard";
import { HeroAssetSync } from "@/components/previews/HeroAssetSync";
import { HeroHerpTrust } from "@/components/previews/HeroHerpTrust";
import { ProblemThreeCards } from "@/components/previews/ProblemThreeCards";
import { ProblemBeforeState } from "@/components/previews/ProblemBeforeState";
import { ProblemHiddenCost } from "@/components/previews/ProblemHiddenCost";
import { HookQuestion } from "@/components/previews/HookQuestion";
import { HookGap } from "@/components/previews/HookGap";
import { HookCommonMisunderstanding } from "@/components/previews/HookCommonMisunderstanding";
import { SolutionOverview } from "@/components/previews/SolutionOverview";
import { SolutionThreePillars } from "@/components/previews/SolutionThreePillars";
import { SolutionWorkflow } from "@/components/previews/SolutionWorkflow";
import { BenefitThreePoints } from "@/components/previews/BenefitThreePoints";
import { BenefitKpiGrid } from "@/components/previews/BenefitKpiGrid";
import { BenefitBeforeAfter } from "@/components/previews/BenefitBeforeAfter";
import { ProcessStepFlow } from "@/components/previews/ProcessStepFlow";
import { ProcessCollaboration } from "@/components/previews/ProcessCollaboration";
import { ProcessTimeline } from "@/components/previews/ProcessTimeline";
import { ProofCaseCards } from "@/components/previews/ProofCaseCards";
import { ProofTrustMetrics } from "@/components/previews/ProofTrustMetrics";
import { ProofLogos } from "@/components/previews/ProofLogos";
import { PricingThreePlans } from "@/components/previews/PricingThreePlans";
import { PricingCustom } from "@/components/previews/PricingCustom";
import { PricingComparison } from "@/components/previews/PricingComparison";
import { FaqAccordion } from "@/components/previews/FaqAccordion";
import { FaqObjection } from "@/components/previews/FaqObjection";
import { FaqTwoColumn } from "@/components/previews/FaqTwoColumn";
import { CtaFinal } from "@/components/previews/CtaFinal";
import { CtaSoft } from "@/components/previews/CtaSoft";
import { CtaSplit } from "@/components/previews/CtaSplit";
// Sansan活用ガイド の実セクション
import { HeroSansanGuide } from "@/components/previews/HeroSansanGuide";
import { HookSelectorThreeQuestions } from "@/components/previews/HookSelectorThreeQuestions";
import { SolutionKatsuyoThreeCol } from "@/components/previews/SolutionKatsuyoThreeCol";
import { ProofSansanCases } from "@/components/previews/ProofSansanCases";
import { ProofSansanCommunity } from "@/components/previews/ProofSansanCommunity";
import { CtaSansanHelp } from "@/components/previews/CtaSansanHelp";

// componentType (string) -> preview component.
// To add a new section: build the component, then register it here. The UI
// resolves everything through this map, so nothing else needs to change.
export const previewMap: Record<
  string,
  ComponentType<PreviewComponentProps>
> = {
  HeroProblemFirst,
  HeroOutcomeFirst,
  HeroVisualDashboard,
  HeroAssetSync,
  HeroHerpTrust,
  ProblemThreeCards,
  ProblemBeforeState,
  ProblemHiddenCost,
  HookQuestion,
  HookGap,
  HookCommonMisunderstanding,
  SolutionOverview,
  SolutionThreePillars,
  SolutionWorkflow,
  BenefitThreePoints,
  BenefitKpiGrid,
  BenefitBeforeAfter,
  ProcessStepFlow,
  ProcessCollaboration,
  ProcessTimeline,
  ProofCaseCards,
  ProofTrustMetrics,
  ProofLogos,
  PricingThreePlans,
  PricingCustom,
  PricingComparison,
  FaqAccordion,
  FaqObjection,
  FaqTwoColumn,
  CtaFinal,
  CtaSoft,
  CtaSplit,
  HeroSansanGuide,
  HookSelectorThreeQuestions,
  SolutionKatsuyoThreeCol,
  ProofSansanCases,
  ProofSansanCommunity,
  CtaSansanHelp,
};

export function getPreviewComponent(componentType: string) {
  return previewMap[componentType];
}
