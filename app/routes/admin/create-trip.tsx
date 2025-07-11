import React, { useState } from "react";
import { Header } from "~/components";
import { Combobox } from "~/components/ui/combobox";
import { useLoaderData } from "react-router";
import allCountriesData from "~/data/countries.json";

// ====================== LOADER ======================
export const loader = async (): Promise<Country[]> => {
  try {
    const processedData: Country[] = allCountriesData.map((country: any) => ({
      name: country.name,
      value: country.value,
      flagUrl: country.flagUrl,
      coordinates: country.coordinates,
      openStreetMap: country.openStreetMap,
    }));
    processedData.sort((a, b) => a.name.localeCompare(b.name));

    return processedData;
  } catch (error) {
    console.error("Error loading country data from JSON file:", error);
    return [];
  }
};

// ====================== COMPONENT ======================

function CreateTrip() {
  const countries = useLoaderData() as Country[];
  const [selectedCountryValue, setSelectedCountryValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(countries);

  const selectedCountry = React.useMemo(() => {
    return countries.find((c) => c.value === selectedCountryValue);
  }, [selectedCountryValue, countries]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(e.target.value);
  };

  if (!countries.length) {
    return (
      <main className="wrapper">
        <Header
          title="Create a New Trip"
          description="View and edit AI generated travel plans."
        />
        <section className="wrapper-md mt-5 bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Loading destination countries...
          </h3>
          <p className="text-yellow-700">
            Please wait a moment. If this persists, ensure your `countries.json`
            is correctly formatted.
          </p>
        </section>
      </main>
    );
  }

  // Main component rendering for the Create Trip page
  return (
    <main className="wrapper pb-20 flex flex-col gap-10">
      <Header
        title="Create a New Trip"
        description="View and edit AI generated travel plans."
      />
      <section className="wrapper-md mt-2.5">
        <form
          className="trip-form bg-white p-8 rounded-lg shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label
              htmlFor="country-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Destination Country
            </label>

            <Combobox
              id="country-select"
              // Map full country objects to the {value, label, flagUrl} format expected by Combobox.
              data={countries.map((c) => ({
                value: c.value,
                label: c.name,
                flagUrl: c?.flagUrl,
              }))}
              placeholder="Search and select a country..."
              value={selectedCountryValue}
              onValueChange={setSelectedCountryValue}
              className="max-w-xs" // Constrain Combobox width for better form layout
            />

            <p className="text-sm text-gray-500 mt-1">
              Choose from {countries.length} available countries to plan your
              next adventure.
            </p>
          </div>

          <button
            type="submit"
            // Button is disabled when submitting or no country is selected.
            disabled={isSubmitting || !selectedCountryValue}
            className={`mt-6 w-full px-6 py-3 font-semibold rounded-md shadow-md transition-colors duration-200 text-lg
              ${
                isSubmitting || !selectedCountryValue
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed" // Disabled state styles
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800" // Active state styles
              }`}
          >
            {isSubmitting ? "Creating Trip..." : "Create Trip"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateTrip;
