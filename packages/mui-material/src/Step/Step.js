import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { integerPropType } from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/core';
import StepperContext from '../Stepper/StepperContext';
import StepContext from './StepContext';
import useThemeProps from '../styles/useThemeProps';
import styled from '../styles/styled';
import { getStepUtilityClass } from './stepClasses';

const useUtilityClasses = (ownerState) => {
  const { classes, orientation, alternativeLabel, completed } = ownerState;

  const slots = {
    root: ['root', orientation, alternativeLabel && 'alternativeLabel', completed && 'completed'],
  };

  return composeClasses(slots, getStepUtilityClass, classes);
};

const StepRoot = styled('div', {
  name: 'MuiStep',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [
      styles.root,
      styles[ownerState.orientation],
      ownerState.alternativeLabel && styles.alternativeLabel,
      ownerState.completed && styles.completed,
    ];
  },
})(({ ownerState }) => ({
  ...(ownerState.orientation === 'horizontal' && {
    paddingLeft: 8,
    paddingRight: 8,
  }),
  ...(ownerState.alternativeLabel && {
    flex: 1,
    position: 'relative',
  }),
}));

const Step = React.forwardRef(function Step(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiStep' });
  const {
    active: activeProp,
    children,
    className,
    completed: completedProp,
    disabled: disabledProp,
    expanded = false,
    index,
    last,
    ...other
  } = props;

  const { activeStep, connector, alternativeLabel, orientation, nonLinear } =
    React.useContext(StepperContext);

  let [active = false, completed = false, disabled = false] = [
    activeProp,
    completedProp,
    disabledProp,
  ];

  if (activeStep === index) {
    active = activeProp !== undefined ? activeProp : true;
  } else if (!nonLinear && activeStep > index) {
    completed = completedProp !== undefined ? completedProp : true;
  } else if (!nonLinear && activeStep < index) {
    disabled = disabledProp !== undefined ? disabledProp : true;
  }

  const contextValue = React.useMemo(
    () => ({ index, last, expanded, icon: index + 1, active, completed, disabled }),
    [index, last, expanded, active, completed, disabled],
  );

  const ownerState = {
    ...props,
    active,
    orientation,
    alternativeLabel,
    completed,
    disabled,
    expanded,
  };

  const classes = useUtilityClasses(ownerState);

  const newChildren = (
    <StepRoot
      className={clsx(classes.root, className)}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      {connector && alternativeLabel && index !== 0 ? connector : null}
      {children}
    </StepRoot>
  );

  return (
    <StepContext.Provider value={contextValue}>
      {connector && !alternativeLabel && index !== 0 ? (
        <React.Fragment>
          {connector}
          {newChildren}
        </React.Fragment>
      ) : (
        newChildren
      )}
    </StepContext.Provider>
  );
});

Step.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * Sets the step as active. Is passed to child components.
   */
  active: PropTypes.bool,
  /**
   * Should be `Step` sub-components such as `StepLabel`, `StepContent`.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * If `true`, the step is disabled, will also disable the button if
   * `StepButton` is a child of `Step`. Is passed to child components.
   */
  disabled: PropTypes.bool,
  /**
   * Expand the step.
   * @default false
   */
  expanded: PropTypes.bool,
  /**
   * The position of the step.
   * The prop defaults to the value inherited from the parent Stepper component.
   */
  index: integerPropType,
  /**
   * If `true`, the Step is displayed as rendered last.
   * The prop defaults to the value inherited from the parent Stepper component.
   */
  last: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default Step;
