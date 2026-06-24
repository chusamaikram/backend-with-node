import { useState } from "react";
import Container from "@/layouts/Container";
import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";
import { cn } from "@/utils/cn";

const TABS = ["Profile", "Password"];

function SettingsPage() {
  const [active, setActive] = useState("Profile");

  return (
    <Container as="section" className="py-6 space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Settings</h1>

      {/* Tab nav */}
      <nav aria-label="Settings sections" className="flex border-b border-bg-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            aria-selected={active === tab}
            role="tab"
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px",
              active === tab
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div>
        {active === "Profile"  && <ProfileTab />}
        {active === "Password" && <PasswordTab />}
      </div>
    </Container>
  );
}

export default SettingsPage;
