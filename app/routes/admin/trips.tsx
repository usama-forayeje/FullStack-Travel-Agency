import { Header } from "~/components";

function Trips() {
  return (
    <main className="dashboard wrapper p-6 lg:p-8">
      <Header
        title="Trips"
        description="View and edit AI generated travel plans."
        ctaText="Create a Trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
}

export default Trips;
