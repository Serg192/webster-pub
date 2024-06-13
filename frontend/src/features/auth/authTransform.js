import { createTransform } from "redux-persist";

const authTransform = createTransform(
  (inboundState) => {
    const { token, ...rest } = inboundState;
    return rest;
  },
  (outboundState) => {
    return outboundState;
  },
  { whitelist: ["auth"] }
);

export default authTransform;
