import React from "react";

// import '../../../src/types/velocity-react.d';
// import { VelocityComponent } from 'velocity-react';
// import 'velocity-animate/velocity.ui';

type AppAnimateProps = {
  children: React.ReactNode;
  [x: string]: any;
};

// const defaultProps = {
//   animation: 'transition.fadeIn',
//   runOnMount: true,
//   targetQuerySelector: null,
//   interruptBehavior: 'stop',
//   visibility: 'visible',
//   duration: 400,
//   delay: 100,
//   easing: [0.4, 0.0, 0.2, 1],
//   display: null,
//   queue: '',
//   loop: false,
//   mobileHA: true,
// };

export const AppAnimate: React.FC<AppAnimateProps> = (props) => {
  // const children = React.cloneElement(props.children, {
  //   style: {
  //     ...props.children.style,
  //     visibility: 'hidden',
  //   },
  // });
  return <>{props.children}</>;
};

// AppAnimate.defaultProps = defaultProps;
export default AppAnimate;
