export const HISTORY_PUSH = "HISTORY_PUSH"

export function navigateTo(path) {
  return {
    type: HISTORY_PUSH,
    payload: {
      path,
    },
  }
}
