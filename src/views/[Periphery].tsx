import { TestTrigger } from "@components/TestTrigger";
import { DetailsProvider, useDetails } from "@context/details";
import { scale } from "@scripts/helpers";
import { Allotment } from "allotment";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

const Settings = ({ id }: { id?: string }) => {
  const { setCurrentData } = useDetails();

  useEffect(() => {
    const listener = (evt: KeyboardEvent) => {
      if (document.activeElement) {
        if (document.activeElement.nodeName.toLocaleLowerCase() !== "body") {
          return;
        }
      }
      let isEscape = false;
      if ("key" in evt) {
        isEscape = evt.key === "Escape" || evt.key === "Esc";
      } else {
        isEscape = evt.keyCode === 27;
      }
      if (isEscape) {
        setCurrentData(null);
      }
    };

    window.addEventListener("keyup", listener);

    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, []);

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: scale(1),
      }}
    >
      Периферия #{id}
      <TestTrigger id="0" title="Tets 1" description="Test 2 description" />
      <TestTrigger id="1" title="Test 2" description="Test 2 description" />
      <input />
    </div>
  );
};

const Details = () => {
  const { currentData } = useDetails();

  return (
    <div css={{ padding: scale(2) }}>
      {currentData ? (
        <>
          <h4 css={{ marginBottom: scale(1) }}>{currentData?.title}</h4>
          <p>{currentData?.description}</p>
        </>
      ) : (
        <>Не выбрано</>
      )}
    </div>
  );
};

const DetailsProviderResetter = ({ id }: { id: string }) => {
  const { setCurrentData } = useDetails();

  useEffect(() => {
    setCurrentData(null);

    return () => setCurrentData(null);
  }, [id]);

  return null;
};

export default function PeripheryPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DetailsProvider>
      <DetailsProviderResetter id={`${id}`} />
      <Allotment vertical>
        <Allotment.Pane>
          <Settings id={id} />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={150}>
          <Details />
        </Allotment.Pane>
      </Allotment>
    </DetailsProvider>
  );
}
