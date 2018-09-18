import React from 'react';

export default () => (
  <div className="warn-tips">
    <h5> - 温馨提示 - </h5>
    <p>
      房源信息仅供参考，实际信息以原贴为准。此应用仅提供房源信息展示空间，不保证房源信息的真实、合法、有效。再次提醒您：在看房及租房时注意人身安全与财产安全，建议您与房东签订书面租赁合同。
    </p>
    <style jsx>
      {`
        .warn-tips {
          padding: 0 20px;
          h5 {
            text-align: center;
            margin: 20px 0;
          }
          h5,
          p {
            color: darkgray;
          }
        }
      `}
    </style>
  </div>
);
