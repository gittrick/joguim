import { extraUnitList } from "../../season9/season9Comp";
import { season9ChampionList } from "../../season9/season9Comp";
import ChampionProfileDisplay from "../UnitPanel/ChampionProfileDisplay";
import { getWinRateColor } from "../Helper/HelperFunctions";

const getMatchingComps = (
  teamCompOptions: any,
  key: string,
  condition: (unitList: string[]) => boolean
) => {
  return Object.keys(teamCompOptions).reduce((result: any[], property: any) => {
    const teamComps = teamCompOptions[property];
    const matchingComps = teamComps.filter((teamComp: any) => {
      const unitList = teamComp[key]?.split("&") || [];
      return condition(unitList);
    });

    if (matchingComps.length > 0) {
      return [...result, ...matchingComps];
    }
    return result;
  }, []);
};

export const getNonFilteredTeamComps = (teamCompOptions: any, key: string) => {
  return getMatchingComps(
    teamCompOptions,
    key,
    (unitList: string[]) => unitList.length > 0
  );
};

export const getFilteredTeamComps = (
  teamCompOptions: any,
  myUnitPool: any,
  key: string,
  minUniqueMatchingUnits: number
) => {
  return getMatchingComps(teamCompOptions, key, (unitList: string[]) => {
    const matchingUnits = unitList
      .map((unit: string) => unit.split("_")[1])
      .filter((unit: string) => myUnitPool.includes(unit));
    const uniqueMatchingUnits = Array.from(new Set(matchingUnits));
    return uniqueMatchingUnits.length >= minUniqueMatchingUnits;
  });
};

export const getMatchedChamps = (
  teamCompOptions: any,
  myUnitPool: any,
  extraUnitList: string[],
  key: string
) => {
  return getMatchingComps(teamCompOptions, key, (unitList: string[]) => {
    const filteredUnitList = unitList
      .filter((unit: string) => !extraUnitList.includes(unit))
      .map((unit: string) => unit.split("_")[1]);
    return filteredUnitList.sort().toString() === myUnitPool.sort().toString();
  });
};

export const filterByEnemyPool = (
  lowComp: boolean,
  comp: any,
  enemyUnitPool: string[],
  selectedLevel: number
) => {
  const unitList = lowComp
    ? comp.unit_list.split("&")
    : comp.units_list.split("&");

  const filteredEnemyUnitPool = enemyUnitPool.reduce((acc: any, unit: any) => {
    const champCount = enemyUnitPool.filter((x: any) => x === unit).length;
    if (champCount >= 1 && !acc.includes(unit)) {
      acc.push(unit);
    }
    return acc;
  }, []);

  const shouldFilter = unitList.some((unit: any) =>
    filteredEnemyUnitPool.some((enemyUnit: string) => {
      return unit.includes(enemyUnit);
    })
  );

  return (
    !shouldFilter &&
    unitList.length === selectedLevel &&
    (lowComp
      ? Math.floor(comp.level) === selectedLevel
      : comp.num_units === selectedLevel)
  );
};

export const filterByCorrectLevelPlayedWinrate = (
  comps: any[],
  lowLevel: boolean
) =>
  comps
    .filter(
      (comp: any, index: number, self: any[]) =>
        index ===
        self.findIndex(
          (c: any) =>
            (lowLevel ? c.unit_list : c.units_list) ===
            (lowLevel ? comp.unit_list : comp.units_list)
        )
    )
    .filter((comp: any) => comp.count >= 20) // must be played more than 20 times
    .filter((comp: any) =>
      lowLevel ? comp.win > 0.55 : 1 - comp.avg / 8 > 0.55
    ) //filter by win rate more than 55%
    .sort((a: any, b: any) => (lowLevel ? b.win - a.win : a.avg - b.avg))
    .slice(0, 10);

const getMismatchCounts = (
  filteredComps: any[],
  myUnitPool: any[],
  lowLevel: boolean
) => {
  return filteredComps.map((comp: any) => {
    const unitList = lowLevel
      ? comp.unit_list.split("&").map((unit: any) => unit.split("_")[1])
      : comp.units_list.split("&").map((unit: any) => unit.split("_")[1]);
    let difference = unitList.filter((x: any) => !myUnitPool.includes(x));
    return difference.length;
  });
};

export const renderFilteredComps = (
  comps: any[],
  extraComps: any[],
  lowLevel: boolean,
  compLevel: number,
  myUnitPool: any,
  cardSelected: any,
  setCardSelected: React.Dispatch<React.SetStateAction<number>>
) => {
  console.log("#" + cardSelected + " Card Has been selected");

  const filteredComps = filterByCorrectLevelPlayedWinrate(comps, lowLevel);
  const extraFilteredComps = filterByCorrectLevelPlayedWinrate(
    extraComps,
    lowLevel
  );
  const mergedComps = Array.from(
    new Set([...filteredComps, ...extraFilteredComps])
  );
  const finalComps = mergedComps.slice(0, 10); // Reduce merged one to first 10

  const mismatchCounts = getMismatchCounts(
    filterByCorrectLevelPlayedWinrate(finalComps, lowLevel),
    myUnitPool,
    lowLevel
  );
  const sortedCounts = [...new Set([...mismatchCounts].sort((a, b) => a - b))];
  const firstIndex = mismatchCounts.indexOf(sortedCounts[0]);
  const secondIndex = mismatchCounts.indexOf(sortedCounts[1]);
  const thirdIndex = mismatchCounts.indexOf(sortedCounts[2]);

  return filterByCorrectLevelPlayedWinrate(finalComps, lowLevel).map(
    (comp: any, index: number) => {
      const unitList = lowLevel
        ? comp.unit_list.split("&")
        : comp.units_list.split("&");

      const championNames = unitList.map((champion: string) =>
        champion.slice(5)
      );

      const filteredChampionNames = championNames.filter(
        (championName: string) =>
          !extraUnitList.includes(championName.toLowerCase())
      );

      filteredChampionNames.sort((a: string, b: string) => {
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
      });

      const mostPossibleComp = index === firstIndex;
      const secondMostPossibleComp = index === secondIndex;
      const thirdMostPossibleComp = index === thirdIndex;

      let bestTeamCompBGColorClass = "";
      if (mostPossibleComp) {
        bestTeamCompBGColorClass = "bg-fuchsia-300 border-2 border-fuchsia-600";
      } else if (secondMostPossibleComp) {
        bestTeamCompBGColorClass = "bg-pink-300 border-2 border-pink-600";
      } else if (thirdMostPossibleComp) {
        bestTeamCompBGColorClass = "bg-cyan-300 border-2 border-cyan-600";
      }

      let bestTeamCompTextColorClass = "";
      if (mostPossibleComp) {
        bestTeamCompTextColorClass = "text-fuchsia-600";
      } else if (secondMostPossibleComp) {
        bestTeamCompTextColorClass = "text-pink-600";
      } else if (thirdMostPossibleComp) {
        bestTeamCompTextColorClass = "text-cyan-600";
      }

      return (
        filteredChampionNames.length === compLevel && (
          <div
            key={index}
            className={`grid grid-cols-12 rounded-3xl ${bestTeamCompBGColorClass}`}
            onClick={() => setCardSelected(index)}
          >
            <div
              className={`col-span-2 flex items-center justify-center text-lg font-bold 2xl:text-2xl ${getWinRateColor(
                lowLevel ? comp.win : 1 - comp.avg / 8
              )}`}
            >
              <div className="flex flex-col">
                <div className={`${bestTeamCompTextColorClass}`}>
                  {mostPossibleComp && "Best"}
                  {secondMostPossibleComp && "Preferred"}
                  {thirdMostPossibleComp && "Optimal"}
                </div>
                <div>
                  {lowLevel
                    ? `${(comp.win * 100).toFixed(2)}%`
                    : `${((1 - comp.avg / 8) * 100).toFixed(2)}%`}
                </div>
              </div>
            </div>
            <div className="col-span-10 flex flex-row space-x-1">
              {filteredChampionNames.map(
                (championName: string, subIndex: number) => (
                  <div className="my-2" key={`${index}-${subIndex}`}>
                    <ChampionProfileDisplay
                      champion={{ name: championName }}
                      count={false}
                      myUnitPool={myUnitPool}
                      setMyUnitPool={null}
                      enemyUnitPool={null}
                      displayType="TeamCompDisplay"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )
      );
    }
  );
};
