import { useEffect, useState } from "react";
import { AugmentData, AugmentUnit } from "../../type";

function AugmentTierList() {
  const [augmentUnits, setAugmentUnits] = useState<AugmentData[]>([]);

  useEffect(() => {
    const fetchAugmentUnits = async () => {
      try {
        const response = await fetch(
          "https://api2.metatft.com/tft-stat-api/augment_units"
        );
        const responseData: { results: AugmentData[] } = await response.json();
        const data: AugmentData[] = responseData.results.slice(0, 400);
        setAugmentUnits(data);
      } catch (error) {
        console.error("Error fetching augment units:", error);
      }
    };

    fetchAugmentUnits();
  }, []);

  const getTopAugments = (data: AugmentData[]): AugmentUnit[] => {
    const augmentMap: { [key: string]: string[] } = {};

    data.forEach((item) => {
      if (augmentMap[item.augment]) {
        augmentMap[item.augment].push(item.unit);
      } else {
        augmentMap[item.augment] = [item.unit];
      }
    });

    const augmentUnits: AugmentUnit[] = Object.entries(augmentMap).map(
      ([augment, units]) => {
        const avgPlace =
          units
            .map(
              (unit) =>
                data.find((item) => item.unit === unit)?.places.avg_place || 0
            )
            .reduce((sum, avgPlace) => sum + avgPlace, 0) / units.length;

        return { augment, units, avgPlace };
      }
    );

    augmentUnits.sort((a, b) => a.avgPlace - b.avgPlace);

    return augmentUnits.slice(0, 20);
  };

  const topAugments = getTopAugments(augmentUnits);

  const getImageUrl = (itemName: string) => {
    return `https://cdn.metatft.com/file/metatft/champions/${itemName.toLowerCase()}.png`;
  };

  function transformAugmentName(augment: string): string {
    // Remove 'TFT9_' from the beginning
    let transformedName = augment.replace("TFT9_Augment_", "");

    // Replace '_' with space
    transformedName = transformedName.replace(/_/g, " ");

    // Insert space before capital letters after small case
    transformedName = transformedName.replace(/([a-z])([A-Z])/g, "$1 $2");

    transformedName = transformedName.replace(/(\d+)$/, " $1");

    return transformedName;
  }

  return (
    <div className="ml-4 h-full w-2/6 border-4 border-red-500 bg-amber-950 p-4">
      <h1 className="mb-8 text-3xl font-black text-red-300 underline">
        Top Augments
      </h1>
      <ul>
        {topAugments.map(
          (augment, index) =>
            augment.units.length > 5 && (
              <li key={index} className="text-2xl text-white ">
                <div className="mb-2">
                  <strong>Augment:</strong>{" "}
                  {transformAugmentName(augment.augment)}
                </div>
                <div className="grid grid-cols-5 2xl:grid-cols-9">
                  {augment.units.slice(0, 9).map((championUrl) => (
                    <img
                      key={championUrl}
                      src={getImageUrl(championUrl)}
                      className="h-12 w-12"
                    />
                  ))}
                </div>
                <br />
                {/* <strong>Average Place:</strong> {augment.avgPlace} */}
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default AugmentTierList;
