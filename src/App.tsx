import { useEffect, useState } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { EarlyOptions } from "./type";
import BottomRightTools from "./components/Helper/BottomRightTools";
import LayoutUnitAvailability from "./components/UnitPanel/LayoutUnitAvailability";
import LayoutTeamComp from "./components/TeamCompPanel/LayoutTeamComp";
import "./App.css";

const App: React.FC = () => {
  const [clusterId, setClusterId] = useState<number | null>(null);
  const [teamCompIDS, setTeamCompIDS] = useState<number[]>([]);
  const [earlyTeamCompOptions, setEarlyTeamCompOptions] =
    useState<EarlyOptions>({
      4: [],
      5: [],
      6: [],
      7: [],
    });
  const [lateTeamCompOptions, setLateTeamCompOptions] = useState<EarlyOptions>({
    8: [],
    9: [],
    10: [],
  });

  const [myUnitPool, setMyUnitPool] = useState<String[]>([]);
  const [enemyUnitPool, setEnemyUnitPool] = useState<String[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api2.metatft.com/tft-comps-api/comps_data"
        );
        const { cluster_id, cluster_details } = response.data.results.data;
        setClusterId(cluster_id);

        const clusterArray = Object.values(cluster_details);
        const teamCompID = clusterArray.map((cluster: any) => cluster.Cluster);

        setTeamCompIDS(teamCompID);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchComps();
  }, [teamCompIDS, clusterId]);

  const fetchComps = async () => {
    if (teamCompIDS.length > 0 && clusterId) {
      try {
        const earlyOptions: EarlyOptions = {
          4: [],
          5: [],
          6: [],
          7: [],
        };

        const lateOptions: EarlyOptions = {
          8: [],
          9: [],
          10: [],
        };

        for (const compID of teamCompIDS) {
          const response = await axios.get(
            `https://api2.metatft.com/tft-comps-api/comp_details?comp=${compID}&cluster_id=${clusterId}`
          );
          const { results } = response.data;
          const earlyOptionsData = results?.early_options;

          if (earlyOptionsData) {
            earlyOptions[4].push(...(earlyOptionsData[4] || []));
            earlyOptions[5].push(...(earlyOptionsData[5] || []));
            earlyOptions[6].push(...(earlyOptionsData[6] || []));
            earlyOptions[7].push(...(earlyOptionsData[7] || []));
          }

          const lateOptionsData = results?.options;

          if (lateOptionsData) {
            lateOptions[8].push(...(lateOptionsData[8] || []));
            lateOptions[9].push(...(lateOptionsData[9] || []));
            lateOptions[10].push(...(lateOptionsData[10] || []));
          }
        }

        setEarlyTeamCompOptions(earlyOptions);
        setLateTeamCompOptions(lateOptions);
      } catch (error) {
        console.log("Error fetching early options:", error);
      }
    }
  };

  return (
    <div className="grid w-full grid-cols-2 justify-center p-2 text-center">
      <LayoutUnitAvailability
        myUnitPool={myUnitPool}
        setMyUnitPool={setMyUnitPool}
        enemyUnitPool={enemyUnitPool}
        setEnemyUnitPool={setEnemyUnitPool}
      />
      <DndProvider backend={HTML5Backend}>
        <LayoutTeamComp
          myUnitPool={myUnitPool}
          setMyUnitPool={setMyUnitPool}
          enemyUnitPool={enemyUnitPool}
          earlyTeamCompOptions={earlyTeamCompOptions}
          lateTeamCompOptions={lateTeamCompOptions}
        />{" "}
      </DndProvider>

      <BottomRightTools
        setMyUnitPool={setMyUnitPool}
        setEnemyUnitPool={setEnemyUnitPool}
      />
    </div>
  );
};

export default App;
