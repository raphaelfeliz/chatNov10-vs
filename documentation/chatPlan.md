# Helpers

## ✅ debugLog(step, value)
Centralized debug logger for structured step-by-step tracing.  
Prints: `[DEBUG] <step> | value: <stringified data>`

---

## ✅ nowId()
Generates a unique message ID and timestamp.  
Returns `(id: String, timestamp: Timestamp)` — both derived from `CURRENT_TIMESTAMP()`.

---

## ✅ buildMessage(role, text, link?)
Constructs and returns a `Message` object with:
- unique id/timestamp from `nowId()`
- proper `bubbleVariant` based on `role`
- optional link (default `null`)

Variants include:
`human-message`, `ai-message`, `system-message`, `assistant-message`, `error-message`

---

## ✅ mergeNonEmptyContact(base, patch)
Updates an existing `ContactInfo` object only with **non-empty** values from another.  
Skips null or empty strings.

---

## ✅ facetUpdate(update)
Applies facet updates to the global `facets` object, **only overwriting non-null data**.

---

## ⌛ CURRENT_TIMESTAMP()
Returns the current timestamp in a consistent format (numeric or ISO).  
Used by `nowId()` to generate time-based IDs.

---

## ⌛ TO_STRING(value)
Converts any data into a compact string form for debug logging.  
Used internally by `debugLog()`.

---

## ⌛ GET_VALUE(element)
Retrieves and returns the text value from an input element (e.g. `userInputField`).

---

## ⌛ CLEAR(element)
Clears or resets the provided input element’s value.  
Used in `newMessageListener` after message send.

---

## ⌛ LENGTH(collection)
Returns the number of items in a list, array, or map.  
Used for logging message database size.


# Nodes

---

## newMessageNode.ts

### ✅ newMessageListener(event)
Trigger: runs when the user presses **Enter** or clicks **Send** in the chat.  
Steps:
1. Logs start event and trigger type.  
2. Reads `userInputField` value using `GET_VALUE(element)`.  
3. Trims and checks if empty — exits early if so.  
4. Builds a `Message` via `buildMessage("human", text)`.  
5. Logs and passes the message to `newMessageHandler(msg)`.  
6. Clears the input field with `CLEAR(element)`.

---

## messageHandlerNode.ts

### ✅ newMessageHandler(msg)
Purpose: stores messages and coordinates next actions.  
Steps:
1. Logs start and message data.  
2. Appends message to `messageDatabase`.  
3. Logs current database size using `LENGTH(messageDatabase)`.  
4. If `talkToSpecialist = true`, calls `talkToSpecialistHandler(contactInformation)`.  
5. Else, if the message role is `"human"`, calls `aiPrompter(msg)`.  
6. Logs and exits.

---

## aiPrompterNode.ts

### ✅ aiPrompter(userMsg)
Purpose: builds prompt data for AI and processes the response.  
Steps:
1. Logs start and received message.  
2. Builds `aiPromptObj` with:
   - system instruction  
   - user message  
   - `kb.yaml`  
   - filtered products  
3. Logs the prompt.  
4. Calls `mockAiResponse(prompt)` (temporary mock).  
5. Logs returned `aiReplyObj`.  
6. Builds bot message with `buildMessage("bot", aiReplyObj.aiReplyText)` and calls `newMessageHandler(aiReplyMessage)`.  
7. Calls `facetUpdate(aiReplyObj.facetUpdateObj)` to update product filters.  
8. Updates `contactInformation` using `mergeNonEmptyContact()`.  
9. If `talkToSpecialist = true`, calls `talkToSpecialistHandler(contactInformation)`.  
10. Logs and exits.

---

### ✅ mockAiResponse(prompt)
Purpose: temporary mock function simulating AI reply.  
Returns:
- `aiReplyText` (string)
- `facetUpdateObj` (mocked product facet updates)
- `contactInformationObj` (empty placeholders)
- `talkToSpecialist` (boolean flag)

---

## specialistHandoffNode.ts

### ✅ talkToSpecialistHandler(info)
Purpose: manage the human handoff flow for specialized support.  
Steps:
1. Logs start and received `contactInformation`.  
2. If `info.userName` is empty or null →  
   calls `newMessageHandler(buildMessage("bot", "Com quem eu falo?"))`.  
3. Else if both `info.userPhone` and `info.userEmail` are empty →  
   calls `newMessageHandler(buildMessage("bot", "Vou te passar para um especialista, qual seu email ou whatsapp?"))`.  
4. Else →  
   Creates a WhatsApp link using the following logic:
   - Starts message: `"Olá, sou {userName}."`
   - If at least one facet field in `facets` is filled:
     - Append: `"Tenho interesse em:"` followed by a formatted list of filled facet labels and values.
   - Else:
     - Append: `"Tenho interesse em esquadrias."`
   - Encode the full message and build final link:  
     `https://api.whatsapp.com/send?phone=5511976810216&text=<encodedMessage>`
   - Builds a **bot message** with that link and a **bubble variant of `"whatsappLink"`**,  
     then calls `newMessageHandler(buildMessage("bot", whatsappLink, null, "whatsappLink"))`.  
5. Logs and exits.


