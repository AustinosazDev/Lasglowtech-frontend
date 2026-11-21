# Lasglowtech — About Section Copy

Revised to remove all "since," "launched," and "year founded" references, per feedback.
Use in `src/components/sections/AboutSection.jsx` in place of the current two paragraphs.


PART 5 — About section: remove "Year founded" stat, make the intro copy more elaborate

File: src/components/sections/AboutSection.jsx

1. Remove the "Year founded" entry from the `stats` array (top of file):
   Delete: { value: "2021", label: "Year founded", Icon: FaCalendar },
   Result: stats array keeps only Projects delivered, Client rating, Avg. turnaround.

   Also remove the now-unused FaCalendar import from the react-icons import line.

2. Update the stats grid to look balanced with 3 items instead of 4 (currently `grid-cols-2 md:grid-cols-4`):
   Change to: className="brand-card grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 md:p-8 mb-12 md:mb-16"

---

New about section text 
Lasglowtech is a creative technology company built for a digital-first world. We work at the intersection of design, engineering, and brand strategy — helping startups, founders, and growing teams turn ambitious ideas into products and brands people actually trust and use.

From the first sketch to the final launch, our team brings together thoughtful design, solid code, and clear strategy under one roof. We don't just build websites and apps — we help businesses show up professionally everywhere their customers meet them, from a polished digital product to a brand identity people remember.

---

