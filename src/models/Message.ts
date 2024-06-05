import { folders } from "../Constants/folders";
import { Category } from "./Category";

export type SenderType = {
  id: number;
  email: string;
  role: string;
  senderData: {
    id: number;
    firstName: string;
    lastName: string;
    [key: string]: any;
  };
};

export type AttachmentType = {
  id: number;
  filepath: string;
  filename: string;
};

export type Message = {
  id: number;
  body: string;
  subject: string;
  sender: SenderType;
  createdAt: Date | string;
  folder: (typeof folders)[keyof typeof folders];
  attachments: AttachmentType[];
  category: Category;
  isRead: boolean;
};
