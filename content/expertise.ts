export type ExpertiseGroup = {
  title: string;
  items: string[];
};

export const expertise: ExpertiseGroup[] = [
  {
    title: "Azure Architecture",
    items: ["Landing zones", "Identity and governance", "Network design", "Resilience patterns"],
  },
  {
    title: "DevOps and IaC",
    items: ["Azure DevOps", "GitHub Actions", "Terraform and OpenTofu", "Release automation"],
  },
  {
    title: "Container Platforms",
    items: ["AKS and Kubernetes", "Docker", "Helm", "Platform engineering workflows"],
  },
  {
    title: "Security and Reliability",
    items: ["DevSecOps", "Azure security baseline", "SRE and observability", "Compliance-aware delivery"],
  },
  {
    title: "Engineering Foundations",
    items: ["Python automation", "Cloud migration", "Data platform integration", "AI infrastructure"],
  },
];
