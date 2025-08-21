export enum TPermissionLevel {
  VIEWER = "viewer",
  EDITOR = "editor",
  MANAGER = "manager",
  OWNER = "owner",
}

export enum TDocAIActions {
  IMPROVE = "improve",
  SHORTEN = "shorten",
  SIMPLIFY = "simplify",
  DETAILED = "detailed",
  PARAPHRASE = "paraphrase",
  FLUENT = "fluent",
  ANTICIPATORY = "anticipatory",
  ASSERTIVE = "assertive",
  COMPASSIONATE = "compassionate",
  CONFIDENT = "confident",
  CONSTRUCTIVE = "constructive",
  CUSTOM_PROMPT = "custom-prompt",
}

export enum TDocDefaultActions {
  SAVE = "save",
  PRINT = "print",
  SHARE = "share",
  FOCUS = "focus",
}

export const EVENT_NAMES = {
  CHAT_SEND: "chat:send_message",
  CHAT_RECEIVE: "chat:receive_message",
} as const;

export const ERROR_EVENT_NAMES = Object.fromEntries(
  Object.entries(EVENT_NAMES).map(([key, value]) => [
    `${key}_ERROR`,
    `${value}_error`,
  ])
) as {
  readonly [K in keyof typeof EVENT_NAMES as `${K}_ERROR`]: `${(typeof EVENT_NAMES)[K]}_error`;
};
