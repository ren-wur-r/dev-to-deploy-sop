# BCCS ProjectManagerSystem -- 需求管理模組規格書

v1.1 | 2026-04-07

---

## 一、模組定位

提供公司內部各部門向 MIS 提出 IT 需求的統一入口，取代目前透過 Teams 訊息、口頭溝通等非結構化方式。所有需求都有明確的申請人、處理人、進度狀態與完成紀錄。

## 二、適用場景

| # | 場景 | 申請人 | 處理人 | 範例 |
|---|------|--------|--------|------|
| 1 | 環境申請 | RD | MIS | 新專案需要 Dev/Staging 環境、Port 配發、Runner 安裝 |
| 2 | 網路需求 | 任何部門 | MIS | 防火牆規則變更、VPN 帳號申請、網路存取權限 |
| 3 | 新人設備 | HR | MIS | 新進員工電腦設置、帳號開通、軟體安裝、郵件帳號 |
| 4 | 離職回收 | HR | MIS | 帳號停用、設備回收、權限移除 |
| 5 | 軟體安裝 | 任何部門 | MIS | 申請安裝特定軟體、授權啟用 |
| 6 | 權限變更 | 主管 | MIS | 系統權限調整、共用資料夾存取 |
| 7 | 其他 IT 需求 | 任何部門 | MIS | 印表機設定、其他 MIS 支援事項 |
| 8 | 設備報修 | 任何部門 | MIS | 電腦故障、螢幕損壞、印表機異常、網路不通 |
| 9 | 資料備份/還原 | RD/主管 | MIS | DB 還原到特定時間點、備份排程調整 |
| 10 | 帳號解鎖/密碼重設 | 任何部門 | MIS | AD 帳號鎖定、忘記密碼、MFA 重設 |
| 11 | 部門調動 IT 處理 | HR | MIS | 權限搬遷、信箱群組異動、共用資料夾調整 |
| 12 | 外部服務申請 | RD/主管 | MIS | 第三方 SaaS 帳號、雲端服務開通、API Key 申請 |

## 三、系統架構（符合現有專案規範）

### 3.1 命名規範

依照 `程式碼縮寫規範.txt`，本模組縮寫定義：

| 全名 | 縮寫 |
|------|------|
| Request（需求） | Req |
| RequestTicket（需求單） | Rqt |
| RequestCategory（需求類別） | Rqc |

### 3.2 後端分層

```
BackEnd/ProjectManagerSystem/
├── DataModelLibrary/EfCore/ProjectManagerMain/
│   ├── EmployeeRequestTicket.cs          # 需求單主表
│   ├── EmployeeRequestTicketItem.cs      # 需求單項目明細
│   └── ManagerRequestCategory.cs         # 需求類別主檔
├── ApiModelLibrary/ManagerBackSite/Request/
│   ├── Ctl/                              # Controller 層 Model
│   │   ├── MbsReqRqtCtlAddReqMdl.cs
│   │   ├── MbsReqRqtCtlAddRspMdl.cs
│   │   ├── MbsReqRqtCtlGetOneReqMdl.cs
│   │   ├── MbsReqRqtCtlGetOneRspMdl.cs
│   │   ├── MbsReqRqtCtlGetManyReqMdl.cs
│   │   ├── MbsReqRqtCtlGetManyRspMdl.cs
│   │   ├── MbsReqRqtCtlUpdateStatusReqMdl.cs
│   │   └── MbsReqRqtCtlUpdateStatusRspMdl.cs
│   └── Lgc/                              # Logical 層 Model
│       ├── MbsReqRqtLgcAddReqMdl.cs
│       ├── MbsReqRqtLgcAddRspMdl.cs
│       └── ...（與 Ctl 對應）
├── ServiceLibrary/
│   ├── CoReqRequestTicketDbService.cs     # DB 操作
│   ├── ICoReqRequestTicketDbService.cs    # Interface
│   ├── MbsReqRqtLogicalService.cs        # 商業邏輯
│   └── IMbsReqRqtLogicalService.cs       # Interface
└── ProjectManagerWebApi/Controllers/ManagerBackSite/
    └── MbsRequestTicketController.cs      # API Controller
```

### 3.3 前端分層

```
FrontEnd/manager-back-site/src/
├── views/request/
│   ├── RequestTicketListView.vue          # 需求單列表頁
│   ├── RequestTicketAddView.vue           # 新增需求單頁
│   └── RequestTicketDetailView.vue        # 需求單詳情頁（含狀態更新）
├── composables/
│   └── useRequestTicket.ts                # 需求單相關組合函式
├── services/request/
│   ├── MbsReqRqtHttpService.ts            # HTTP 呼叫
│   └── MbsReqRqtHttpMdl.ts               # HTTP Model 定義
├── constants/
│   └── requestEnums.ts                    # 需求相關 Enum
└── router/
    └── requestRoutes.ts                   # 路由定義
```

## 四、資料庫設計

### 4.1 ManagerRequestCategory（需求類別主檔）

| 欄位 | 型別 | 說明 |
|------|------|------|
| ManagerRequestCategoryId | int [PK, Identity] | 類別 ID |
| CategoryName | nvarchar(100) | 類別名稱 |
| CategoryCode | varchar(50) | 類別代碼（ENV_REQUEST / NETWORK / NEW_HIRE / OFFBOARD / SOFTWARE / PERMISSION / OTHER） |
| DefaultAssignDepartment | nvarchar(50) | 預設指派部門（如 MIS） |
| SortOrder | int | 排序 |
| IsEnable | bit | 是否啟用 |
| TemplateFields | nvarchar(max) | 該類別的欄位模板（JSON 格式，定義該類別申請表需要填哪些欄位） |
| CreateEmployeeId | int [FK] | 建立人 |
| CreateDateTime | datetime2 | 建立時間 |
| UpdateEmployeeId | int [FK] | 更新人 |
| UpdateDateTime | datetime2 | 更新時間 |

**預設資料（Seed）：**

| CategoryCode | CategoryName | TemplateFields（簡述） |
|--------------|-------------|----------------------|
| ENV_REQUEST | 環境申請 | 專案名稱、用途、部署方式(IIS/Docker/K8s)、技術棧、DB需求、Port需求、Volume需求、存取權限、SSL、GitHub Repo |
| NETWORK | 網路需求 | 需求描述、來源IP、目的IP、Port、協定、預計開通時間 |
| NEW_HIRE | 新人設備 | 員工姓名、到職日、部門、職位、需要的設備清單、需要的軟體清單、需要的系統帳號清單 |
| OFFBOARD | 離職回收 | 員工姓名、離職日、需回收設備、需停用帳號 |
| SOFTWARE | 軟體安裝 | 軟體名稱、版本、用途說明、授權方式 |
| PERMISSION | 權限變更 | 系統名稱、目前權限、申請權限、變更原因 |
| OTHER | 其他 IT 需求 | 需求描述 |
| EQUIPMENT_REPAIR | 設備報修 | 設備類型(電腦/螢幕/印表機/網路設備/其他)、設備編號(選填)、故障描述、故障發生時間、所在位置(樓層/座位) |
| DATA_BACKUP | 資料備份/還原 | 操作類型(備份/還原)、資料庫名稱、目標時間點(還原用)、原因說明、影響範圍 |
| ACCOUNT_UNLOCK | 帳號解鎖/密碼重設 | 帳號類型(AD/Email/VPN/其他系統)、帳號名稱、問題描述(鎖定/忘記密碼/MFA重設) |
| DEPT_TRANSFER | 部門調動 IT 處理 | 員工姓名、原部門、新部門、調動生效日、需搬遷項目(multi-checkbox: AD群組/Email群組/共用資料夾/系統權限/其他) |
| EXTERNAL_SERVICE | 外部服務申請 | 服務名稱、服務類型(SaaS帳號/雲端服務/API Key/其他)、用途說明、預計使用人數、費用預估(選填)、需要的權限等級 |

### 4.2 EmployeeRequestTicket（需求單主表）

| 欄位 | 型別 | 說明 |
|------|------|------|
| EmployeeRequestTicketId | int [PK, Identity] | 需求單 ID |
| TicketNo | varchar(20) | 單號（自動產生，格式：RQ-YYYYMMDD-NNN） |
| ManagerRequestCategoryId | int [FK] | 需求類別 |
| Subject | nvarchar(200) | 主旨 |
| Description | nvarchar(max) | 詳細說明 |
| FormData | nvarchar(max) | 依類別模板填寫的欄位資料（JSON） |
| Priority | tinyint | 優先度（1=一般, 2=急件, 3=緊急） |
| Status | tinyint | 狀態（見 4.4） |
| RequestEmployeeId | int [FK] | 申請人 |
| RequestDepartmentId | int [FK] | 申請人部門 |
| AssignEmployeeId | int [FK, Nullable] | 指派處理人 |
| AssignDepartmentId | int [FK, Nullable] | 指派部門 |
| ExpectDate | date [Nullable] | 期望完成日 |
| CompleteDate | datetime2 [Nullable] | 實際完成時間 |
| CompleteNote | nvarchar(max) [Nullable] | 完成備注（MIS 回覆的環境資訊等） |
| RejectReason | nvarchar(500) [Nullable] | 退回原因 |
| CreateDateTime | datetime2 | 建立時間 |
| UpdateEmployeeId | int [FK] | 更新人 |
| UpdateDateTime | datetime2 | 更新時間 |
| Version | int | 樂觀鎖版本號 |

### 4.3 EmployeeRequestTicketItem（需求單項目明細）

| 欄位 | 型別 | 說明 |
|------|------|------|
| EmployeeRequestTicketItemId | int [PK, Identity] | 項目 ID |
| EmployeeRequestTicketId | int [FK] | 需求單 ID |
| ItemName | nvarchar(200) | 項目名稱（如：配發 Port 號、安裝 Runner、建立 DB） |
| IsComplete | bit | 是否完成 |
| CompleteEmployeeId | int [FK, Nullable] | 完成人 |
| CompleteDateTime | datetime2 [Nullable] | 完成時間 |
| Note | nvarchar(500) [Nullable] | 備注（如：Port 8080 已配發） |
| SortOrder | int | 排序 |

### 4.4 狀態流轉

```
Draft（草稿）→ Submitted（已送出）→ Processing（處理中）→ Completed（已完成）
                    ↓                      ↓
               Rejected（退回）      Cancelled（取消）
```

| 狀態值 | 名稱 | 說明 | 操作人 |
|--------|------|------|--------|
| 0 | Draft | 草稿，申請人尚未送出 | 申請人 |
| 1 | Submitted | 已送出，等待指派 | 申請人 |
| 2 | Processing | 處理中，已指派處理人 | MIS |
| 3 | Completed | 已完成 | MIS |
| 4 | Rejected | 退回，需補充資訊 | MIS |
| 5 | Cancelled | 取消 | 申請人 |

**狀態轉換規則：**

| 目前狀態 | 可轉換至 | 操作人 |
|----------|---------|--------|
| Draft | Submitted, Cancelled | 申請人 |
| Submitted | Processing, Rejected | MIS |
| Processing | Completed, Rejected | MIS |
| Rejected | Submitted（修改後重送）, Cancelled | 申請人 |

## 五、API 設計

### 5.1 Controller

```csharp
[Route("api/[controller]/[action]")]
[ApiController]
public class MbsRequestTicketController : ControllerBase
```

### 5.2 端點列表

| 方法 | Action | 權限 | 說明 |
|------|--------|------|------|
| POST | GetMany | View | 取得需求單列表（含篩選、分頁） |
| POST | GetOne | View | 取得單筆需求單詳情 |
| POST | Add | Create | 新增需求單 |
| POST | Update | Edit | 更新需求單內容（Draft / Rejected 狀態） |
| POST | Submit | Edit | 送出需求單（Draft/Rejected → Submitted） |
| POST | Assign | Edit | 指派處理人（Submitted → Processing） |
| POST | UpdateItemStatus | Edit | 更新單一項目完成狀態 |
| POST | Complete | Edit | 完成需求單（Processing → Completed） |
| POST | Reject | Edit | 退回需求單（Submitted/Processing → Rejected） |
| POST | Cancel | Edit | 取消需求單（Draft/Submitted → Cancelled） |
| POST | GetCategoryList | View | 取得需求類別列表 |

### 5.3 GetMany 篩選條件

```csharp
public class MbsReqRqtCtlGetManyReqMdl
{
    [JsonPropertyName("a")]
    public string EmployeeLoginToken { get; set; }

    [JsonPropertyName("b")]
    public string? SearchText { get; set; }         // 模糊搜尋：單號、主旨

    [JsonPropertyName("c")]
    public int? CategoryId { get; set; }             // 篩選類別

    [JsonPropertyName("d")]
    public byte? Status { get; set; }                // 篩選狀態

    [JsonPropertyName("e")]
    public int? RequestEmployeeId { get; set; }      // 篩選申請人（我的申請）

    [JsonPropertyName("f")]
    public int? AssignEmployeeId { get; set; }       // 篩選處理人（我的待辦）

    [JsonPropertyName("g")]
    public int PageIndex { get; set; }

    [JsonPropertyName("h")]
    public int PageSize { get; set; }
}
```

### 5.4 Complete 回覆

```csharp
public class MbsReqRqtCtlCompleteReqMdl
{
    [JsonPropertyName("a")]
    public string EmployeeLoginToken { get; set; }

    [JsonPropertyName("b")]
    public int EmployeeRequestTicketId { get; set; }

    [JsonPropertyName("c")]
    public string CompleteNote { get; set; }          // MIS 回覆的環境資訊、Port 號等

    [JsonPropertyName("d")]
    public int Version { get; set; }                  // 樂觀鎖
}
```

## 六、前端頁面規格

### 6.1 需求單列表頁（RequestTicketListView.vue）

**路由**：`/request/ticket`

**功能：**
- 上方篩選列：搜尋文字、類別下拉、狀態下拉、「我的申請」/「我的待辦」快捷篩選
- 表格欄位：單號、類別、主旨、申請人、處理人、優先度、狀態、申請日期
- 點擊列進入詳情頁
- 右上角「新增需求單」按鈕
- 分頁元件（使用現有 Pagination 元件）
- 狀態以顏色標籤顯示

**狀態顏色（Tailwind）：**

| 狀態 | 文字色 | 背景色 |
|------|--------|--------|
| Draft | text-gray-600 | bg-gray-100 |
| Submitted | text-blue-600 | bg-blue-100 |
| Processing | text-yellow-600 | bg-yellow-100 |
| Completed | text-green-600 | bg-green-100 |
| Rejected | text-red-600 | bg-red-100 |
| Cancelled | text-gray-400 | bg-gray-50 |

### 6.2 新增需求單頁（RequestTicketAddView.vue）

**路由**：`/request/ticket/add`

**流程（兩步驟）：**

**Step 1 -- 選擇類別與填寫基本資訊**
- 類別選擇（卡片式，點選後展開該類別的欄位模板）
- 主旨（必填）
- 詳細說明（選填）
- 優先度（一般/急件/緊急）
- 期望完成日（DatePickerInline）

**Step 2 -- 依類別填寫專屬欄位 + 預覽**
- 根據所選類別的 TemplateFields 動態渲染表單欄位
- 項目明細（可新增/刪除，每項為一個 checklist item，如「配發 Port 號」「安裝 Runner」）
- 預覽所有填寫內容
- 「儲存草稿」或「送出」按鈕

**環境申請（ENV_REQUEST）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 專案名稱 | text | Y | |
| 用途 | select | Y | 產品系統 / Demo 站 / 內部工具 / API 服務 |
| 部署方式 | select | Y | IIS / Docker / K8s |
| 所需環境 | multi-select | Y | Dev / Staging / Production |
| 技術棧 | text | Y | 如 .NET 8 / Node.js 20 |
| DB 需求 | select | N | SQL Server / PostgreSQL / MySQL / 不需要 |
| Volume 需求 | textarea | N | 列出用途與路徑 |
| Port 需求 | text | N | 由 MIS 配發（預設） |
| 存取權限 | select | Y | 僅內網 / 特定 IP / 對外 |
| SSL 憑證 | text | N | 域名 |
| GitHub Repo | text | Y | repo 網址 |

**新人設備（NEW_HIRE）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 員工姓名 | text | Y | |
| 到職日 | date | Y | |
| 部門 | select | Y | 從部門主檔帶入 |
| 職位 | text | Y | |
| 設備清單 | multi-checkbox | Y | 筆電 / 桌機 / 螢幕 / 鍵盤滑鼠 / 耳機 |
| 軟體清單 | multi-checkbox | N | Office / Visual Studio / VS Code / Node.js / .NET SDK / SSMS / 其他 |
| 帳號清單 | multi-checkbox | Y | AD 帳號 / Email / VPN / GitHub / Teams / 其他系統 |

**設備報修（EQUIPMENT_REPAIR）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 設備類型 | select | Y | 電腦 / 螢幕 / 印表機 / 網路設備 / 其他 |
| 設備編號 | text | N | 資產編號（如有） |
| 故障描述 | textarea | Y | 詳細描述故障狀況 |
| 故障發生時間 | datetime | Y | |
| 所在位置 | text | Y | 樓層/座位編號 |

**資料備份/還原（DATA_BACKUP）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 操作類型 | select | Y | 備份 / 還原 |
| 資料庫名稱 | text | Y | |
| 目標時間點 | datetime | N | 還原時需指定（操作類型為還原時必填） |
| 原因說明 | textarea | Y | |
| 影響範圍 | textarea | Y | 說明受影響的系統或服務 |

**帳號解鎖/密碼重設（ACCOUNT_UNLOCK）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 帳號類型 | select | Y | AD / Email / VPN / 其他系統 |
| 帳號名稱 | text | Y | |
| 問題描述 | select | Y | 帳號鎖定 / 忘記密碼 / MFA 重設 |

**部門調動 IT 處理（DEPT_TRANSFER）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 員工姓名 | text | Y | |
| 原部門 | select | Y | 從部門主檔帶入 |
| 新部門 | select | Y | 從部門主檔帶入 |
| 調動生效日 | date | Y | |
| 需搬遷項目 | multi-checkbox | Y | AD 群組 / Email 群組 / 共用資料夾 / 系統權限 / 其他 |

**外部服務申請（EXTERNAL_SERVICE）類別的專屬欄位：**

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| 服務名稱 | text | Y | 如 AWS、Azure、Jira |
| 服務類型 | select | Y | SaaS 帳號 / 雲端服務 / API Key / 其他 |
| 用途說明 | textarea | Y | |
| 預計使用人數 | number | N | |
| 費用預估 | text | N | 月費/年費 |
| 需要的權限等級 | select | Y | 唯讀 / 一般使用 / 管理員 |

### 6.3 需求單詳情頁（RequestTicketDetailView.vue）

**路由**：`/request/ticket/:id`

**版面配置：**

**上方 -- 基本資訊區**
- 單號、類別標籤、狀態標籤、優先度
- 申請人、申請部門、申請日期
- 處理人、期望完成日、實際完成日

**中間 -- 申請內容區**
- 主旨、詳細說明
- 依類別渲染的專屬欄位資料（唯讀顯示）

**下方 -- 處理進度區**
- 項目 checklist（每項顯示：名稱、完成狀態、完成人、完成時間、備注）
- MIS 登入時可勾選項目完成、填寫備注（如「Port 8080 已配發」）
- 完成備注區（MIS 完成時填寫的環境資訊回覆）

**操作按鈕（依狀態與角色顯示）：**

| 狀態 | 申請人可操作 | MIS 可操作 |
|------|-------------|-----------|
| Draft | 編輯、送出、取消 | -- |
| Submitted | -- | 指派處理人、退回 |
| Processing | -- | 更新項目進度、完成、退回 |
| Rejected | 編輯後重送、取消 | -- |
| Completed | 查看 | 查看 |
| Cancelled | 查看 | 查看 |

## 七、權限設計

### 7.1 選單權限

新增至 `DbAtomMenuEnum`：

| MenuId | 名稱 | 說明 |
|--------|------|------|
| 新編號 | RequestTicket | 需求單管理 |
| 新編號 | RequestCategory | 需求類別管理（系統管理用） |

### 7.2 權限矩陣

| 角色 | 需求單 View | 需求單 Create | 需求單 Edit | 需求單 Delete |
|------|------------|--------------|------------|--------------|
| 一般員工 | 僅自己的 | Y | 僅自己的（Draft/Rejected） | N |
| 主管 | 部門全部 | Y | 部門全部（Draft/Rejected） | N |
| MIS | 全部 | Y | 全部（含狀態操作） | N |
| 管理員 | 全部 | Y | 全部 | Y |

## 八、通知機制

| 事件 | 通知對象 | 方式 |
|------|---------|------|
| 需求單送出 | 指派部門（MIS） | 系統內通知（未來可串 Teams webhook） |
| 需求單被指派 | 處理人 | 系統內通知 |
| 需求單完成 | 申請人 | 系統內通知 |
| 需求單退回 | 申請人 | 系統內通知 |
| 項目進度更新 | 申請人 | 系統內通知 |

## 九、Migration 檔案

檔案命名：`2026_04_XX_AddRequestModule.sql`

放置路徑：`BackEnd/ProjectManagerSystem/DatabaseMigrations/Scripts/Migrate/`

包含：
1. CREATE TABLE ManagerRequestCategory
2. CREATE TABLE EmployeeRequestTicket
3. CREATE TABLE EmployeeRequestTicketItem
4. INSERT 預設類別資料（7 筆 Seed Data）

## 十、與 SOP 的關聯

本模組上線後，SOP「專案啟動 → 進度追蹤」Tab 的內容應更新：

- 「現階段：Teams 頻道追蹤」改為「已由內部專案管理系統取代」
- 「未來：內部專案管理系統」改為「現行方式」
- 環境申請表模板改為引導至系統的「新增需求單 → 環境申請」頁面

## 十一、開發優先序

| 階段 | 項目 | 說明 |
|------|------|------|
| Phase 1 | 需求單 CRUD + 狀態流轉 | 核心功能：建立、送出、指派、完成、退回 |
| Phase 1 | 環境申請類別 | 配合 SOP 使用 |
| Phase 1 | 新人設備類別 | 配合 HR 使用 |
| Phase 2 | 其餘類別 | 網路、離職、軟體、權限、其他 |
| Phase 2 | 項目 checklist 進度追蹤 | MIS 可逐項勾選完成 |
| Phase 3 | 通知機制 | 系統內通知 |
| Phase 3 | Teams Webhook 整合 | 送出/完成時推送 Teams 訊息 |
| Phase 3 | 儀表板統計 | 待處理數量、平均處理時間、各類別統計 |
