import * as React from 'react';

const useModalController = (): {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
} => {

  const [modalVisible, setModalVisibleState] = React.useState(false);
  const modalVisibleRef = React.useRef<boolean>(false);
  
  const setModalVisible = (visible: boolean) => {
    modalVisibleRef.current = visible;
    setModalVisibleState(visible);
  };

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalVisibleRef.current) {
        // use modal visible ref so we don't need to declare it as a dependency
        setModalVisible(false);
      }
    };

    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, []);

  return {
    modalVisible,
    setModalVisible,
  };
};

export default useModalController;