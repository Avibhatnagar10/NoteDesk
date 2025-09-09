import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import the stylesheet

// --- ICONS ---
// Using components for icons makes the JSX cleaner
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
  </svg>
);

const FileIcon = () => (
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
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const StarIcon = () => (
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
);

const SyncIcon = () => (
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
    <path d="M1 4v6h6" />
    <path d="M23 20v-6h-6" />
    <path d="M20.49 9A9 9 0 0 0 7.2 4.24" />
    <path d="M3.51 15a9 9 0 0 0 13.29 4.76" />
  </svg>
);

const SettingsIcon = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Accurate data based on the screenshot
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

const allTags = ["Work", "Personal", "Travel", "Ideas", "Goals", "Recipes"];

const tagClassMap: Record<string, string> = {
  Work: "tag-work",
  Personal: "tag-personal",
  Travel: "tag-travel",
  Ideas: "tag-ideas",
  Goals: "tag-goals",
  Recipes: "tag-recipes",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([
    "Work",
    "Travel",
    "Goals",
    "Recipes",
  ]);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState(new Date().toLocaleString());
  const [, setLogout] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setLastSync(new Date().toLocaleString());
      setTick(0);
    }
  }, [isOnline]);
  const handleLogout = () => {
    setLogout(true);
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000); // every 1 min
    return () => clearInterval(interval);
  }, []);

  // Format time difference
  const getTimeAgo = () => {
    if (!lastSync) return "";
    const diffMs = Date.now() - new Date(lastSync).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins === 0) return "Just now";
    return `${diffMins}m ago`;
  };
  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex max-h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-sans ml-20">
      {/* Left Sidebar */}
      <aside className="fixed  top-0 left-0 h-screen w-20 flex flex-col items-center gap-y-8 border-r border-gray-800 bg-[var(--secondary-color)]/50 py-6">
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
        <nav className="flex flex-1 flex-col items-center gap-4 text-gray-400">
          <button className="p-3 rounded-lg bg-[var(--accent-color)]/80 text-white transition-colors duration-200">
            <HomeIcon />
          </button>
          <button className="p-3 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
            <FileIcon />
          </button>
          <button className="p-3 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
            <StarIcon />
          </button>
          <button className="p-3 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200">
            <SyncIcon />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="p-3 rounded-lg hover:bg-[var(--accent-color)]/50 transition-colors duration-200"
          >
            <SettingsIcon />
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col ">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-800 bg-[var(--bg-color)]/80 px-8 backdrop-blur-lg">
          <h2 className="text-xl font-bold text-white">NoteDesk</h2>
          <div className="hidden sm:flex flex-1 items-center justify-center px-12 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 text-gray-500 absolute left-16 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-700 bg-transparent py-2.5 pl-12 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-0"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:from-red-600 hover:to-red-700 hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition-colors duration-300 ${
                isOnline
                  ? "bg-blue-500 text-white ring-2 ring-blue-400"
                  : "bg-gray-400 text-white ring-2 ring-gray-300"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value={isOnline.toString()}
                onChange={() => setIsOnline(!isOnline)}
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <img
              src="https://i.pravatar.cc/150?u=avi"
              alt="User Avatar"
              className="size-10 rounded-full ring-2 ring-blue-500"
            />
          </div>
        </header>
        {/* Search (mobile only) */}
        <div className="sm:hidden px-4 py-2">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-700 bg-transparent py-2 pl-4 pr-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-0"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl font-bold text-white">
              Ready to capture ideas?
            </h1>
            <p className="text-lg text-gray-400">Let your creativity flow.</p>
          </div>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-4 ">
              <button
                onClick={() => navigate("/notesEditor")}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
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
              <button className="toolbar-btn ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Import
              </button>
              <button className="toolbar-btn">
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
                  <path d="M1 4v6h6" />
                  <path d="M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 7.2 4.24" />
                  <path d="M3.51 15a9 9 0 0 0 13.29 4.76" />
                </svg>
                Sync
              </button>
              <button className="toolbar-btn">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.title}
                className="group flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl bg-[var(--secondary-color)] p-4 transition-transform duration-300 hover:scale-105"
              >
                <div className="aspect-[16/10] w-full overflow-hidden rounded-lg">
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
                  {note.tags.map((tag) => (
                    <span key={tag} className={`tag ${tagClassMap[tag]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 mt-8">
            <button className="pagination-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="text-gray-500 px-2">...</span>
            <button className="pagination-btn">9</button>
            <button className="pagination-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden lg:flex w-[320px] flex-col gap-8 p-6 border-l border-gray-800 bg-[var(--secondary-color)]/50">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          <div className="flex flex-col gap-2">
            {notes.slice(0, 3).map((note) => (
              <div
                key={note.title}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--accent-color)]/60 cursor-pointer"
              >
                {/* <div className="size-9 mt-0.5 flex-shrink-0 rounded-lg bg-[var(--accent-color)]/80 text-gray-400 flex items-center justify-center">
                  {note.activityType === "edited" ? <PencilIcon /> : <CreatedIcon />
                </div> */}
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{note.title}</h3>
                  <p className="text-sm text-gray-400">{note.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white">Tags Cloud</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag-cloud-item ${
                  selectedTags.includes(tag) ? "selected" : ""
                } ${tagClassMap[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <h2 className="text-lg font-bold text-white">Sync Status</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--accent-color)]/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`size-7 ${
                isOnline
                  ? "text-blue-500 animate-spin-slow"
                  : isOnline
                  ? "text-gray-500"
                  : "text-red-500"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <div>
              <h3 className="font-semibold text-white">
                {isOnline
                  ? "Online & Syncing"
                  : isOnline
                  ? "Offline & Not Syncing"
                  : "Offline & Not Syncing"}
              </h3>
              <p className="text-sm text-gray-400">
                {isOnline ? `Last sync: ${getTimeAgo()}` : "Sync paused"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
