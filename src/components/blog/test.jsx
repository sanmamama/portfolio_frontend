import React, { useEffect, useState } from 'react';

function Test() {
  const [data, setData] = useState(null);

  const result = fetch(/* データのURL */);
  const res = result.json();
  setData(res);
  

  return <div>レンダリング！{data}</div>;
}

export default Test;