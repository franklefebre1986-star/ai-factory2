export const metadata = {
  title: "AI Factory",
  description: "Text to Image & Video AI generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#111", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
