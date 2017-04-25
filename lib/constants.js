module.exports = {
  TOPIC_PREFIX: "wfm",
  WORKFLOW_ENTITY_NAME: "workflows",
  USERS_ENTITY_NAME: "users",
  SYNC_TOPIC_PREFIX: "wfm:sync",
  WORKFLOW_PREFIX: "wfm:workflows",
  STEPS_ENTITY_NAME: "step",
  WORKORDER_ENTITY_NAME: "workorders",
  RESULTS_ENTITY_NAME: "results",
  TOPIC_SEPARATOR: ":",
  ERROR_PREFIX: "error",
  DONE_PREFIX: "done",
  TOPIC_TIMEOUT: 1000,
  STATUS: {
    COMPLETE: "complete",
    COMPLETE_DISPLAY: "Complete",
    PENDING: "pending",
    PENDING_DISPLAY: "In Progress",
    NEW_DISPLAY: "New",
    UNASSIGNED_DISPLAY: "Unassigned"
  },
  STEP_TYPES: {
    STATIC: "static"
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
    SYNC_COMPLETE: "sync_complete",
    READ_PROFILE: "read_profile"
  },
  STEP_TOPICS: {
    BEGIN: "begin",
    NEXT: "next",
    PREVIOUS: "previous",
    CURRENT: "current",
    COMPLETE: "complete",
    SUMMARY: "summary"
  }
};