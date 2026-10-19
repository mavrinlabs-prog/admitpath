import { ProFeatureGate } from "@/components/pro-feature-gate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProFeatureGate feature="summerPrograms">{children}</ProFeatureGate>;
}
