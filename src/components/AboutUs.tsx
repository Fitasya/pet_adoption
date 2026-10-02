// AboutUs.tsx
import type { ReactNode } from "react";

const stats = [
  { value: "250+", label: "Pets adopted" },
  { value: "40", label: "Pets waiting" },
  { value: "3 yrs", label: "Helping families" },
];

const steps = [
  {
    title: "Browse and apply",
    text: "Look through the available pets and submit an adoption request.",
  },
  {
    title: "We review",
    text: "Our review team looks at each request and may chat with you to learn more.",
  },
  {
    title: "Welcome home",
    text: "If approved, we arrange pickup and your new family member comes home.",
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-transparent dark:bg-slate-800 border 
    border-slate-400 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold">About Pet AdoptHub 🐾</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          A small adoption center in Penang that helps pets find loving homes.
          Every animal is cared for, checked by a vet, and matched with people
          who are ready for them.
        </p>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-orange-50/50 dark:bg-slate-800 border border-slate-400 
            rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-orange-600">{s.value}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <Section title="How it works">
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="h-8 w-8 shrink-0 rounded-full bg-orange-500 
              text-white font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Promise */}
      <Section title="Our promise">
        <p className="text-slate-600 dark:text-slate-300">
          We review every request carefully so each pet goes to a home that
          fits. One pet can only be adopted by one family, which is why a
          request may be declined if someone else was approved first.
        </p>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <p className="text-slate-600 dark:text-slate-300">
          hello@petadopthub.example
          <br />
          Open daily, 9am to 5pm
        </p>
      </Section>
    </div>
  );
}