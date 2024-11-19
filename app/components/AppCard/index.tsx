import React, { ReactNode } from "react";

import clsx from "clsx";

import { StyledCard } from "./index.styled";

type AppCardProps = {
  className?: string;
  title?: string | ReactNode;
  action?: ReactNode | string;
  actions?: ReactNode | string[] | React.ReactNode[];
  extra?: ReactNode | string;
  cover?: any;
  footer?: any;
  children?: ReactNode;
  heightFull?: boolean;

  [x: string]: any;
};

const AppCard: React.FC<AppCardProps> = ({
  title,
  extra,
  children,
  cover,
  className,
  actions,
  heightFull,
  ...rest
}) => {
  return (
    <StyledCard
      className={clsx({ heightFull: heightFull }, className)}
      title={title}
      extra={extra ? extra : null}
      cover={cover}
      actions={actions as React.ReactNode[]}
      bordered={false}
      {...rest}
    >
      {children}
    </StyledCard>
  );
};

export default AppCard;
