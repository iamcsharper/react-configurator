import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { DetailsProvider, useDetails } from '@context/details';
import { scale } from '@scripts/helpers';
import { Allotment } from 'allotment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useParams } from 'react-router-dom';

const Settings = ({ id }: { id?: string }) => {
  const { setCurrentData } = useDetails();

  useEffect(() => {
    const listener = (evt: KeyboardEvent) => {
      if (document.activeElement) {
        if (document.activeElement.nodeName.toLocaleLowerCase() !== 'body') {
          return;
        }
      }
      let isEscape = false;
      if ('key' in evt) {
        isEscape = evt.key === 'Escape' || evt.key === 'Esc';
      } else {
        isEscape = evt.keyCode === 27;
      }
      if (isEscape) {
        setCurrentData(null);
      }
    };

    window.addEventListener('keyup', listener);

    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, []);

  const form = useForm({
    defaultValues: { rtc: false, alarm: false },
  });
  const isChecked = form.watch('rtc');

  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: scale(1),
        padding: scale(1),
      }}
    >
      <h4>Периферия - {id} (info)</h4>
      <Form methods={form} onSubmit={(vals) => console.log(vals)}>
        <DetailedItemWrapper id="0" title="RTC" description="Информация об RTC">
          <Form.Field name="rtc">
            <Checkbox value="1" forceControlled>
              Включить RTC
            </Checkbox>
          </Form.Field>
        </DetailedItemWrapper>
        <DetailedItemWrapper
          id="1"
          title="Будильник"
          description="Информация о будильнике. Также можно выделять в группы)"
        >
          <Form.Field name="alarm">
            <Checkbox value="1" forceControlled>
              Будильник
            </Checkbox>
          </Form.Field>
        </DetailedItemWrapper>
        <button type="submit">Submit</button>
      </Form>
      {isChecked && <p>включен rtc..?</p>}
      <DetailedItemWrapper
        id="1"
        title="Test 2"
        description="Test 2 description"
      >
        <label>Test field 2</label>
        <input />
      </DetailedItemWrapper>
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

const SplitPanes = ({ id }: { id?: string }) => {
  const { setCurrentData, setEnabled } = useDetails();

  useEffect(() => {
    setCurrentData(null);

    return () => setCurrentData(null);
  }, [id]);

  return (
    <Allotment
      vertical
      onChange={(sizes) => {
        const isDetailsVisible = !!sizes[1];
        setEnabled(isDetailsVisible);
      }}
    >
      <Allotment.Pane>
        <Settings id={id} />
      </Allotment.Pane>
      <Allotment.Pane preferredSize={150} snap>
        <Details />
      </Allotment.Pane>
    </Allotment>
  );
};

export default function PeripheryPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DetailsProvider>
      <SplitPanes id={id} />
    </DetailsProvider>
  );
}
