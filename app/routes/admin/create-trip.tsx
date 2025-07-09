import React, { useState } from "react";
import { Header } from "~/components";
import { Combobox } from "~/components/ui/combobox";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/create-trip";

interface CountryOption {
  value: string;
  label: string;
  flagUrl: string;
}

export const loader = async (): Promise<{ data: CountryOption[] }> => {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/images"
    );
    if (!response.ok) { 
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }
    const rawData = await response.json();
    const processedData: CountryOption[] = rawData.data.map((country: any) => ({
      value: country.iso2.toLowerCase(),
      label: country.name,
      flagUrl: country.flag,
    }));

    processedData.sort((a, b) => a.label.localeCompare(b.label));
    return { data: processedData };
  } catch (error) {
    console.error("Error fetching country data in loader:", error);
    return { data: [] };
  }
};

function CreateTrip({loaderData} : Route.ComponentProps) {
  const { data: countriesData } = useLoaderData() as { data: CountryOption[] };
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Selected Country Value:", selectedCountry);

    const fullCountryData = countriesData.find(
      (c) => c.value === selectedCountry
    );
    console.log("Selected Country Details:", fullCountryData);
  };

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Create a New Trip"
        description="View and edit AI generated travel plans."
      />

      <section className="mt-2.5 wrapper-md">
        <form
          className="trip-form bg-white p-8 rounded-lg shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <label
              htmlFor="country-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country
            </label>
            <Combobox
              id="country-select"
              data={countriesData}
              placeholder="Select a country..."
              value={selectedCountry}
              onValueChange={setSelectedCountry}
              className="max-w-xs"
            />
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            Create Trip
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateTrip;
