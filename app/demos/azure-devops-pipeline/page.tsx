import type { Metadata } from "next";
import { PipelineSimulatorDemo } from "@/components/pipeline-simulator-demo";

export const metadata: Metadata = {
  title: "Azure DevOps Release Pipeline Simulator | ShivT-Cs Portfolio",
  description:
    "Interactive local simulation of Azure DevOps release pipeline gates, approvals, failure scenarios, and rollback behavior.",
};

export default function AzureDevOpsPipelineDemoPage() {
  return <PipelineSimulatorDemo />;
}
