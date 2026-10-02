// components/Home.tsx
import type { Pet, ActiveTab } from "../types";
import { Button } from "./ui/button";

const stories = [
  {
    family: "John",
    emoji: "🐶",
    petName: "Biscuit",
    quote: "Biscuit settled in on day one. Best decision we made.",
    imageUrl:
      "https://t3.ftcdn.net/jpg/01/13/87/94/360_F_113879401_M52gbuVskKjIDI8YZqa9p6uHYDJ3MaMZ.jpg",
  },
  {
    family: "Sarah",
    emoji: "🐱",
    petName: "Mochi",
    quote:
      "I came for a quiet companion and got a tiny roommate with opinions.",
    imageUrl:
      "https://media.istockphoto.com/id/1292160959/photo/smiling-woman-in-checked-shirt-hugging-and-embracing-with-tenderness-and-love-domestic-ginger.jpg?s=612x612&w=0&k=20&c=gzYrRScICE_3MoGwVDNXjh6mwuQYRSoF0joqYNfEp2U=",
  },
  {
    family: "The Rahman family",
    emoji: "🐰",
    petName: "Clover",
    quote: "The kids ask about Clover before they ask about breakfast.",
    imageUrl:
      "https://img.magnific.com/free-photo/close-up-rabbit-owner-arms_23-2148415188.jpg",
  },
];

interface HomeProps {
  pets: Pet[];
  setActiveTab: (tab: ActiveTab) => void;
  onAdopt: (petId: string) => void;
}

export function Home({ pets, setActiveTab, onAdopt }: HomeProps) {
  const featured = pets.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-orange-100 dark:bg-orange-900/30 px-6 py-12 text-center">
        <h1 className="text-4xl font-bold">Find your new best friend 🐾</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Every pet here is vet-checked and waiting for a home like yours.
        </p>
        <Button
          size="lg"
          onClick={() => setActiveTab("apply")}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
        >
          Meet our pets
        </Button>
      </section>

      {/* Featured pets */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Waiting for a home</h2>

        {featured.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">
            All our pets have found homes for now. Check back soon!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-800 border border-slate-400 rounded-lg overflow-hidden flex flex-col"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-slate-500">{p.breed}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {p.description}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => onAdopt(p.id)}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  >
                    Adopt
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Happy families */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Happy families</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {stories.map((s) => (
            <figure
              key={s.family}
              className="bg-transparent dark:bg-slate-800 border border-slate-400 rounded-lg overflow-hidden"
            >
              <img
                src={s.imageUrl}
                alt={`${s.family} with ${s.petName}`}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
              <div className="p-6 text-center">
                <blockquote className="italic text-slate-700 dark:text-slate-200">
                  “{s.quote}”
                </blockquote>
                <figcaption className="mt-3 text-sm text-slate-500">
                  {s.family}, adopted {s.petName}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="rounded-2xl bg-orange-500 text-white px-6 py-10 text-center">
        <h2 className="text-2xl font-bold">Ready to adopt?</h2>
        <p className="mt-2">
          Submit a request and our team will take it from there.
        </p>
        <Button
          size="lg"
          onClick={() => setActiveTab("apply")}
          className="mt-5 bg-white text-orange-600 hover:bg-orange-50 cursor-pointer"
        >
          Start your request
        </Button>
      </section>
    </div>
  );
}
