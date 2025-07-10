import React, { useState } from "react";
import { Header } from "~/components";
import { Combobox } from "~/components/ui/combobox";
import { useLoaderData } from "react-router";

// ====================== INTERFACES ======================

interface Country {
  name: string;
  coordinates: [number, number];
  value: string;
  flagUrl: string;
  openStreetMap?: string;
}

// API Response Types
interface FlagApiResponse {
  error: boolean;
  msg: string;
  data: FlagData[];
}

interface PositionApiResponse {
  error: boolean;
  msg: string;
  data: PositionData[];
}

interface FlagData {
  name: string;
  flag: string;
  iso2: string;
  iso3?: string;
}

interface PositionData {
  name: string;
  iso2: string;
  lat: number;
  long: number;
}

// ====================== HELPER FUNCTIONS ======================

const isValidString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

const createOpenStreetMapUrl = (lat: number, lon: number): string => {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=5/${lat}/${lon}`;
};

// ====================== LOADER FUNCTION ======================

export const loader = async (): Promise<Country[]> => {
  try {
    console.log('🚀 Starting to fetch country data...');

    // Fetch flags data
    const flagsResponse = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");
    if (!flagsResponse.ok) {
      throw new Error(`Flags API failed: ${flagsResponse.status}`);
    }
    const flagsData: FlagApiResponse = await flagsResponse.json();

    // Fetch positions data
    const positionsResponse = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
    if (!positionsResponse.ok) {
      throw new Error(`Positions API failed: ${positionsResponse.status}`);
    }
    const positionsData: PositionApiResponse = await positionsResponse.json();

    console.log(`📊 Flags data length: ${flagsData.data?.length || 0}`);
    console.log(`📊 Positions data length: ${positionsData.data?.length || 0}`);

    // Debug: Check actual data structure
    if (flagsData.data && flagsData.data.length > 0) {
      console.log('🔍 Sample flag data:', flagsData.data[0]);
    }
    if (positionsData.data && positionsData.data.length > 0) {
      console.log('🔍 Sample position data:', positionsData.data[0]);
    }

    // Check if we have valid data
    if (!flagsData.data || !Array.isArray(flagsData.data)) {
      throw new Error('Invalid flags data structure');
    }

    if (!positionsData.data || !Array.isArray(positionsData.data)) {
      throw new Error('Invalid positions data structure');
    }

    // Create a map to combine data
    const countryMap = new Map<string, Country>();

    // Process flags first
    flagsData.data.forEach((flagItem: any) => {
      if (
        flagItem &&
        isValidString(flagItem.name) &&
        isValidString(flagItem.flag) &&
        isValidString(flagItem.iso2)
      ) {
        const isoCode = flagItem.iso2.toLowerCase();
        countryMap.set(isoCode, {
          name: flagItem.name.trim(),
          coordinates: [0, 0],
          value: isoCode,
          flagUrl: flagItem.flag,
          openStreetMap: undefined,
        });
      }
    });

    console.log(`✅ Processed ${countryMap.size} countries with flags`);

    // Debug: Show first few countries in map
    const firstFewCountries = Array.from(countryMap.entries()).slice(0, 5);
    console.log('🔍 First few countries in map:', firstFewCountries);

    // Add coordinates - with debugging
    let matchedCount = 0;
    positionsData.data.forEach((positionItem: any) => {
      if (
        positionItem &&
        isValidString(positionItem.iso2) &&
        isValidNumber(positionItem.lat) &&
        isValidNumber(positionItem.long)
      ) {
        const isoCode = positionItem.iso2.toLowerCase();
        const existingCountry = countryMap.get(isoCode);
        
        if (existingCountry) {
          existingCountry.coordinates = [positionItem.lat, positionItem.long];
          existingCountry.openStreetMap = createOpenStreetMapUrl(
            positionItem.lat,
            positionItem.long
          );
          matchedCount++;
        } else {
          // Debug: log first 10 unmatched countries
          if (matchedCount < 10) {
            console.log(`🔍 No match found for ISO: ${isoCode} (${positionItem.name})`);
          }
        }
      }
    });
    
    console.log(`✅ Successfully matched ${matchedCount} countries with coordinates`);

    // Convert to array and filter out countries without coordinates
    const allCountries = Array.from(countryMap.values());
    const countriesWithCoordinates = allCountries.filter((country) => {
      const [lat, lon] = country.coordinates;
      return lat !== 0 || lon !== 0;
    });
    
    console.log(`📊 Countries with flags: ${allCountries.length}`);
    console.log(`📊 Countries with coordinates: ${countriesWithCoordinates.length}`);
    
    // If still no coordinates, try name-based matching
    if (countriesWithCoordinates.length === 0) {
      console.log('🔧 Trying name-based matching...');
      
      positionsData.data.forEach((positionItem: any) => {
        if (
          positionItem &&
          isValidString(positionItem.name) &&
          isValidNumber(positionItem.lat) &&
          isValidNumber(positionItem.long)
        ) {
          // Find country by name similarity
          const foundCountry = allCountries.find(country => {
            const countryName = country.name.toLowerCase();
            const positionName = positionItem.name.toLowerCase();
            return countryName === positionName || 
                   countryName.includes(positionName) ||
                   positionName.includes(countryName);
          });
          
          if (foundCountry && foundCountry.coordinates[0] === 0 && foundCountry.coordinates[1] === 0) {
            foundCountry.coordinates = [positionItem.lat, positionItem.long];
            foundCountry.openStreetMap = createOpenStreetMapUrl(
              positionItem.lat,
              positionItem.long
            );
          }
        }
      });
      
      // Re-count after name matching
      const finalWithCoordinates = allCountries.filter((country) => {
        const [lat, lon] = country.coordinates;
        return lat !== 0 || lon !== 0;
      });
      
      console.log(`✅ After name matching: ${finalWithCoordinates.length} countries`);
      
      const countries: Country[] = finalWithCoordinates.sort((a, b) => a.name.localeCompare(b.name));
      return countries;
    }
    
    const countries: Country[] = countriesWithCoordinates.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`✅ Final result: ${countries.length} countries with coordinates`);

    return countries;

  } catch (error) {
    console.error('❌ Error in loader:', error);
    return [];
  }
};

// ====================== COMPONENT ======================

function CreateTrip() {
  const countries = useLoaderData() as Country[];
  const [selectedCountryValue, setSelectedCountryValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🎯 Form submitted!');
      console.log('Selected Country Value:', selectedCountryValue);

      if (!selectedCountryValue) {
        alert('Please select a country first');
        return;
      }

      // Find the selected country
      const selectedCountry = countries.find(
        (country) => country.value === selectedCountryValue
      );

      if (selectedCountry) {
        console.log('📍 Selected Country Details:', {
          name: selectedCountry.name,
          coordinates: selectedCountry.coordinates,
          value: selectedCountry.value,
          flagUrl: selectedCountry.flagUrl,
          openStreetMap: selectedCountry.openStreetMap,
        });

        // Here you can proceed with trip creation
        alert(`Trip creation started for ${selectedCountry.name}!`);
      } else {
        console.error('Selected country not found');
        alert('Selected country data not found');
      }

    } catch (error) {
      console.error('❌ Error in form submission:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading/error state if no countries
  if (!countries || countries.length === 0) {
    return (
      <main className="flex flex-col gap-10 pb-20 wrapper">
        <Header
          title="Create a New Trip"
          description="View and edit AI generated travel plans."
        />
        <section className="mt-2.5 wrapper-md">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Loading Countries...
            </h3>
            <p className="text-yellow-700">
              Please wait while we load country data. If this takes too long, please refresh the page.
            </p>
          </div>
        </section>
      </main>
    );
  }

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
              Select Destination Country
            </label>
            <Combobox
              id="country-select"
              data={countries.map((country) => ({
                value: country.value,
                label: country.name,
                flagUrl: country.flagUrl,
              }))}
              placeholder="Search and select a country..."
              value={selectedCountryValue}
              onValueChange={setSelectedCountryValue}
              className="max-w-xs"
            />
            <p className="text-sm text-gray-500 mt-1">
              Choose from {countries.length} available countries
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedCountryValue}
            className={`
              mt-6 px-6 py-3 font-semibold rounded-md shadow-md transition-colors duration-200
              ${isSubmitting || !selectedCountryValue
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateTrip;