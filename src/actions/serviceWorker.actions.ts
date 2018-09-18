import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("SERVICE_WORKER");

export const receiveServiceWorkerMessage = actionCreator<
  PLReceiveServiceWorkerMessage
>("RECEIVE_MESSAGE");
