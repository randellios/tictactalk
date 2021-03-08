import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

interface CardProps {
  title: string;
  selected?: boolean;
}

const Card: FunctionComponent<CardProps> = ({ title, children, selected }) => {
  return (
    <div className="card">
      <div className="card-body">
        {title && <div className="card-heading">{title}</div>}
        <div
          className={classNames(selected ? 'selected' : null, 'card-content')}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
