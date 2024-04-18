import {
  Administrator,
  Agent,
  Director,
  Parent,
  Student,
  Teacher,
} from "../Constants/userRoles";

export default function mapUserRole(role: string): string {
  switch (role) {
    case Director:
      return "Directeur";
    case Administrator:
      return "Administrateur";
    case Teacher:
      return "Enseignant";
    case Agent:
      return "Agent";
    case Student:
      return "Elève";
    case Parent:
      return "Parent";
    default:
      return "Utilisateur";
  }
}
