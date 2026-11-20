import { useEffect, useState } from "react";

/** True during a screen's opening choreography, so later changes animate without the entrance delay. */
export function useFirstRender(ms = 1500) {
  const [first, setFirst] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setFirst(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return first;
}
