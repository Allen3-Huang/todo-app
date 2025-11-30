# React 19 Todo App — 功能需求 PRD

## 1. 基本功能需求

### 1.1 新增 Todo

* 使用者可在輸入框輸入文字後按 Enter 新增一筆 todo。
* 新增的 todo 項目預設為未完成 (completed = false)。
* 新增後輸入框須自動清空。

### 1.2 刪除 Todo

* 每個 todo 項目需有刪除按鈕。
* 點擊刪除後，該 todo 從列表中移除。

### 1.3 切換完成狀態 (Toggle Complete)

* 每個 todo 都有完成狀態切換 (checkbox)。
* 勾選 → 設為完成
* 取消勾選 → 設為未完成

### 1.4 編輯 Todo

* 使用者可 double-click 進入編輯模式。
* 編輯結束後按 Enter 或 input blur 儲存修改。
* 使用者按 Esc 則取消編輯，內容恢復原狀。

## 2. 篩選與統計需求

### 2.1 Todo 篩選 Filter

需提供三種 filter button：

* All：顯示全部 todo
* Active：顯示未完成 todo
* Completed：顯示已完成 todo

### 2.2 顯示未完成計數

畫面 footer 要顯示：

* `<X> items left`

X = 未完成 todo 數量。

### 2.3 清除已完成項目（Clear Completed）

* Footer 必須提供 Clear completed 按鈕。
* 點擊後刪除所有 completed = true 的 todo。

## 3. 資料儲存需求

### 3.1 LocalStorage 持久化

* 所有 todo（含 title、completed 是否完成）都需要儲存到 localStorage。
* 使用者重新整理網頁後資料需正確載入。


