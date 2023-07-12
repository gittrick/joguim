import React from "react";
import ChampionProfileDisplay from "../UnitPanel/ChampionProfileDisplay";
import { season9ChampionList } from "../../season9/season9Comp";
import { getWinRateColor } from "../Helper/HelperFunctions";

interface MyChampPoolProps {
  myUnitPool: any;
  setMyUnitPool: any;
  winRate: number;
  compLevel: number;
}

const MyChampPool: React.FC<MyChampPoolProps> = ({
  myUnitPool,
  setMyUnitPool,
  winRate,
  compLevel,
}) => {
  const handleRemoveChampion = (championName: string) => {
    setMyUnitPool((prevUnitPool: any) => {
      const indexOfChampion = prevUnitPool.indexOf(championName);
      if (indexOfChampion !== -1) {
        const updatedUnitPool = [...prevUnitPool];
        updatedUnitPool.splice(indexOfChampion, 1);
        return updatedUnitPool;
      }
      return prevUnitPool;
    });
  };
  return (
    <div>
      <div className="mb-2 grid grid-cols-12 items-center font-bold">
        <div className="col-span-2 flex items-center justify-center text-lg underline 2xl:text-2xl">
          Win Rate
        </div>
        <div className="col-span-10 flex items-center justify-start text-lg underline 2xl:text-2xl">
          Champions In Your Lv {myUnitPool.length} Pool
        </div>
      </div>
      <div className="grid grid-cols-12 items-center py-2">
        <div
          className={`col-span-2 text-lg font-bold 2xl:text-2xl ${getWinRateColor(
            winRate
          )}`}
        >
          {compLevel <= 7
            ? winRate
              ? `${(winRate * 100).toFixed(2)}%`
              : "? %"
            : winRate
            ? `${((1 - winRate / 8) * 100).toFixed(2)}%`
            : "? %"}
        </div>
        <div className="col-span-10 flex flex-row space-x-1">
          {[...Array(10)]
            .map((_, index) => {
              const championName = myUnitPool[index] || "";
              return championName;
            })
            .sort((a, b) => {
              const championA = season9ChampionList.find(
                (champion) => champion.name === a
              );
              const championB = season9ChampionList.find(
                (champion) => champion.name === b
              );

              if (championA && championB) {
                return championA.cost - championB.cost;
              }

              return 0;
            })
            .map((championName, index) => (
              <div
                key={index}
                onClick={() => handleRemoveChampion(championName)}
                className="clickable-wrapper"
              >
                <ChampionProfileDisplay
                  champion={{ name: championName }}
                  count={false}
                  myUnitPool={null}
                  setMyUnitPool={null}
                  enemyUnitPool={null}
                  displayType="MyChampPool"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyChampPool;
