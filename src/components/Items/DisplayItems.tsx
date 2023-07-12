import { useEffect, useState } from "react";
import axios from "axios";
import { getImageUrl } from "../Helper/apiFetch";
import { formatString } from "../Helper/HelperFunctions";

interface Item {
  itemName: string;
  places: number[];
}

interface ProcessedItems {
  topNormalItems: Item[];
  topRadiantItems: Item[];
  topOrnnItems: Item[];
  topShimmerscaleItems: Item[];
  topEmblemItems: Item[];
}

interface DisplayItemsProps {
  name: string;
  championProfileImageURL: any;
}

const DisplayItems: React.FC<DisplayItemsProps> = ({
  name,
  championProfileImageURL,
}) => {
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get<{
          items: Item[];
        }>(
          `https://api2.metatft.com/tft-stat-api/unit_detail?unit=TFT9_${name}&queue=1100&patch=current&days=2&rank=CHALLENGER,DIAMOND,GRANDMASTER,MASTER&permit_filter_adjustment=true`
        );

        const { items } = response.data;
        const processedItems = processItems(items);
        setItemData(processedItems);
      } catch (error) {
        console.error("Failed to fetch item data:", error);
      }
    };

    fetchItemData();
  }, []);

  const [itemData, setItemData] = useState<ProcessedItems>({
    topNormalItems: [],
    topRadiantItems: [],
    topOrnnItems: [],
    topShimmerscaleItems: [],
    topEmblemItems: [],
  });

  const processItems = (items: Item[]): ProcessedItems => {
    const categorizedItems: Record<string, Item[]> = {
      Normal: [],
      Radiant: [],
      Ornn: [],
      Shimmerscale: [],
      Emblem: [],
    };

    items.forEach((item) => {
      const { itemName, places } = item;

      const category = itemName.includes("Radiant")
        ? "Radiant"
        : itemName.includes("Ornn")
        ? "Ornn"
        : itemName.includes("Shimmerscale")
        ? "Shimmerscale"
        : itemName.includes("Emblem")
        ? "Emblem"
        : "Normal";

      categorizedItems[category].push({ itemName, places });
    });

    const sortItemsByAverage = (items: Item[]) => {
      return items.sort((a, b) => {
        const avgA =
          a.places.reduce((sum, value) => sum + value, 0) / a.places.length;
        const avgB =
          b.places.reduce((sum, value) => sum + value, 0) / b.places.length;
        return avgB - avgA;
      });
    };

    const topNormalItems = sortItemsByAverage(categorizedItems.Normal).slice(
      0,
      5
    );
    const topRadiantItems = sortItemsByAverage(categorizedItems.Radiant).slice(
      0,
      5
    );
    const topOrnnItems = sortItemsByAverage(categorizedItems.Ornn).slice(0, 5);
    const topShimmerscaleItems = sortItemsByAverage(
      categorizedItems.Shimmerscale
    ).slice(0, 5);
    const topEmblemItems = sortItemsByAverage(categorizedItems.Emblem).slice(
      0,
      5
    );

    return {
      topNormalItems,
      topRadiantItems,
      topOrnnItems,
      topShimmerscaleItems,
      topEmblemItems,
    };
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4  sm:grid-cols-2">
      <div className="flex flex-col items-center justify-center">
        <img
          src={
            name !== ""
              ? championProfileImageURL(name)
              : "/icons/NoChampion.png"
          }
          alt={name}
          className="h-48 w-48 rounded-md object-cover sm:h-80 sm:w-80"
        />
        <h1 className="text-xl font-bold">{name}</h1>
      </div>
      <div className="flex flex-col">
        {Object.entries(itemData).map(([category, items]) => {
          if (items.length > 0) {
            let categoryName = "";

            switch (category) {
              case "topNormalItems":
                categoryName = "Top Normal";
                break;
              case "topRadiantItems":
                categoryName = "Top Radiant";
                break;
              case "topOrnnItems":
                categoryName = "Top Ornn";
                break;
              case "topShimmerscaleItems":
                categoryName = "Top Shimmerscale";
                break;
              case "topEmblemItems":
                categoryName = "Top Emblem";
                break;
              default:
                categoryName = category;
            }

            return (
              <div key={category} className="my-2 text-center">
                <h2 className="text-md mb-1 font-bold">
                  {categoryName} Item Choices
                </h2>
                <ul className="flex flex-row justify-center space-x-2 ">
                  {items.map((item: any, index: number) => (
                    <li key={index}>
                      <img
                        src={getImageUrl(item.itemName)}
                        alt={item.itemName}
                        className="h-8 w-8 2xl:h-10 2xl:w-10"
                        title={formatString(item.itemName, 9)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default DisplayItems;
