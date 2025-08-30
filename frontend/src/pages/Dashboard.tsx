import React, { useState } from "react";
// import { useGeolocated } from "react-geolocated";

// Internal CSS for custom variables and animations
const customStyles = `
  :root {
    --bg-color: #0a0d10;
    --secondary-color: #1a1e22;
    --primary-color: #3b82f6;
    --accent-color: #1f2937;
    --text-color: #e5e7eb;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }
`;

const notes = [
  {
    title: "Project Brainstorm",
    tags: ["Work", "Ideas"],
    date: "Edited 2 days ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3-F7yuvTYcpY3mUmJ8QJjNNQETmVknZRxm7vx5E5sa1cEOPyF3LU2JC_pQAEzPmfD73sbFhLSPnzbPqLSCghZrm_6rEPUvey8mfZJ7CmfocfcPu1N7VGV7uuHQdGolTq8mTxU0toMXMsfT04LLK1I03pRbJxFA2fz3uk2TlwRmTBBTS2ueh5eIKLMBClkCKQinzecEEtF1YVvGP6xii9s3OZdgTmfJwrk4EN5Bm2aYYouC8ZUhdIbyBWOuUqfCLXObhGUk7lXWSuL",
  },
  {
    title: "Meeting Notes",
    tags: ["Work"],
    date: "Created 3 days ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCThWA5PE8Yyc51j8I32zKZ_vOFqmppjkNTCQfiW-JwpLb96eGrUPxAlfz9dhVrF1j3Pb8nWQ-3Tnz3wfSgKUae9lCfvEBZORFjYLZnSzNRa-RwMQG69BGX8jlRbAd7TPFI-lHyu8OGy7x_VdX5TPhMgvPPdCSk3bv-JfCaNQfRz57gutRRAsWEwigbe6WTy2u79H63bcL5EyVsmprEpXNCUaIbzaQ9vvG7UQY801WrnNKaefxVE6f43lKbGRbJHIEZ0sNSBd3eYb7v",
  },
  {
    title: "Personal Journal",
    tags: ["Personal"],
    date: "Edited 5 days ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHKz3Vcdc3xQUbHDbYhP5dovswmWZSUSYaGrHiwQQSEJsnPSkpG6WnRdOSG1EgawV6LhNadzbVQsVIna4YsBPk0DdL9_G5g1xROzAcRS8BojwsSI5MDbl0g6A_jxufSIIwKZWbXDNKWcf3lfJZJhICKae6wf03K6u0kMbmACWHFB1Y-1nMTB1EiearIPnGw94f6W0OzEnRJqLwuBbIloNolaprD_4__6sVXbhcoHBiNyE2DQ5l_blX4_TLFGI9-sNvfTsRl8jjAbpd",
  },
  {
    title: "Travel Plans",
    tags: ["Personal", "Travel"],
    date: "Edited 1 week ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBtmTvOVr4mtHm7H2w1qF-XdeOFOZoiKuftzol__a4ZgBRmvdLVkrYy8JMfSo7KoemrpMZI63Y9g8zKUwRxOPUz5WBAcvjp1DHXQdEWOAwGQyMT-hJJXJt2ZfsPQZcjn4H-NVrlnhUukaKNZRx-rRxpj9HfHNbOLYhI_gLySv36l1HuqOofWQiYlBusINwLZSNQzGH2ADbCXCEs5lSgwFPsv-SIOanx6v81Do1tPOwdJs6sRk55zbRjLvs_xcGGTJtGVoUhuPtkF4A",
  },
  {
    title: "Grocery List",
    tags: ["Personal"],
    date: "Created 1 week ago",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8HaHse7JMRslvDajibF4SUZl1ubroOHcs94-69To87qEYZmCGohlshMV5MJz7uVYbaL8i6sjAf1GcPVasQoTu4ipHdHcNHupqv1Ux3lv2PlQEzO0i152KDBRYPJm4MRpoI3jITuHivT-U-ytdRIMeE8STh-vd-skuDkt0zDM4GrWNTT7tBFUfuZEvv9Q8QEyHEvizmwmReRNIL-2JwgYHG_6vjhVf6BdHUK2uTa0uf-MW7wbWYXRGonsXn5qxBGqlPHFbNqMHM9bA",
  },
 
];

const tags = ["Work", "Personal", "Travel", "Ideas", "Goals", "Recipes"];

const App = () => {
  const [search, setSearch] = useState("");
  // const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
  //   positionOptions: {
  //     enableHighAccuracy: false,
  //   },
  //   userDecisionTimeout: 5000,
  // });

  return (
    <>
      <style>{customStyles}</style>
      <div className="flex min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans">
        {/* Left Sidebar */}
        <aside className="flex w-20 flex-col items-center gap-y-8 border-r border-gray-800 bg-[var(--secondary-color)]/50 py-6 backdrop-blur-lg">
          <div className="size-8 text-[var(--primary-color)]">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <nav className="flex flex-1 flex-col items-center gap-6 text-gray-400">
            <button className="p-2 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>
            <button className="p-2 mt-auto rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44C9.77 2 8 3.73 8 6v4a5.001 5.001 0 0 0-5 5v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-3a5.001 5.001 0 0 0-5-5V6c0-2.27-1.77-4-4-4z" />
              </svg>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="glassmorphic sticky top-0 z-10 flex h-20 items-center justify-between px-8 bg-black/30 backdrop-blur-lg border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">NoteDesk</h2>
            <div className="flex flex-1 items-center justify-center px-12 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-gray-400 absolute left-14 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                className="form-input w-full rounded-full border-none bg-transparent py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Online</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                </label>
              </div>
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocIR4l2y5I6Pj2-K3nN3-1k6m3S5mYjL5g6L4g-5qA=s96-c"
                alt="User Avatar"
                className="size-10 rounded-full"
              />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex flex-1 flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-white">
                Ready to capture ideas, Avi?
              </h1>
              <p className="text-lg text-gray-400">Let your creativity flow.</p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-600 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  New Note
                </button>

                <button className="flex items-center gap-2 rounded-full border border-gray-600 px-6 py-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Import
                </button>
                <button className="flex items-center gap-2 rounded-full border border-gray-600 px-6 py-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Sync
                </button>
                <button className="flex items-center gap-2 rounded-full border border-gray-600 px-6 py-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 20.73a9 9 0 1 1 9.77-9.77" />
                    <path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  </svg>
                  Offline Mode
                </button>
              </div>
              <div className="flex rounded-full bg-[var(--accent-color)]/50 p-1">
                <button className="flex items-center gap-2 rounded-full bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  Grid
                </button>
                <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-400 hover:bg-[var(--primary-color)]/20 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                  List
                </button>
              </div>
            </div>

            <div className="grid flex-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes
                .filter((note) =>
                  note.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((note, index) => (
                  <div
                    key={index}
                    className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl bg-[var(--secondary-color)] p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--primary-color)]/20 max-w-[300px] mx-auto"
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={note.img}
                        alt={note.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {note.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, i) => {
                        let colorClass =
                          "bg-[var(--primary-color)]/20 text-[var(--primary-color)]";
                        if (tag === "Work")
                          colorClass = "bg-purple-500/20 text-purple-400";
                        if (tag === "Personal")
                          colorClass = "bg-green-500/20 text-green-400";
                        if (tag === "Travel")
                          colorClass = "bg-yellow-500/20 text-yellow-400";
                        if (tag === "Ideas")
                          colorClass = "bg-cyan-500/20 text-cyan-400";
                        if (tag === "Goals")
                          colorClass = "bg-orange-500/20 text-orange-400";
                        if (tag === "Recipes")
                          colorClass = "bg-rose-500/20 text-rose-400";

                        return (
                          <span
                            key={i}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button className="size-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button className="size-10 rounded-full bg-[var(--primary-color)] text-white font-semibold flex items-center justify-center shadow-md">
                1
              </button>
              <button className="size-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                2
              </button>
              <button className="size-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                3
              </button>
              <span className="text-gray-500">...</span>
              <button className="size-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                9
              </button>
              <button className="size-10 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden w-[320px] lg:flex flex-col gap-6 p-6 border-l border-gray-800 bg-[var(--secondary-color)]/50 backdrop-blur-lg">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {notes.slice(0, 3).map((note, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--accent-color)] transition-colors duration-200 cursor-pointer"
                >
                  <div className="size-8 mt-1 flex-shrink-0 rounded-lg bg-[var(--primary-color)]/20 text-[var(--primary-color)] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{note.title}</h3>
                    <p className="text-sm text-gray-400">{note.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Tags Cloud</h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400 cursor-pointer">
                Work
              </span>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 cursor-pointer">
                Personal
              </span>
              <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400 cursor-pointer">
                Travel
              </span>
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400 cursor-pointer">
                Ideas
              </span>
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400 cursor-pointer">
                Goals
              </span>
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-400 cursor-pointer">
                Recipes
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <h2 className="text-xl font-bold text-white">Sync Status</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--accent-color)]/50">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 text-[var(--primary-color)] animate-spin-slow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v2.5M21.5 22v-2.5M2 2.5V22M2 2.5h2.5M2 22h2.5M22 2.5h-2.5M22 22v-2.5" />
                </svg>
                <div>
                  <h3 className="font-semibold text-white">Online & Syncing</h3>
                  <p className="text-sm text-gray-400">Last sync: Just now</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default App;
