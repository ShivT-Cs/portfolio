import type { Metadata } from "next";
import { AIOpsIncidentLabDemo } from "@/components/aiops-incident-lab-demo";

export const metadata: Metadata = {
  title: "AIOps Incident Intelligence Lab | Interactive Demo",
  description:
    "Interactive AIOps incident simulation with deterministic correlation rules, incident lifecycle controls, and remediation approval workflow.",
};

export default function AIOpsIncidentLabPage() {
  return <AIOpsIncidentLabDemo />;
}
