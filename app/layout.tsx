import "./globals.css";

export const metadata = {
  title: "Little Letters",
  icons: {
    icon: "/tab-icon.png"
  },
  description:
    "Connecting K–12 students with MSU mentors through letters, creativity, and encouragement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f9faf7] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
