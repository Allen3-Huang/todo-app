# Feature Specification: React 19 Todo App 核心功能

**Feature Branch**: `001-todo-app-core`  
**Created**: 2025-11-30  
**Status**: Draft  
**Input**: User description: "React 19 Todo App 核心功能：包含新增、刪除、編輯、切換完成狀態、篩選、統計和 LocalStorage 持久化"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 新增 Todo 項目 (Priority: P1)

使用者能夠在輸入框中輸入待辦事項的文字，按下 Enter 鍵後將新的 todo 項目加入清單中。新增的項目預設為未完成狀態，輸入框在新增後會自動清空，讓使用者可以繼續輸入下一個項目。

**Why this priority**: 這是 Todo App 最核心的功能，沒有新增功能整個應用程式就無法使用。使用者首先需要能夠建立待辦事項才能進行其他操作。

**Independent Test**: 可以透過在輸入框輸入文字並按 Enter 來獨立測試，驗證新項目出現在清單中且輸入框已清空。

**Acceptance Scenarios**:

1. **Given** 使用者在 Todo App 首頁，**When** 在輸入框輸入 "買牛奶" 並按 Enter，**Then** 清單中出現 "買牛奶" 項目且狀態為未完成，輸入框清空
2. **Given** 使用者在輸入框中，**When** 輸入空白內容並按 Enter，**Then** 不會新增任何項目
3. **Given** 使用者已有多個 todo 項目，**When** 新增一個 todo，**Then** 新項目出現在清單最下方

---

### User Story 2 - 切換 Todo 完成狀態 (Priority: P1)

使用者能夠透過勾選 checkbox 來標記待辦事項為已完成或未完成。這讓使用者可以追蹤哪些事項已經處理完畢。

**Why this priority**: 追蹤完成狀態是 Todo App 的核心價值，讓使用者能管理進度。

**Independent Test**: 可以透過點擊現有 todo 項目的 checkbox 來獨立測試，驗證狀態正確切換。

**Acceptance Scenarios**:

1. **Given** 有一個未完成的 todo 項目，**When** 使用者勾選該項目的 checkbox，**Then** 該項目狀態變為已完成，文字顯示刪除線並淡化顏色
2. **Given** 有一個已完成的 todo 項目，**When** 使用者取消勾選該項目的 checkbox，**Then** 該項目狀態變為未完成，文字恢復正常顯示

---

### User Story 3 - 刪除 Todo 項目 (Priority: P1)

使用者能夠刪除不再需要的待辦事項，讓清單保持整潔。每個 todo 項目都有一個刪除按鈕。

**Why this priority**: 刪除功能是基本的資料管理需求，使用者需要能移除錯誤輸入或不再需要的項目。

**Independent Test**: 可以透過點擊 todo 項目的刪除按鈕來獨立測試，驗證該項目從清單中移除。

**Acceptance Scenarios**:

1. **Given** 清單中有一個 todo 項目，**When** 使用者點擊該項目的刪除按鈕，**Then** 顯示確認對話框詢問是否刪除
2. **Given** 確認對話框已顯示，**When** 使用者確認刪除，**Then** 該項目從清單中消失
3. **Given** 確認對話框已顯示，**When** 使用者取消刪除，**Then** 該項目保留在清單中
4. **Given** 清單中有多個 todo 項目，**When** 使用者刪除其中一個並確認，**Then** 只有被刪除的項目消失，其他項目保持不變

---

### User Story 4 - 編輯 Todo 項目 (Priority: P2)

使用者能夠修改已存在的待辦事項內容。透過雙擊項目進入編輯模式，完成編輯後按 Enter 或點擊其他地方儲存修改，按 Esc 取消編輯。

**Why this priority**: 編輯功能讓使用者能修正錯誤或更新內容，提升使用體驗，但相較於基本 CRUD 操作優先級稍低。

**Independent Test**: 可以透過雙擊現有 todo 項目來獨立測試，驗證可以進入編輯模式並成功修改內容。

**Acceptance Scenarios**:

1. **Given** 清單中有一個內容為 "買牛奶" 的 todo，**When** 使用者雙擊該項目，**Then** 進入編輯模式，顯示可編輯的輸入框
2. **Given** 使用者在編輯模式中，**When** 修改內容為 "買豆漿" 並按 Enter，**Then** 項目內容更新為 "買豆漿" 且退出編輯模式
3. **Given** 使用者在編輯模式中，**When** 修改內容後按 Esc，**Then** 取消修改並恢復原本內容
4. **Given** 使用者在編輯模式中，**When** 修改內容後點擊輸入框外部（blur），**Then** 儲存修改並退出編輯模式

---

### User Story 5 - 篩選 Todo 項目 (Priority: P2)

使用者能夠根據完成狀態篩選顯示的 todo 項目。提供三種篩選選項：全部、未完成、已完成。

**Why this priority**: 篩選功能在項目數量增加後變得重要，幫助使用者聚焦在特定狀態的項目上。

**Independent Test**: 可以在有多個不同狀態的 todo 項目時，切換篩選選項來獨立測試，驗證顯示的項目正確。

**Acceptance Scenarios**:

1. **Given** 使用者首次進入應用程式，**When** 頁面載入完成，**Then** 篩選狀態預設為 "All"，顯示所有 todo 項目
2. **Given** 清單中有已完成和未完成的 todo，**When** 使用者點擊 "All" 篩選按鈕，**Then** 顯示所有 todo 項目
3. **Given** 清單中有已完成和未完成的 todo，**When** 使用者點擊 "Active" 篩選按鈕，**Then** 只顯示未完成的 todo 項目
4. **Given** 清單中有已完成和未完成的 todo，**When** 使用者點擊 "Completed" 篩選按鈕，**Then** 只顯示已完成的 todo 項目

---

### User Story 6 - 顯示未完成計數 (Priority: P2)

使用者能夠在畫面底部看到未完成待辦事項的數量，幫助了解還有多少工作待處理。

**Why this priority**: 統計功能提供使用者快速了解進度的方式，是良好使用體驗的一部分。

**Independent Test**: 可以透過新增、完成或刪除 todo 項目後觀察計數變化來獨立測試。

**Acceptance Scenarios**:

1. **Given** 清單中有 3 個未完成的 todo，**When** 使用者查看 footer，**Then** 顯示 "3 items left"
2. **Given** 清單中有 1 個未完成的 todo，**When** 使用者查看 footer，**Then** 顯示 "1 item left"（單數形式）
3. **Given** 使用者完成一個 todo，**When** 查看 footer，**Then** 計數減少 1

---

### User Story 7 - 清除已完成項目 (Priority: P3)

使用者能夠一次清除所有已完成的待辦事項，快速整理清單。

**Why this priority**: 批次刪除功能是便利性增強，使用者可以用單獨刪除替代，所以優先級較低。

**Independent Test**: 可以在有已完成項目時點擊 "Clear completed" 按鈕來獨立測試，驗證所有已完成項目被移除。

**Acceptance Scenarios**:

1. **Given** 清單中有 2 個已完成的 todo 和 1 個未完成的 todo，**When** 使用者點擊 "Clear completed" 按鈕，**Then** 2 個已完成的 todo 被移除，未完成的 todo 保留
2. **Given** 清單中沒有已完成的 todo，**When** 使用者查看 footer，**Then** "Clear completed" 按鈕可隱藏或禁用

---

### User Story 8 - 資料持久化 (Priority: P1)

使用者的 todo 資料在重新整理網頁後仍然保留，包含項目內容和完成狀態。

**Why this priority**: 資料持久化是應用程式可用性的基礎，沒有這個功能使用者每次都要重新輸入所有資料。

**Independent Test**: 可以透過新增 todo 後重新整理網頁來獨立測試，驗證資料正確載入。

**Acceptance Scenarios**:

1. **Given** 使用者已新增多個 todo 項目（部分已完成），**When** 重新整理網頁，**Then** 所有 todo 項目和其完成狀態都正確顯示
2. **Given** 使用者刪除一個 todo 項目，**When** 重新整理網頁，**Then** 被刪除的項目不會出現
3. **Given** 使用者編輯一個 todo 項目的內容，**When** 重新整理網頁，**Then** 顯示編輯後的內容

---

### Edge Cases

- 使用者輸入空白或只有空格的內容時，不應新增 todo 項目
- 使用者輸入非常長的文字時，UI 應自動換行顯示完整內容（項目高度會隨之增加）
- 使用者快速連續點擊刪除按鈕時，只應刪除對應的項目
- 使用者在編輯模式中清空內容並儲存時，應刪除該 todo 項目
- 使用者同時在多個瀏覽器標籤頁操作時，資料可能不同步（已知限制）
- LocalStorage 達到容量上限時，靜默失敗不儲存新資料但不影響當前操作

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須提供輸入框讓使用者輸入新的 todo 內容
- **FR-002**: 系統必須在使用者按 Enter 時新增 todo 項目（非空內容）
- **FR-003**: 新增的 todo 項目預設完成狀態為 false
- **FR-004**: 系統必須在新增 todo 後清空輸入框
- **FR-005**: 每個 todo 項目必須顯示刪除按鈕
- **FR-006**: 使用者點擊刪除按鈕後，系統必須移除該 todo 項目
- **FR-007**: 每個 todo 項目必須顯示 checkbox 供切換完成狀態
- **FR-008**: 系統必須在 checkbox 狀態變更時更新 todo 的完成狀態
- **FR-009**: 系統必須支援雙擊 todo 項目進入編輯模式
- **FR-010**: 系統必須在按 Enter 或 blur 時儲存編輯內容
- **FR-011**: 系統必須在按 Esc 時取消編輯並恢復原內容
- **FR-012**: 系統必須提供 All、Active、Completed 三個篩選按鈕
- **FR-013**: 系統必須根據選擇的篩選條件顯示對應的 todo 項目
- **FR-019**: 頁面載入時篩選狀態必須預設為 "All"
- **FR-014**: 系統必須在 footer 顯示未完成 todo 的數量
- **FR-015**: 系統必須提供 "Clear completed" 按鈕
- **FR-016**: 點擊 "Clear completed" 後系統必須移除所有已完成的 todo
- **FR-017**: 系統必須將所有 todo 資料儲存至瀏覽器本地儲存
- **FR-018**: 系統必須在頁面載入時從本地儲存讀取 todo 資料

### Accessibility Requirements (Constitution IV - NON-NEGOTIABLE)

- **AR-001**: 所有互動元素（輸入框、checkbox、按鈕）必須支援鍵盤操作
- **AR-002**: 所有表單輸入必須有關聯的標籤
- **AR-003**: 錯誤訊息必須能被螢幕閱讀器讀取
- **AR-004**: 完成狀態不能僅靠顏色區分（需有 checkbox 或其他視覺指示）
- **AR-005**: 篩選按鈕的當前選取狀態必須明確可辨識
- **AR-006**: 刪除操作必須顯示確認對話框以防止誤刪

### Security Requirements (Constitution V - NON-NEGOTIABLE)

- **SR-001**: 使用者輸入的 todo 內容必須進行適當處理以防止 XSS 攻擊
- **SR-002**: 本地儲存的資料不包含敏感資訊（todo 內容屬於使用者私人資料但非機密）
- **SR-003**: 系統不應在控制台輸出使用者的 todo 資料

### Key Entities *(include if feature involves data)*

- **Todo**: 代表一個待辦事項，包含唯一識別碼、標題文字、完成狀態
- **Filter**: 代表篩選狀態，可為 "all"、"active" 或 "completed"

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 使用者可在 2 秒內完成新增一個 todo 項目（輸入並按 Enter）
- **SC-002**: 使用者可在 1 秒內切換 todo 的完成狀態
- **SC-003**: 使用者可在 3 秒內完成編輯一個 todo 項目（雙擊、修改、儲存）
- **SC-004**: 頁面重新整理後資料載入時間不超過 1 秒
- **SC-005**: 篩選功能切換後 0.5 秒內完成畫面更新
- **SC-006**: 系統能正確處理至少 100 個 todo 項目而不影響效能
- **SC-007**: 90% 的使用者能在首次使用時完成基本操作（新增、完成、刪除）而無需說明

## Clarifications

### Session 2025-11-30

- Q: 已完成的 Todo 項目應該如何視覺呈現？ → A: 刪除線 + 淡化文字顏色（搭配 checkbox 勾選狀態）
- Q: 當使用者輸入非常長的 Todo 文字時，UI 應如何處理？ → A: 自動換行顯示完整內容
- Q: 當 localStorage 達到容量上限時，系統應如何處理？ → A: 靜默失敗，新資料不儲存但不影響操作
- Q: 刪除 Todo 項目時，是否需要確認對話框？ → A: 每次刪除都顯示確認對話框
- Q: 頁面初次載入時，預設的篩選狀態應該是什麼？ → A: 預設顯示「All」（全部項目）

## Assumptions

- 使用者使用現代瀏覽器，支援 localStorage 功能
- 應用程式為單人使用，無需考慮多使用者同步
- Todo 項目內容僅為純文字，不支援富文字或圖片
- 未完成計數的單複數形式使用英文（item/items）
- 編輯模式中若內容被清空，儲存時將刪除該 todo 項目
