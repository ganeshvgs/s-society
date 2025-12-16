export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-gray-800">

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="text-center md:text-left">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-indigo-600 font-semibold">
            Registered Credit Co-operative Society
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Shri Brahmalingeshwara <br />
            Credit Co-operative Society (N)
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600">
            A trusted co-operative financial institution committed to
            member welfare, transparent governance, and sustainable
            financial growth.
          </p>

          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3 text-sm">
            <span className="px-4 py-2 bg-white rounded-full shadow">
              📍 Goli Hole, Mangalore
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow">
              🏛 Reg. No: 58396 / 2024-25
            </span>
          </div>

          <p className="mt-6 text-xs text-gray-500 italic">
            * Member and Admin access is available via secure login.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
            alt="Co-operative Society"
            className="w-full max-w-md rounded-2xl shadow-xl object-cover"
          />
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Our Financial Services
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          We provide secure, member-friendly financial solutions designed
          to support personal growth and community development.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Loans",
              icon: "💰",
              desc: "Personal and business loans with reasonable interest rates.",
            },
            {
              title: "Fixed Deposits",
              icon: "🏦",
              desc: "Safe investments with assured returns and flexible tenure.",
            },
            {
              title: "Recurring Deposits",
              icon: "📆",
              desc: "Monthly savings plans to build disciplined habits.",
            },
            {
              title: "Share Capital",
              icon: "📊",
              desc: "Ownership participation in society growth.",
            },
            {
              title: "CD Accounts",
              icon: "📜",
              desc: "Secure compulsory deposit schemes.",
            },
            {
              title: "Member Welfare",
              icon: "🤝",
              desc: "Long-term financial and social well-being.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition text-center sm:text-left"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-indigo-700">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-300 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm">
          <p className="font-medium text-white">
            Shri Brahmalingeshwara Credit Co-operative Society (N)
          </p>

          <p className="mt-2 text-xs sm:text-sm">
            Goli Hole, Mangalore · Karnataka
          </p>

          <p className="mt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
