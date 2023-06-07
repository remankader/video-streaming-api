export default function responseMessage(
  message:
    | string
    | { msg: string; path?: string }
    | { msg: string; path?: string }[]
) {
  let messages: { msg: string; path?: string }[] = [{ msg: "" }];

  if (typeof message === "string" || message instanceof String) {
    messages = [{ msg: message as string }];
  } else if (Array.isArray(message)) {
    messages = message as { msg: string; path?: string }[];
  } else if (typeof message === "object" && message !== null) {
    messages = [message as { msg: string; path?: string }];
  }

  return messages;
}
