module.exports = {
  TOPIC_PREFIX: "wfm",
  WORKFLOW_ENTITY_NAME: "workflows",
  SYNC_TOPIC_PREFIX: "wfm:sync",
  TOPIC_SEPARATOR: ":",
  ERROR_PREFIX: "error",
  DONE_PREFIX: "done",
  STATUS: {
    COMPLETE: "complete",
    COMPLETE_DISPLAY: "Complete",
    PENDING: "pending",
    PENDING_DISPLAY: "In Progress",
    NEW_DISPLAY: "New",
    UNASSIGNED_DISPLAY: "Unassigned"
  },
  TOPICS: {
    CREATE: "create",
    UPDATE: "update",
    LIST: "list",
    REMOVE: "remove",
    READ: "read",
    START: "start",
    STOP: "stop",
    FORCE_SYNC: "force_sync",
    SYNC_COMPLETE: "sync_complete"
  }
};