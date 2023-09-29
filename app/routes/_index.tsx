import { useIsAdmin } from "~/hooks";

export default function IndexPage() {
  const isAdmin = useIsAdmin();

  return (
    <div>
      <h1>Remix Template Lite</h1>
      <p>
        This is a starter template for a Remix app.
      </p>
    </div>
  );
}