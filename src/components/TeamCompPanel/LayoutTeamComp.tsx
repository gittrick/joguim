import { useState, useEffect } from "react";
import { EarlyOptions, TeamComp } from "../../type";
import MyChampPool from "./MyChampPool";
import TeamCompDisplay from "./TeamCompDisplay";
import { extraUnitList } from "../../season9/season9Comp";
import {
  getNonFilteredTeamComps,
  getFilteredTeamComps,
  getMatchedChamps,
  filterByEnemyPool,
} from "../Helper/filterComp";

interface LayoutTeamCompProps {
  myUnitPool: any;
  setMyUnitPool: any;
  enemyUnitPool: any;
  earlyTeamCompOptions: EarlyOptions;
  lateTeamCompOptions: EarlyOptions;
}

const LayoutTeamComp: React.FC<LayoutTeamCompProps> = ({
  myUnitPool,
  setMyUnitPool,
  enemyUnitPool,
  earlyTeamCompOptions,
  lateTeamCompOptions,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const [selectedFilteredEarlyComps, setSelectedFilteredEarlyComps] = useState<
    TeamComp[]
  >([]);
  const [selectedFilteredLateComps, setSelectedFilteredLateComps] = useState<
    TeamComp[]
  >([]);
  const [selectedFilteredEarlyExtraComps, setSelectedFilteredEarlyExtraComps] =
    useState<TeamComp[]>([]);
  const [selectedFilteredLateExtraComps, setSelectedFilteredLateExtraComps] =
    useState<TeamComp[]>([]);
  const [nonFilteredEarlyComps, setNonFilteredEarlyComps] = useState<
    TeamComp[]
  >([]);
  const [nonFilteredLateComps, setNonFilteredLateComps] = useState<TeamComp[]>(
    []
  );

  const [myCompWinRate, setMyCompWinRate] = useState<any>();

  useEffect(() => {
    handleUnitSuggestion();

    const winRate =
      selectedLevel <= 7
        ? matchedEarlyOptions[0]?.win
        : matchedLateOptions[0]?.avg;

    setMyCompWinRate(winRate);
  }, [
    myUnitPool,
    enemyUnitPool,
    earlyTeamCompOptions,
    lateTeamCompOptions,
    selectedLevel,
  ]);

  const handleLevelToggle = (level: number) => {
    setSelectedLevel(level);
    handleUnitSuggestion();
  };

  const handleUnitSuggestion = () => {
    setNonFilteredEarlyComps(
      nonFilteredEarlyOptions.filter((comp: any) => {
        const shouldFilter = filterByEnemyPool(
          true,
          comp,
          enemyUnitPool,
          selectedLevel
        );

        return shouldFilter;
      })
    );

    setNonFilteredLateComps(
      nonFilteredLateOptions.filter((comp: any) => {
        const shouldFilter = filterByEnemyPool(
          false,
          comp,
          enemyUnitPool,
          selectedLevel
        );

        return shouldFilter;
      })
    );

    setSelectedFilteredEarlyComps(
      FilteredEarlyOptions.filter((comp: any) => {
        const shouldFilter = filterByEnemyPool(
          true,
          comp,
          enemyUnitPool,
          selectedLevel
        );

        return shouldFilter;
      })
    );

    setSelectedFilteredLateComps(
      FilteredLateOptions.filter((comp: any) => {
        const shouldFilter = filterByEnemyPool(
          false,
          comp,
          enemyUnitPool,
          selectedLevel
        );

        return shouldFilter;
      })
    );

    setSelectedFilteredEarlyExtraComps(
      FilteredEarlyExtraOptions.filter((comp: any) => {
        const shouldFilter = filterByEnemyPool(
          true,
          comp,
          enemyUnitPool,
          selectedLevel
        );

        return shouldFilter;
      })
    );

    setSelectedFilteredLateExtraComps(
      FilteredLateExtraOptions.filter((comp: any) => {
        const shouldFilter = filterByEnemyPool(
          false,
          comp,
          enemyUnitPool,
          selectedLevel
        );

        return shouldFilter;
      })
    );
  };

  const nonFilteredEarlyOptions = getNonFilteredTeamComps(
    earlyTeamCompOptions,
    "unit_list"
  );
  const nonFilteredLateOptions = getNonFilteredTeamComps(
    lateTeamCompOptions,
    "units_list"
  );

  const matchedEarlyOptions = getMatchedChamps(
    earlyTeamCompOptions,
    myUnitPool,
    extraUnitList,
    "unit_list"
  );

  const matchedLateOptions = getMatchedChamps(
    lateTeamCompOptions,
    myUnitPool,
    extraUnitList,
    "units_list"
  );

  const FilteredEarlyOptions = getFilteredTeamComps(
    earlyTeamCompOptions,
    myUnitPool,
    "unit_list",
    selectedLevel - 2
  );

  const FilteredEarlyExtraOptions = getFilteredTeamComps(
    earlyTeamCompOptions,
    myUnitPool,
    "unit_list",
    2
  );

  const FilteredLateOptions = getFilteredTeamComps(
    lateTeamCompOptions,
    myUnitPool,
    "units_list",
    selectedLevel - 3
  );

  const FilteredLateExtraOptions = getFilteredTeamComps(
    lateTeamCompOptions,
    myUnitPool,
    "units_list",
    3
  );

  return (
    <div>
      <MyChampPool
        myUnitPool={myUnitPool}
        setMyUnitPool={setMyUnitPool}
        winRate={myCompWinRate}
        compLevel={selectedLevel}
      />
      <div className="grid grid-cols-12 items-center font-bold">
        <div className="col-span-2 flex"></div>
        <div className="col-span-10 flex justify-start space-x-2 ">
          {[5, 6, 7, 8, 9, 10].map((level: number) => (
            <button
              key={level}
              className={`rounded-xl border-2 border-green-500 px-4 py-2 hover:bg-emerald-500 ${
                selectedLevel === level ? "bg-emerald-500" : "bg-green-200"
              }`}
              onClick={() => handleLevelToggle(level)}
            >
              Lv{level}
            </button>
          ))}
        </div>
      </div>
      <div className=" flex flex-col justify-center p-2">
        <div className="flex w-full flex-col">
          {selectedLevel <= 7 ? (
            <TeamCompDisplay
              nonFilteredTeamComps={nonFilteredEarlyComps}
              filteredTeamComps={selectedFilteredEarlyComps}
              filteredExtraTeamComps={selectedFilteredEarlyExtraComps}
              lowLevel={true}
              compLevel={selectedLevel}
              myUnitPool={myUnitPool}
            />
          ) : (
            <TeamCompDisplay
              nonFilteredTeamComps={nonFilteredLateComps}
              filteredTeamComps={selectedFilteredLateComps}
              filteredExtraTeamComps={selectedFilteredLateExtraComps}
              lowLevel={false}
              compLevel={selectedLevel}
              myUnitPool={myUnitPool}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutTeamComp;
