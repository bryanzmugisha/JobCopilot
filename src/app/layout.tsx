import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Job Copilot",
  description: "Personal job-application cockpit",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="inner">
            <a className="brand" href="/">Job Copilot</a>
            <nav className="nav">
              <a href="/">Dashboard</a>
              <a href="/jobs/new">Add job</a>
              <a href="/profile">Profile</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
