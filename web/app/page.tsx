async function getApiHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/db`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("API not reachable");
  return res.json();
}

export default async function Home() {
  const health = await getApiHealth();

  return (
    <main style={{ padding: 40 }}>
      <h1>CV Analyzer</h1>
      <p>API status: {health.status}</p>
      <p>User count: {health.userCount}</p>
    </main>
  );
}