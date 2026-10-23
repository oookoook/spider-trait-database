# Reference PDF Attachments: Implementation Plan

Status: Ready for implementation handoff. No application changes are included in this document.
Decision date: 2026-09-25.

## 1. Agreed Requirements

- Store PDF bytes in MySQL/MariaDB as `LONGBLOB`, in a separate table.
- Allow one optional PDF per reference. Keep the schema easy to extend to multiple attachments later.
- Maximum file size: 20 MiB, exactly 20,971,520 bytes. Accept the exact limit; reject anything larger.
- Upload using `multipart/form-data`, not base64 or JSON-encoded file contents.
- Only logged-in users can see attachment metadata or download PDFs.
- Only editors can upload or replace a PDF. Attachment deletion will also be editor-only, consistent with reference editing.
- When replacing a reference, transfer its PDF if the target has none. Otherwise retain the target PDF and discard the source PDF when deletion succeeds.
- Do not use permanent filesystem storage. Temporary upload files are permitted and must be cleaned up.
- Reference replacement remains non-transactional by explicit decision. No concurrent operations on the same entity are expected; partial completion on failure is an accepted risk.

## 2. Existing Implementation Anchors

- `backend/api/api.js`: route registration, `requiresAuth()`, `auth.isEditor`, and route-scoped `express-fileupload` middleware.
- `backend/api/references.js`: reference CRUD and replace-and-delete behavior.
- `backend/util/db-client.js`: `mysql` connection pool, placeholder queries, `getConnection`, `cquery`, and `releaseConnection`.
- `backend/util/auth.js`: existing session and editor checks. Do not redefine role inheritance for this feature.
- `frontend/src/store/editor.js`: existing `FormData` upload through the shared `put` action.
- `frontend/src/store/api.js`: Axios actions already accept `FormData` without converting it to JSON.
- `frontend/src/components/UploadForm.vue`: existing Vuetify file-input pattern, but currently hard-coded for datasets and 100 MB.
- `frontend/src/components/ReferenceDetail.vue`: primary attachment UI location.
- `frontend/src/components/ReplaceReferenceDialog.vue`: confirmation of reference replacement.
- `frontend/src/store/entity-module.js`: references currently use the shared entity module.

Reuse the multipart transport and UI conventions, not dataset parsing, permanent source-file copying, or background import jobs. No new upload library is required.

## 3. Schema and Migration

Add `reference_pdf` to a new additive migration under `db/sql/` using repository SQL conventions. Do not rewrite historical order migrations. Add the note about the migration to the `docs\dev\arachnida-node-vite-migration.md`

| Column | Type / Constraint | Purpose |
| --- | --- | --- |
| `id` | `INT NOT NULL AUTO_INCREMENT PRIMARY KEY` | Stable attachment identifier for future expansion |
| `reference_id` | `INT NOT NULL`, unique index | One attachment per reference |
| `filename` | `VARCHAR(255) NOT NULL` | Sanitized original filename for display/download |
| `size_bytes` | `INT UNSIGNED NOT NULL` | Validated byte length |
| `uploaded_at` | `DATETIME NOT NULL` | Timestamp assigned on each successful upload/replacement |
| `content` | `LONGBLOB NOT NULL` | Original PDF bytes |

Use InnoDB and a foreign key from `reference_id` to `reference.id` with `ON DELETE CASCADE`. Match existing identifier types exactly. A future multi-file feature can remove the unique constraint without changing attachment IDs.

All attachments are PDFs, so the response content type is fixed to `application/pdf`; do not trust or persist a client-supplied content type as authoritative.

Existing references require no backfill. Deleting a reference must cascade only after that reference is successfully deleted. Do not pass this table as a generic pre-deletion cascade to `deleteEntity`: that helper can delete cascaded records before discovering another blocking dependency.

## 4. API Contract

Use a dedicated attachment API so public reference list/detail responses remain unchanged and never include attachment metadata or bytes.

| Method and Path | Access | Response / Behavior |
| --- | --- | --- |
| `GET /backend/references/:id/pdf/metadata` | Logged-in users | `200 { item: null }` if reference exists without a PDF; otherwise attachment metadata |
| `GET /backend/references/:id/pdf` | Logged-in users | Binary PDF download; `404` if reference or attachment is absent |
| `PUT /backend/references/:id/pdf` | Editors | Exactly one multipart file field named `pdf`; create or replace; `200 { item: metadata }` |
| `DELETE /backend/references/:id/pdf` | Editors | `204` on removal or already absent; `404` if reference does not exist |

Metadata shape: `{ id, filename, sizeBytes, uploadedAt }`. Never return a Buffer or base64 content in JSON.

- Require an authenticated OIDC session on every endpoint, including metadata. An API key alone does not satisfy the logged-in requirement.
- Apply `requiresAuth()` before `auth.isEditor` and both before multipart parsing on write routes.
- Preserve existing authentication redirect behavior where applicable; unauthenticated requests must never receive metadata or bytes. Authenticated non-editors receive `403` on writes.
- Reject invalid reference IDs and malformed/missing/multiple file inputs with `400`, oversized/truncated uploads with `413`, and non-PDF input with `415`.
- Use explicit status handling for new endpoints rather than converting every failure to `400`. Unexpected storage failures return a generic `500` without query details or payloads.
- Send `Cache-Control: private, no-store` for metadata and downloads. Downloads also send `Content-Type: application/pdf`, `Content-Disposition: attachment` with safely encoded filename, and `X-Content-Type-Options: nosniff`.
- Return raw bytes via the response, not a temporary public URL or static-file directory. Inline preview and HTTP Range support are outside this first version.

## 5. Upload and Database Handling

1. Add a dedicated PDF size setting, separate from dataset import limits, to `backend/settings.js`. Reuse the configured temporary directory.
2. Configure route-local `express-fileupload` with temporary files, a 20 MiB file limit, and bounds on file/part counts. Ensure oversized uploads cannot silently succeed with truncated content.
3. Validate exactly one file, nonzero length, permitted filename length, and actual byte size. Use the actual bytes, not just multipart metadata, as the authority.
4. Check PDF signature/content identification in addition to a `.pdf` extension and compatible reported MIME type. Do not reject a valid PDF solely because the browser reports `application/octet-stream` or omits MIME information.
5. Sanitize the display filename: strip path components and control characters, enforce length, and safely encode it in download headers. Never use it as a filesystem destination.
6. Read the bounded temporary file as a Node Buffer. Use driver placeholders for all values and keep binary content out of ordinary reference CRUD bodies.
7. Insert or replace bytes and metadata in one `INSERT ... ON DUPLICATE KEY UPDATE` statement. Do not delete the existing PDF first. This is a single-statement write, not a new transaction framework.
8. Remove temporary files in `finally`, including validation and database failures. Account for parser errors, aborted requests, and unexpected extra files; verify the installed middleware's cleanup behavior rather than assuming it. Never delete unrelated files in the shared temporary directory.

PDF signature checks are format screening, not malware detection. This version does not add an antivirus service, content sanitization, PDF rendering, or text extraction. Do not describe uploads as malware-safe. Any required scanning service is a separate deployment/security decision, not a prerequisite silently assumed by implementation agents.

### Resource and Logging Constraints

- The existing `mysql` driver supports Buffer parameters, but its query API converts them into hex SQL literals. A 20 MiB upload can produce a query larger than 40 MiB and multiple in-memory copies.
- Verify the server's actual `max_allowed_packet`; use at least 64 MiB for this contract, with appropriate headroom. Do not infer it from the column type. Test the exact maximum through the real driver.
- Match reverse-proxy body limits and timeouts to the maximum upload plus multipart overhead. Leave the global JSON limit unchanged.
- Remove or redact payload logging in `db-client.js` (`getQueryParams` currently calls `console.dir(opt)`). Database-error logging must not leak the formatted SQL containing hex PDF bytes either.
- The current database access buffers a full PDF; temporary upload files do not make end-to-end processing streaming. Check peak memory under representative concurrent uploads/downloads.
- Backups, restore times, binary logs, and database disk capacity will grow. Document these operational implications and verify backup/restore preserves bytes.

## 6. Connection Reuse and Reference Replacement

Keep the existing database module and `mysql` pool. Extend `deleteEntity(opts)` and `updateEntity(opts)` with an optional `opts.connection`; use the existing `cquery(connection, options)` rather than introducing a separate database layer or transaction engine.

### Helper Contract

- With a supplied connection, execute helper-owned SQL through `cquery` on that connection. Do not acquire another connection or release the supplied one.
- Without a supplied connection, preserve current behavior: `updateEntity` uses pooled `query`, and `deleteEntity` acquires a pooled connection for its checks and deletion.
- `deleteEntity` must release a connection it acquired in `finally`, including validation returns and query failures. The caller owns the lifetime of a supplied connection.
- Preserve existing arguments, result shapes, authorization predicates, dependency checks, and validation behavior. Do not change every existing call site.
- Existing preparation/validation callbacks may issue their own pooled queries. This optional parameter does not implicitly redirect callback queries; no callback API redesign is required for this non-transactional feature.
- Neither helper starts, commits, or rolls back a transaction. Connection reuse alone does not provide atomicity.

### Replacement Sequence

Use one connection acquired from the existing pool, sequential awaited queries, and normal autocommit. This permits reuse of `deleteEntity` without its acquiring another connection:

1. Validate source and target IDs, reject self-replacement, and confirm both references exist using `cquery`.
2. Reassign existing `import`, `data`, `trait`, and `method` links from source to target using `cquery`.
3. If source has a PDF and target has none, update the attachment's `reference_id`; preserve its ID, filename, bytes, size, and upload timestamp.
4. If both have PDFs, leave the target unchanged. Leave the source PDF attached until the source reference is successfully deleted and its foreign-key cascade discards it.
5. Call `deleteEntity` with the supplied connection and existing reference dependencies (`data`, `import`, `trait`, `method`). Propagate validation results or errors; do not report success if deletion fails.
6. Release the caller-owned connection in `finally` on every exit path.

Do not add transactions, `SELECT ... FOR UPDATE`, shared locking conventions for attachment endpoints, compensating rollback, or automatic retries. Attachment PUT/DELETE can continue using ordinary pooled queries.

Accepted limitation: a late failure can leave links reassigned or a PDF transferred while the source reference still exists. Sharing hardware does not prevent SQL errors or process failures. Report failure honestly; diagnosis and manual correction are acceptable for this version. Do not promise all-or-nothing replacement or concurrent-operation safety.

Update the replacement dialog's confirmation to state the transfer/discard rule. Preserve order-aware navigation when returning to the target reference; the current detail component uses an unscoped `/references/${id}` path and should use the valid current-order route for this touched workflow.

## 7. Frontend Integration

- Add a compact attachment area to reference detail, following existing Vuetify styling and icon conventions.
- Use the existing session state/getter to show the area only while logged in. Fetch metadata only in that state; no PDF icon, filename, or availability request for anonymous viewers.
- All logged-in users can download an existing PDF. Editors additionally see upload, replace, and delete actions; contributors without editor privileges cannot mutate it.
- Show filename and formatted size. Use an explicit empty state for logged-in users when no attachment exists.
- Reuse `UploadForm.vue` for PDF selection with `accept=".pdf,application/pdf"` and `:max-file-size="20 * 1024 * 1024"`. Server validation remains authoritative.
- Upload with `FormData`, field `pdf`, through the shared Axios `put` path. Let the browser set multipart boundaries; do not manually set `Content-Type`.
- Keep reference-specific attachment actions in a small local store module/helper or narrowly scoped extension of the existing entity module. Do not add PDF behavior to unrelated entities.
- Download using an authenticated same-origin link built from the configured backend base URL. Verify session cookies in the actual deployment/dev setup. Do not use the generic JSON-oriented `get` action for file bytes.
- Disable duplicate actions during requests, show pending/error states, and refresh metadata only after successful writes. Preserve the previous visible attachment on failed upload.
- Confirm deletion and replacement of an existing PDF. Reference replace-and-delete uses the rule in section 6.
- Clear attachment state on reference change or logout; ignore stale metadata responses after either transition. Do not keep downloaded PDF bytes in Vuex or persist metadata locally.
- Upload is available after a reference has been saved and has an ID. Keep normal reference creation/editing as JSON without file content or attachment-only fields.
- Leave `entity-props.js` and public reference table responses unchanged. The initial feature lives in detail; a per-row PDF indicator would require a separately designed authenticated metadata listing and is not necessary here.
- Refactor `UploadForm.vue` with an `accept` string prop defaulting to its current CSV/Excel accept string and a `maxFileSize` number prop in bytes defaulting to `100 * 1024 * 1024`. Existing dataset callers need no changes.
- Bind the input and validation rules to these props, with an inclusive `file.size <= maxFileSize` check. This intentionally also accepts exactly 100 MiB for datasets, where the current frontend uses a strict less-than check; verify the dataset backend accepts that boundary.
- Make the hard-coded format/size description and dataset-specific input label configurable with their current text as defaults. Pass PDF-specific text from reference detail, and derive size hints/errors from `maxFileSize` so the PDF form never advertises CSV/Excel or 100 MB.
- Preserve the form's existing `upload` event carrying the selected File and its `hide` event. Keep transport, endpoint selection, and reference state in the parent/store, not in the shared form. No separate PDF upload form is needed.

## 8. Verification and Acceptance Criteria

Use existing test conventions where practical. The backend currently has no working general test script; do not present `npm test` as a passing gate. Add focused automated tests for this feature, using Node's test tooling if supported by the selected runtime, and document exact commands. Use a disposable MySQL/MariaDB database for integration tests, never production.

### Backend and Database

- Migration works on an existing schema; references without PDFs remain unchanged. Unique reference constraint rejects a second attachment row.
- Upload, metadata, and download round-trip a valid PDF byte-for-byte; compare hashes. No attachment content appears in reference JSON or logs.
- Exact 20 MiB succeeds; 20 MiB plus one byte, truncated files, zero bytes, missing files, multiple files, invalid IDs, and non-PDF content fail with the documented statuses.
- Test MIME spoofing, generic MIME on valid PDFs, path-like filenames, and unsafe header characters.
- Anonymous users cannot get metadata/downloads or write, even with a direct URL. A logged-in non-editor can read but gets `403` on PUT/DELETE. Editors can perform all attachment operations.
- Failed uploads preserve the existing file. Temporary files are removed on success, rejection, database error, and aborted upload.
- Attachment deletion is idempotent; reference deletion cascades only on success. A blocked reference deletion leaves its PDF intact.
- Reference replacement covers all four source/target attachment-presence combinations. Target bytes always win when both exist.
- Test self-replacement, missing target, and reassignment of trait/method links. Inject a late query/deletion failure and verify error propagation and connection release; partial updates are allowed and no rollback is expected.
- Test `deleteEntity` and `updateEntity` with and without `opts.connection`: supplied connections are used but never acquired/released by the helper; internally acquired connections are released on success, validation failure, and query error. Existing callers and result shapes remain compatible.
- No same-entity concurrency guarantee or locking test suite is required. Retain the database unique and foreign-key constraints.
- Verify actual packet/proxy limits with the maximum-size upload, and backup/restore byte integrity in a disposable environment.

### Frontend

- Exercise anonymous, logged-in non-editor, and editor states, including session expiry and logout while metadata is loading.
- Verify initial upload, replacement, download, deletion, cancellation, validation failure, server rejection, and reference switching during requests.
- Confirm ordinary reference CRUD, DOI links, order-scoped navigation, dataset upload, and reference replacement still work.
- Test the shared upload form with default dataset props and PDF overrides: accepted types, label/help text, required-file validation, exact size limit, one byte over the limit, and unchanged `upload`/`hide` events. Ensure validation reads current prop values rather than capturing only their initial values.
- Build the frontend and check editor diagnostics for touched files. Run the app and inspect desktop/mobile layout for wrapping, action overflow, and loading states.

## 9. Handoff Sequence and Scope

1. Backend/schema owner: implement migration, configuration, attachment API, redacted logging, optional connection support in the two existing CRUD helpers, non-transactional replacement, and focused backend/integration tests.
2. Frontend owner: consume the agreed endpoint/metadata contract, implement detail controls and replacement confirmation, and verify role/session behavior.
3. Integration owner: run full workflow checks, maximum-size and connection-lifecycle tests, update `docs/api.md` and relevant editor/deployment documentation, and record verification results.

This sequence defines work packages for future agents; it does not require concurrent edits or authorize production migrations. Keep unrelated authentication, dataset upload, taxonomy, and generic CRUD refactors beyond the optional connection support above out of scope.

Deploy the additive schema migration and verify database/proxy settings before enabling the API and UI. A code rollback can leave the unused table in place; do not drop stored PDFs automatically. Report any unexecuted integration, security, or operational checks explicitly at handoff.
