import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen, describeConformance } from 'test/utils';
import YearPicker, { yearPickerClasses as classes } from '@mui/lab/YearPicker';
import { adapterToUse, wrapPickerMount, createPickerRender } from '../internal/pickers/test-utils';

describe('<YearPicker />', () => {
  const render = createPickerRender();

  describeConformance(
    <YearPicker
      minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
      maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
      isDateDisabled={() => false}
      date={adapterToUse.date()}
      onChange={() => {}}
    />,
    () => ({
      classes,
      inheritComponent: 'div',
      wrapMount: wrapPickerMount,
      render,
      muiName: 'MuiYearPicker',
      refInstanceof: window.HTMLDivElement,
      // cannot test reactTestRenderer because of required context
      skip: [
        'componentProp',
        'componentsProp',
        'propsSpread',
        'reactTestRenderer',
        'themeDefaultProps',
        'themeVariants',
      ],
    }),
  );

  it('allows to pick year standalone by click, `Enter` and `Space`', () => {
    const onChangeMock = spy();
    render(
      <YearPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        isDateDisabled={() => false}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
      />,
    );
    const targetYear = screen.getByRole('button', { name: '2025' });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(1);
    expect(onChangeMock.args[0][0]).toEqualDateTime(adapterToUse.date('2025-02-02T00:00:00.000'));
  });

  it('does not allow to pick year if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <YearPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        isDateDisabled={() => false}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        readOnly
      />,
    );
    const targetYear = screen.getByRole('button', { name: '2025' });
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(0);
  });

  it('does not allow to pick year if disabled prop is passed', () => {
    const onChangeMock = spy();
    render(
      <YearPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        isDateDisabled={() => false}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        disabled
      />,
    );
    const targetYear = screen.getByRole('button', { name: '2025' });
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(0);
  });
});
