import { useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import Page from "../components/Page";

enum State {
  LOADING,
  PROCESSING,
  RUNNING,
  ERROR,
}

/**
 * Phase six of the cycle.
 * User should pick their choice of captures to be used in the frame.
 * @returns {Element}
 */
export default function PhaseSixPage() {
  const [state, setState] = useState<State>(State.LOADING);

  if (state === State.LOADING)
    return (
      <>
        <Page>
          <LoadingAnimation />
          <span className="text-xl">Processing your captures</span>
        </Page>
      </>
    );

  return <></>;
}
