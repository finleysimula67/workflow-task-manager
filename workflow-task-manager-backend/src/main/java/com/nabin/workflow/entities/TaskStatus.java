package com.nabin.workflow.entities;

public enum TaskStatus {
    TODO("To Do"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    ARCHIVED("Archived");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public TaskStatus[] getValidTransitions() {
        return switch (this) {
            case TODO        -> new TaskStatus[]{IN_PROGRESS, ARCHIVED};
            case IN_PROGRESS -> new TaskStatus[]{TODO, COMPLETED, ARCHIVED};
            case COMPLETED   -> new TaskStatus[]{TODO, ARCHIVED};
            case ARCHIVED    -> new TaskStatus[]{};
        };
    }
}