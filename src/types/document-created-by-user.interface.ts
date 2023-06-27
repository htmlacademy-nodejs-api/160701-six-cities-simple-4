export interface DocumentCreatedByUserInterface {
  createdByUser(documentId: string, userId: string): Promise<boolean>;
}
