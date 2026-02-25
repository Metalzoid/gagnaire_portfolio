// --------------------------------------------------------------------------
// Styles CV - Thème clair (Dracula light)
// --------------------------------------------------------------------------
import { StyleSheet } from "@react-pdf/renderer";

// Couleurs du thème clair
const colors = {
  bg: "#f8f8f2",
  bgSecondary: "#e8e8e2",
  textPrimary: "#282a36",
  textSecondary: "#6272a4",
  accent: "#7c3aed",
  accentSecondary: "#d63384",
  link: "#0d7e8c",
  border: "#d4d4cc",
  success: "#1b9e3e",
};

export const cvStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: colors.bg,
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  mainRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  sidebar: {
    width: "30%",
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  mainCol: {
    flex: 1,
    paddingLeft: 20,
  },
  // Header
  header: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "column",
  },
  headerRight: {
    width: 100,
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    color: colors.accent,
    marginBottom: 8,
  },
  contact: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  photo: {
    width: 90,
    height: 90,
    objectFit: "cover",
    objectPosition: "center",
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  // About
  aboutText: {
    fontSize: 10,
    color: colors.textPrimary,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  // Experience
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  experienceDate: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  experienceCompany: {
    fontSize: 9,
    color: colors.accent,
    marginBottom: 4,
  },
  experienceDescription: {
    fontSize: 9,
    color: colors.textPrimary,
    lineHeight: 1.4,
  },
  experienceTech: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  techTag: {
    fontSize: 8,
    color: colors.textSecondary,
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  // Skills
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryName: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  skillName: {
    flex: 1,
    fontSize: 9,
    color: colors.textPrimary,
  },
  skillLevel: {
    width: 60,
    flexDirection: "row",
    backgroundColor: colors.bgSecondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  skillLevelFill: {
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  // Projects
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  projectTech: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
});
