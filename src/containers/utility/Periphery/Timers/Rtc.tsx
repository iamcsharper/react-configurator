import Checkbox from '@components/controls/Checkbox';
import Form from '@components/controls/Form';
import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { scale } from '@scripts/helpers';
import { useForm } from 'react-hook-form';

const Rtc = () => {
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
        padding: scale(2),
      }}
    >
      <h4>Настройки RTC</h4>
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
        id="2"
        title="Test 2"
        description="Test 2 description"
      >
        <label>Test field 2</label>
        <input />
      </DetailedItemWrapper>
    </div>
  );
};

export default Rtc;
