import { Quote } from "lucide-react";

const stats = [
  {
    value: "50,000+",
    label: "Problems Solved",
  },
  {
    value: "98%",
    label: "Accuracy Rate",
  },
  {
    value: "10,000+",
    label: "Active Students",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

const testimonials = [
  {
    quote:
      "Sokrate AI helped me understand quantum mechanics concepts that I struggled with for months. The step-by-step solutions are incredibly detailed.",
    author: "Sarah Chen",
    role: "PhD Candidate, Physics",
    avatar: "SC",
  },
  {
    quote:
      "I use the Synthesizer daily to process research papers. It saves me hours of reading and helps me focus on what matters.",
    author: "Marcus Johnson",
    role: "Graduate Researcher",
    avatar: "MJ",
  },
  {
    quote:
      "The best study tool I've ever used. It's like having a personal tutor available 24/7 who never gets tired of explaining.",
    author: "Emily Rodriguez",
    role: "Pre-Med Student",
    avatar: "ER",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 md:py-32 relative bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
            Trusted by <span className="text-gradient">Thousands</span> of Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join a growing community of learners achieving their academic goals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 text-center animate-fade-in border border-slate-200 shadow-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-heading font-bold text-green-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6 relative animate-fade-in border border-slate-200 shadow-sm"
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
    >
      <Quote className="w-8 h-8 text-green-500/20 absolute top-6 right-6" />

      <p className="text-gray-700 leading-relaxed mb-6">
        "{testimonial.quote}"
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-sm font-semibold text-white">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-medium text-slate-900">{testimonial.author}</div>
          <div className="text-sm text-gray-600">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}