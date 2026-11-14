// Precise rounded strokes and quiet duotone fills, specific to the bottom dock.
const paths = {
  home: (
    <>
      <path
        d="m4.5 10 7.5-6 7.5 6v9a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19Z"
        fill="currentColor"
        fillOpacity=".16"
        stroke="none"
      />
      <path d="m2.75 11.25 8.3-6.7a1.5 1.5 0 0 1 1.9 0l8.3 6.7M5 10v9a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-9" />
      <path d="M9.5 20.5v-6h5v6" />
    </>
  ),
  writing: (
    <>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="2.5"
        fill="currentColor"
        fillOpacity=".14"
        stroke="none"
      />
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 3.5v17M11.5 8h5.5M11.5 12h5.5M11.5 16H15" />
    </>
  ),
  projects: (
    <>
      <path
        d="M3 8h18v10.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
        fill="currentColor"
        fillOpacity=".18"
        stroke="none"
      />
      <path d="M3 8V5.5a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.6.8l1.4 1.9H19a2 2 0 0 1 2 2v10.3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
      <path d="M3 8h18M10 13h4" />
    </>
  ),
  about: (
    <>
      <circle
        cx="12"
        cy="7.5"
        r="3.75"
        fill="currentColor"
        fillOpacity=".18"
        stroke="none"
      />
      <circle cx="12" cy="7.5" r="3.75" />
      <path d="M4.5 20.25v-1a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v1" />
    </>
  ),
  sun: (
    <>
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="currentColor"
        fillOpacity=".18"
        stroke="none"
      />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2m0 15v2m-9-9h2m15 0h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: (
    <>
      <path
        d="M14.5 3.75a7 7 0 0 0 5.75 11 8.5 8.5 0 1 1-5.75-11Z"
        fill="currentColor"
        fillOpacity=".18"
        stroke="none"
      />
      <path d="M14.5 3.75a7 7 0 0 0 5.75 11 8.5 8.5 0 1 1-5.75-11Z" />
    </>
  ),
};

export type DockIconName = keyof typeof paths;

export function DockIcon({ name }: { name: DockIconName }) {
  return (
    <svg
      className="dock-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
