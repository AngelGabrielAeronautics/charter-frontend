import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { IProject } from "../models/IProject";
import { db } from "./firebase";

export async function getProjects(company_name: string): Promise<IProject[]> {
  try {
    const dataQuery = query(
      collection(db, "projects"),
      where("organisation_name", "==", company_name)
    );
    const querySnapshot = await getDocs(dataQuery);
    return querySnapshot.docs.map((e) => e.data() as IProject);
  } catch (e) {
    return [];
  }
}

export async function createProject(project: IProject): Promise<void> {
  try {
    await addDoc(collection(db, "projects"), project);
  } catch (e) {}
}

export async function acceptProject(reference: string): Promise<void> {
  const projectRef = doc(db, "projects", reference);
  await updateDoc(projectRef, {
    status: "Accepted",
  });
}

export async function rejectProject(reference: string): Promise<void> {
  const projectRef = doc(db, "projects", reference);
  await updateDoc(projectRef, {
    status: "Rejected",
  });
}
