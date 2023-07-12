import { useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { renderFilteredComps } from "../Helper/filterComp";

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

interface TeamCompDisplayProps {
  nonFilteredTeamComps: any;
  filteredTeamComps: any;
  filteredExtraTeamComps: any;
  lowLevel: boolean;
  compLevel: number;
  myUnitPool: any;
}

const TeamCompDisplay: React.FC<TeamCompDisplayProps> = ({
  nonFilteredTeamComps,
  filteredTeamComps,
  filteredExtraTeamComps,
  lowLevel,
  compLevel,
  myUnitPool,
}) => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Best Level " + compLevel + " comp that fits your pool",
    },
    {
      key: "2",
      label: "Best Level " + compLevel + " comp in general",
    },
  ];

  const [cardSelected, setCardSelected] = useState(0);
  return (
    <div>
      <div className="grid grid-cols-12 items-center font-bold">
        <div className="col-span-2 mb-4 text-lg 2xl:text-2xl"></div>
        <div className="col-span-10 flex justify-start">
          <Tabs
            items={items}
            activeKey={activeKey}
            onChange={handleTabChange}
            className="custom-tabs"
            size="large"
          />
        </div>
      </div>
      {activeKey === "1" ? (
        // Page 1 content
        filteredTeamComps.length > 0 ? (
          renderFilteredComps(
            filteredTeamComps,
            filteredExtraTeamComps,
            lowLevel,
            compLevel,
            myUnitPool,
            cardSelected,
            setCardSelected
          )
        ) : (
          <div className="text-md grid grid-cols-12 py-2 font-bold 2xl:text-xl">
            <div className="col-span-2">?</div>
            <div className="col-span-10 flex flex-col ">
              <div className="text-start">
                Sorry, either no data is available or
              </div>
              <div className="text-start">
                You must select more champions to your pool
              </div>
            </div>
          </div>
        )
      ) : // Page 2 content
      nonFilteredTeamComps.length > 0 ? (
        renderFilteredComps(
          nonFilteredTeamComps,
          filteredExtraTeamComps,
          lowLevel,
          compLevel,
          myUnitPool,
          cardSelected,
          setCardSelected
        )
      ) : (
        <div className="text-md grid grid-cols-12 py-2 font-bold 2xl:text-xl">
          <div className="col-span-2">?</div>
          <div className="col-span-10 flex justify-start">
            Sorry, no data is available
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCompDisplay;
