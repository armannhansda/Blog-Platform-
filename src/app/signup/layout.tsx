import { TRPCProvider } from "@/lib/trpc/provider";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </ThemeProvider>
  );
}
