import { useState, useEffect } from "react";
import { Item, ItemCategory, ItemCategoryRow } from "../../type";
import { formatString } from "./HelperFunctions";
import { getImageUrl } from "./apiFetch";

interface Augment {
  augment: string;
  averagePlaces: number;
}

function ItemTierList() {
  const [itemCategoryRows, setItemCategoryRows] = useState<ItemCategoryRow[]>(
    []
  );
  const [augments, setAugments] = useState<ItemCategoryRow[]>([]);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const itemResponse = await fetch(
          "https://api2.metatft.com/tft-comps-api/unit_items"
        );
        const itemData = await itemResponse.json();
        const augmentResponse = await fetch(
          "https://api2.metatft.com/tft-stat-api/augments_full?queue=1100&patch=current&days=2&rank=CHALLENGER,DIAMOND,GRANDMASTER,MASTER&permit_filter_adjustment=true"
        );
        const augmentData = await augmentResponse.json();

        const normalItems: Item[] = [];
        const radiantItems: Item[] = [];
        const ornnItems: Item[] = [];
        const heimerUpgrade: Item[] = [];

        itemData.results.slice(0, 140).forEach((item: Item) => {
          if (
            item.hasOwnProperty("itemName") &&
            !item.itemName.includes("Emblem") &&
            !item.itemName.includes("Piltover")
          ) {
            if (item.itemName.includes("Radiant")) {
              radiantItems.push(item);
            } else if (item.itemName.includes("Ornn")) {
              ornnItems.push(item);
            } else if (item.itemName.includes("HeimerUpgrade")) {
              heimerUpgrade.push(item);
            } else {
              normalItems.push(item);
            }
          }
        });

        normalItems.sort((a, b) => b.place - a.place);
        normalItems.splice(-10); // Remove the unnecessary last 10 items
        radiantItems.sort((a, b) => b.place - a.place);
        ornnItems.sort((a, b) => b.place - a.place);

        const categoryRowsData: ItemCategoryRow[] = [
          {
            rowName: "Normal Items",
            categories: [
              {
                categoryName: "Good",
                items: normalItems.slice(0, Math.floor(normalItems.length / 3)),
              },
              {
                categoryName: "Normal",
                items: normalItems.slice(
                  Math.floor(normalItems.length / 3),
                  2 * Math.floor(normalItems.length / 3)
                ),
              },
              {
                categoryName: "Bad",
                items: normalItems.slice(
                  2 * Math.floor(normalItems.length / 3)
                ),
              },
              {
                categoryName: "Heimer Upgrade",
                items: heimerUpgrade,
              },
            ],
          },
          {
            rowName: "Radiant Items",
            categories: [
              {
                categoryName: "Good",
                items: radiantItems.slice(
                  0,
                  Math.floor(radiantItems.length / 3)
                ),
              },
              {
                categoryName: "Normal",
                items: radiantItems.slice(
                  Math.floor(radiantItems.length / 3),
                  2 * Math.floor(radiantItems.length / 3)
                ),
              },
              {
                categoryName: "Bad",
                items: radiantItems.slice(
                  2 * Math.floor(radiantItems.length / 3)
                ),
              },
            ],
          },
          {
            rowName: "Ornn Items",
            categories: [
              {
                categoryName: "Good",
                items: ornnItems.slice(0, Math.floor(ornnItems.length / 3)),
              },
              {
                categoryName: "Normal",
                items: ornnItems.slice(
                  Math.floor(ornnItems.length / 3),
                  2 * Math.floor(ornnItems.length / 3)
                ),
              },
              {
                categoryName: "Bad",
                items: ornnItems.slice(2 * Math.floor(ornnItems.length / 3)),
              },
            ],
          },
        ];

        setItemCategoryRows(categoryRowsData);

        const firstPickAugments: Augment[] = augmentData.results.first_pick;
        const secondPickAugments: Augment[] = augmentData.results.second_pick;
        const thirdPickAugments: Augment[] = augmentData.results.third_pick;

        //Pick best 5 for each round
        const calculateAveragePlaces = (places: any): number => {
          const sum = places.places.reduce(
            (acc: any, curr: any) => acc + curr,
            0
          );
          return sum / places.places.length;
        };

        const top10FirstPickAugments = firstPickAugments
          .sort((a, b) => calculateAveragePlaces(b) - calculateAveragePlaces(a))
          .slice(0, 5);

        const top10SecondPickAugments = secondPickAugments
          .sort((a, b) => calculateAveragePlaces(b) - calculateAveragePlaces(a))
          .slice(0, 5);

        const top10ThirdPickAugments = thirdPickAugments
          .sort((a, b) => calculateAveragePlaces(b) - calculateAveragePlaces(a))
          .slice(0, 5);

        const augmentCategoryRowsData: ItemCategoryRow[] = [
          {
            rowName: "Augments",
            categories: [
              {
                categoryName: "First Augment",
                items: top10FirstPickAugments.map((augment) => ({
                  itemName: augment.augment,
                  place: calculateAveragePlaces(augment),
                  count: 0, // Add a count property here
                })),
              },
              {
                categoryName: "Second Augment",
                items: top10SecondPickAugments.map((augment) => ({
                  itemName: augment.augment,
                  place: calculateAveragePlaces(augment),
                  count: 0, // Add a count property here
                })),
              },
              {
                categoryName: "Third Augment",
                items: top10ThirdPickAugments.map((augment) => ({
                  itemName: augment.augment,
                  place: calculateAveragePlaces(augment),
                  count: 0, // Add a count property here
                })),
              },
            ],
          },
        ];

        setAugments(augmentCategoryRowsData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchItemData();
  }, []);

  return (
    <div className="text-md grid h-[300] w-full grid-cols-4 py-6 2xl:text-xl">
      {itemCategoryRows.map((row: ItemCategoryRow) => (
        <div
          key={row.rowName}
          className={` border-4 p-4 font-black  ${
            row.rowName === "Radiant Items"
              ? "border-yellow-300 bg-orange-500 text-yellow-300"
              : row.rowName === "Ornn Items"
              ? "border-red-400 bg-blue-950 text-red-400"
              : "border-black bg-gray-500 text-white"
          }`}
        >
          <h2 className="mb-8 underline">{row.rowName}</h2>
          {row.categories.map((category: ItemCategory) => (
            <div key={category.categoryName}>
              <h3 className=" flex justify-start pl-2 underline ">
                {category.categoryName}
              </h3>
              <ul className="grid grid-cols-6">
                {category.items.map((item: Item) => (
                  <li key={item.itemName} className="p-2">
                    <img
                      src={getImageUrl(item.itemName)}
                      alt={item.itemName}
                      className="h-6 w-6 2xl:h-10 2xl:w-10"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      {augments.map((row: ItemCategoryRow) => (
        <div
          key={row.rowName}
          className={`flex flex-col justify-start border-4 border-purple-200 bg-purple-500 p-4 font-black text-violet-100
          `}
        >
          <h2 className="mb-4 underline 2xl:mb-8">{row.rowName}</h2>
          {row.categories.map((category: ItemCategory) => (
            <div className=" pl-2" key={category.categoryName}>
              <h3 className=" flex justify-start underline">
                {category.categoryName} Used
              </h3>
              <ul className="flex flex-col justify-start">
                {category.items.map((item: Item) => (
                  <li
                    key={item.itemName}
                    className="justify-start py-1 text-left text-xs text-purple-800 2xl:p-2 2xl:text-sm"
                  >
                    {formatString(item.itemName, 13)} - {item.place.toFixed(0)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ItemTierList;
