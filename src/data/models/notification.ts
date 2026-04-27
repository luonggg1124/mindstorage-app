export enum NotificationType {
    INVITE_TO_JOIN_SPACE,
    INVITE_TO_JOIN_GROUP
}

export interface INotification {
    id: string;
    title: string;
    content: string;
    data: string;
    read: boolean;
    readAt?: string;
    type: NotificationType;
}