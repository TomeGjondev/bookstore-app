import { describe, expect, it } from 'vitest'
import { validateCoverFile } from './cover-upload.service'

describe('validateCoverFile', () => {
  it('accepts supported image formats within the limit', () => {
    expect(validateCoverFile(new File(['cover'], 'cover.webp', { type: 'image/webp' }))).toBe('')
  })

  it('rejects unsupported formats and files over 5 MB', () => {
    expect(validateCoverFile(new File(['notes'], 'notes.txt', { type: 'text/plain' }))).toMatch(/JPG/)
    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' })
    expect(validateCoverFile(oversized)).toMatch(/smaller than 5 MB/)
  })
})
