export const INQUIRY_SERVICE_OPTIONS = [
  "Azure Cloud Architecture and Consulting",
  "Cloud Migration and Business IT Onboarding",
  "DevOps and Platform Engineering",
  "Microsoft Active Directory and IT Automation",
  "Cloud Security, Governance and Reliability",
  "AI Agents and Intelligent Business Automation",
  "IT Architecture and Technical Advisory",
] as const;

export type InquiryService = (typeof INQUIRY_SERVICE_OPTIONS)[number];
