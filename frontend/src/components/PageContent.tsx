import React, { FunctionComponent } from 'react';

interface PageContentProps {
  title: string;
}

const PageContent: FunctionComponent<PageContentProps> = ({
  children,
  title,
}) => (
  <div className="container">
    <div className="page-content">
      {title && (
        <div className="page-content-header">
          <div className="content">
            <div className="heading">{title}</div>
          </div>
          <svg
            className="seperator"
            style={{ fill: '#87B606' }}
            width="100%"
            height="100%"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 7049 455"
          >
            <path d="M0 455c64,-13 135,-35 199,-51 466,-120 947,-246 1425,-314 307,-44 621,-57 938,-59 1059,-7 1681,191 2687,295 153,16 312,24 467,30 383,15 556,25 940,-31 70,-10 143,-22 207,-41 42,-12 128,-45 165,-53 3,0 10,-2 12,-3 8,-3 6,0 9,-7l0 -221 -7049 0 0 455z" />
          </svg>
        </div>
      )}
      <div className="page-content-body">{children}</div>
    </div>
  </div>
);

export default PageContent;
