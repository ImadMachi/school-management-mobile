import { folders } from "../Constants/folders";

export default function mapFolderName(folderName: string): string {
  if (folderName === folders.INBOX) {
    return "Boîte de réception";
  } else if (folderName === folders.SENT) {
    return "Envoyés";
  } else if (folderName === folders.STARRED) {
    return "Favoris";
  }
}
