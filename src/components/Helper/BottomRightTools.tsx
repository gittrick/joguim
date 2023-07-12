import { useState } from "react";
import ItemTierList from "./ItemTierList";
import { Modal } from "antd";

interface BottomRightToolsProps {
  setMyUnitPool: any;
  setEnemyUnitPool: any;
}

const BottomRightTools: React.FC<BottomRightToolsProps> = ({
  setMyUnitPool,
  setEnemyUnitPool,
}) => {
  const resetPool = () => {
    setMyUnitPool([]);
    setEnemyUnitPool([]);
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="flex items-center">
      <div className="fixed bottom-4 right-20">
        <img
          onClick={resetPool}
          src="/icons/ResetIcon.png"
          className="mb-1 h-14 w-14 hover:scale-[1.1]"
          alt="Reset Icon"
          title="Reset All Choices"
        />
      </div>
      <div className="fixed bottom-4 right-4">
        <img
          onClick={() => setModalVisible(true)}
          src="/icons/HelperIcon.png"
          className="h-16 w-16 hover:scale-[1.1]"
          alt="Helper Icon"
          title="Item/Augment Tips"
        />
      </div>
      <Modal
        className="modalStyle"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null} // Remove the footer buttons
        width={1400}
        centered
      >
        <ItemTierList />
      </Modal>
    </div>
  );
};

export default BottomRightTools;
