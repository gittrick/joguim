import { season9ChampionList } from "../../season9/season9Comp";
import ChampionProfileDisplay from "./ChampionProfileDisplay";
import UnitCountManager from "./UnitCountManager";

interface LayoutUnitAvailabilityProps {
  myUnitPool: any;
  setMyUnitPool: any;
  enemyUnitPool: any;
  setEnemyUnitPool: any;
}

function LayoutUnitAvailability({
  myUnitPool,
  setMyUnitPool,
  enemyUnitPool,
  setEnemyUnitPool,
}: LayoutUnitAvailabilityProps): JSX.Element {
  const rows: any[][] = [];

  // Group champions by cost
  for (let cost = 5; cost >= 1; cost--) {
    const championsWithCost = season9ChampionList.filter(
      (champion) => champion.cost === cost
    );
    rows.push(championsWithCost);
  }

  return (
    <div className="flex h-full flex-col border-r-2 border-lime-600">
      {rows.map((row, index) => (
        <div key={index} className="my-3 grid grid-cols-6 gap-2">
          {row.map((champion) => (
            <div key={champion.name} className="flex flex-row">
              <ChampionProfileDisplay
                champion={champion}
                count={true}
                myUnitPool={myUnitPool}
                setMyUnitPool={setMyUnitPool}
                enemyUnitPool={enemyUnitPool}
                displayType="LayoutUnitAvailability"
              />
              <UnitCountManager
                champion={champion}
                enemyUnitPool={enemyUnitPool}
                setEnemyUnitPool={setEnemyUnitPool}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LayoutUnitAvailability;
