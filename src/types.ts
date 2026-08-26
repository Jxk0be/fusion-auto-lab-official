/** Shared types used across components. */

/** A photo the visitor attached to the quote form, already resized in-browser. */
export interface UploadedPhoto {
  name: string
  /** data:image/jpeg;base64,... */
  dataUrl: string
  /** Encoded size in bytes, used for the running total shown to the visitor. */
  bytes: number
}
