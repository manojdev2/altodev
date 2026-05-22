export default function FAQ() {
  const faqs = [
    {
      id: 1,
      question:
        "I just got my electric vehicle and I need to know where I can charge it. Can the app show me all available stations nearby in real time?",
      answer:
        "Yes, the app provides real-time updates on all available charging stations near your location.",
    },
    {
      id: 2,
      question:
        "I want to ensure that a charging station will be available when I arrive. Is it possible to reserve a slot in advance to avoid waiting?",
      answer:
        "Yes, reservations can be made in advance depending on station availability.",
    },
    {
      id: 3,
      question:
        "Can I browse stations without registering? Which features require creating an account to access them?",
      answer:
        "Browsing is available without registration, but booking and tracking require an account.",
    },
    {
      id: 4,
      question:
        "I want to avoid running out of battery unexpectedly while driving. Can the app notify me when my battery is low or when a charging session starts or ends?",
      answer:
        "Yes, the app can send notifications for battery status and charging sessions.",
    },
    {
      id: 5,
      question:
        "Do I need to pay to use the basic app features or to search for stations? Are there any additional costs or hidden charges I should be aware of?",
      answer:
        "Basic features are free. Charges only apply when using paid charging services.",
    },
    {
      id: 6,
      question:
        "Once I plug in my EV, I want to monitor how fast it is charging. Does the app provide live updates on battery percentage and estimated time remaining?",
      answer:
        "Yes, live updates show battery percentage and estimated charging time.",
    },
    {
      id: 7,
      question:
        "I own more than one electric vehicle and want to track charging for each car. Can the app handle multiple vehicles and show separate charging details for each?",
      answer: "Yes, multiple vehicles can be added and managed separately.",
    },
    {
      id: 8,
      question:
        "What should I do if a charging station is not working or if I encounter a problem with the app? Can I reach customer support quickly and easily?",
      answer:
        "You can report issues directly within the app or contact support anytime.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-[#f3f4f6]">
      {/* Header Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center mb-6">
          <div className="p-4 w-5 h-5 bg-linear-to-r from-[#00D492] via-[#00D3F2] to-[#51A2FF] rounded-full flex items-center justify-center">
            <span className="text-black text-[16px] font-bold">F</span>
          </div>
          <span className="text-[16px] font-bold text-black">
            requently Asked Questions
          </span>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Everything You
          <span className="bg-linear-to-r from-[#00D3F2] to-[#51A2FF] bg-clip-text text-transparent">
            {" "}
            Need to Know
          </span>
        </h2>
        <p className="mt-5 text-gray-400 text-lg">
          Find answers to common EV charging concerns quickly and easily
        </p>
      </div>

      {/* FAQ Items */}
      <div className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="group bg-white shadow-sm border border-gray-200 overflow-hidden"
          >
            <summary className="flex items-center justify-between px-8 py-8 cursor-pointer list-none">
              <div className="flex items-start gap-8">
                <span className="text-3xl font-bold text-gray-300 lg:text-4xl">
                  {String(faq.id).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-gray-900 max-w-200 lg:text-lg">
                  {faq.question}
                </span>
              </div>
              <span className="text-xl text-black group-open:rotate-45 transition lg:text-2xl">
                +
              </span>
            </summary>
            <div className="px-20 pb-8 text-gray-500 text-base">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
