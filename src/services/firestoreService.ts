import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { LeadRecord } from '../types';

export interface TechnicalVisit {
  id: string;
  leadId: string;
  referenceCode: string;
  clientName: string;
  clientPhone: string;
  visitDate: string; // ISO
  location: string;
  notes: string;
  calendarEventId?: string;
  calendarEventLink?: string;
  createdAt: string;
}

export interface WorkspaceExport {
  id: string;
  type: 'sheets' | 'slides' | 'calendar';
  title: string;
  fileId?: string;
  fileUrl: string;
  leadReference: string;
  createdAt: string;
}

/**
 * Guarda o actualiza un Lead en Firestore
 */
export async function saveLeadToFirestore(lead: LeadRecord): Promise<void> {
  const path = 'leads';
  try {
    const leadDocRef = doc(db, path, lead.id);
    const payload = {
      ...lead,
      userId: auth.currentUser?.uid || null,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(leadDocRef, payload, { merge: true });
    console.log('[Firestore] Lead guardado exitosamente:', lead.referenceCode);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${lead.id}`);
  }
}

/**
 * Escucha en tiempo real la colección de leads
 */
export function subscribeToFirestoreLeads(
  onUpdate: (leads: LeadRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'leads';
  try {
    const leadsCollection = collection(db, path);
    return onSnapshot(
      leadsCollection,
      (snapshot) => {
        const results: LeadRecord[] = [];
        snapshot.forEach((docSnap) => {
          results.push(docSnap.data() as LeadRecord);
        });
        // Ordenar por fecha descendente
        results.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onUpdate(results);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Guarda una visita técnica coordinada con Google Calendar
 */
export async function saveTechnicalVisitToFirestore(visit: TechnicalVisit): Promise<void> {
  const path = 'visits';
  try {
    const visitDocRef = doc(db, path, visit.id);
    await setDoc(visitDocRef, visit, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${visit.id}`);
  }
}

/**
 * Guarda un registro de exportación a Google Workspace
 */
export async function recordWorkspaceExportToFirestore(exp: WorkspaceExport): Promise<void> {
  const path = 'exports';
  try {
    const exportDocRef = doc(db, path, exp.id);
    await setDoc(exportDocRef, exp, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${exp.id}`);
  }
}
