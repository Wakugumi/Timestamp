import { useParams } from "react-router";
import { useEffect, useState } from "react";
enum State {
  STARTUP = 0,
  LOADING = 1,
  RUNNING = 2,
  ERROR = -1,
}

export default function PaymentHandling() {
  const { merchant_id, order_id, status_code } = useParams();
  const [state, setState] = useState<State>(State.STARTUP);

  useEffect(() => {}, []);

  return <></>;
}
