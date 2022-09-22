import { DetailedItemWrapper } from '@components/DetailedItemWrapper';
import { scale } from '@scripts/helpers';
import { useForm } from 'react-hook-form';

const BasicTimer = ({ timerName }: { timerName: string }) => {
  useForm({
    defaultValues: { rtc: false, alarm: false },
  });

  // const isChecked = form.watch('rtc');

  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: scale(1),
        padding: scale(2),
      }}
    >
      <h4>Таймер {timerName}</h4>
      <DetailedItemWrapper
        id="2"
        title="Test 2"
        description="Test 2 description"
      >
        <p>TODO</p>
      </DetailedItemWrapper>
    </div>
  );
};

export default BasicTimer;
