import { DetailsTrigger } from '@components/DetailsTrigger';
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
      <DetailsTrigger title="Test 2" description="Test 2 description" />
    </div>
  );
};

export default BasicTimer;
