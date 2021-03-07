import React, { FunctionComponent } from 'react';

interface CardProps {
  title: string;
}

const Card: FunctionComponent<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-heading">{title}</div>
        <div className="card-content">{children}</div>
      </div>
    </div>
  );
};

export default Card;
