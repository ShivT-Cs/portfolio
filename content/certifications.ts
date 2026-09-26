export type CertificationItem = {
  name: string;
  status: "owner-verify" | "verified";
  verificationUrl?: string;
};

export const certifications: CertificationItem[] = [
  { name: "AZ-900", status: "owner-verify" },
  { name: "AZ-104", status: "owner-verify" },
  { name: "AZ-305", status: "owner-verify" },
  { name: "AZ-400", status: "owner-verify" },
  { name: "AZ-500", status: "owner-verify" },
  { name: "Microsoft Certified Trainer (MCT)", status: "owner-verify" },
];
