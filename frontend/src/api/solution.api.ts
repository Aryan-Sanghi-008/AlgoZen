import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import type { SolutionType } from "@/types";

const SOLUTIONS_COLLECTION = "solutions";

/**
 * Adds a new solution document to the Firestore 'solutions' collection.
 * @param solutionData - The solution data to post. Note: photo_urls
 * must be a list of URLs from Firebase Storage (upload first!).
 */

export const postNewSolution = async (
  solutionData: Omit<SolutionType, "id" | "createdAt">
) => {
  try {
    // We add the createdAt timestamp on the server-side
    const docToPost = {
      ...solutionData,
      createdAt: Timestamp.now(),
    };

    // 'addDoc' creates a new document with a random ID
    const docRef = await addDoc(
      collection(db, SOLUTIONS_COLLECTION),
      docToPost
    );

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error posting solution: ", error);
    return { success: false, error: error };
  }
};

/**
 * Fetches all solutions from Firestore for a specific contest,
 * sorted by when they were created.
 * @param contestName - The name of the contest to filter by.
 */

export const getSolutionsByContest = async (
  contestName: string
): Promise<SolutionType[]> => {
  const solutions: SolutionType[] = [];

  try {
    const solutionsRef = collection(db, SOLUTIONS_COLLECTION);
    const q = query(
      solutionsRef,
      where("contest_name", "==", contestName),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      solutions.push({
        id: doc.id,
        ...doc.data(),
      } as SolutionType);
    });

    return solutions;
  } catch (error) {
    console.error("Error fetching solutions: ", error);
    return [];
  }
};
