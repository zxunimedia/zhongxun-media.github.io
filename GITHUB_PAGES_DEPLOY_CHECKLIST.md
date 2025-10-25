# GitHub Pages 部署檢查清單
## 奇華智能行銷官網 → zxunimedia.github.io

### ✅ **必須上傳的文件**

#### 🔴 核心文件
- [ ] `index.html` (46KB) - 主網頁，包含完整內容和李孟居總經理照片
- [ ] `css/style.css` (39KB) - 包含AI科技風格和法律頁面樣式  
- [ ] `js/main.js` (25KB) - 包含互動功能和社群媒體追蹤
- [ ] `images/company-logo.png` (73KB) - 公司Logo圖片

#### 🟠 PWA功能文件
- [ ] `sw.js` (4KB) - Service Worker快取功能
- [ ] `manifest.json` (2KB) - PWA配置文件

#### 🟡 可選文檔
- [ ] `README.md` (10KB) - 專案完整說明
- [ ] `GOOGLE_ADS_COMPLIANCE.md` (4KB) - Google Ads合規報告

### 📂 **上傳目錄結構確認**
```
zxunimedia.github.io/
├── index.html                    ✅ 必須
├── sw.js                        ✅ 推薦
├── manifest.json                ✅ 推薦
├── css/
│   └── style.css               ✅ 必須
├── js/
│   └── main.js                 ✅ 必須
├── images/
│   └── company-logo.png        ✅ 必須
└── README.md                   ✅ 可選
```

### 🚀 **GitHub Pages 設定檢查**

#### 1. Repository 設定
- [ ] Repository 名稱: `zxunimedia.github.io`
- [ ] Repository 為 Public（GitHub Pages 需求）
- [ ] 已將文件上傳到 main/master 分支

#### 2. GitHub Pages 啟用
- [ ] 進入 Settings → Pages
- [ ] Source: Deploy from a branch
- [ ] Branch: main (或 master)
- [ ] Folder: / (root)
- [ ] 點擊 Save

#### 3. 自定義域名（可選）
- [ ] 如需使用自定義域名，在 Custom domain 填入
- [ ] 勾選 "Enforce HTTPS"

### 🌐 **部署後驗證檢查**

#### 基本功能測試
- [ ] 網站正常載入：`https://zxunimedia.github.io/`
- [ ] 導航欄功能正常
- [ ] 所有頁面區塊正常顯示
- [ ] 公司Logo正確顯示
- [ ] 李孟居總經理照片正確顯示

#### 互動功能測試  
- [ ] 聯絡表單功能正常
- [ ] 社群媒體連結有效
- [ ] 隱私政策頁面可正常開啟
- [ ] 服務條款頁面可正常開啟
- [ ] 粒子動畫背景正常運作

#### 響應式設計測試
- [ ] 桌面版顯示正常 (1200px+)
- [ ] 平板版顯示正常 (768px-1199px)
- [ ] 手機版顯示正常 (<768px)

#### 效能與SEO測試
- [ ] 載入速度正常（建議3秒內）
- [ ] Google Analytics 追蹤正常
- [ ] PWA 功能可用（可安裝為App）
- [ ] Service Worker 快取功能運作

### 📊 **預期結果**

#### 訪問網址
- **主要**: https://zxunimedia.github.io/
- **完整**: https://zxunimedia.github.io/index.html

#### 效能指標目標
- **載入時間**: < 3秒
- **首次內容繪製 (FCP)**: < 2秒  
- **最大內容繪製 (LCP)**: < 2.5秒
- **累積布局偏移 (CLS)**: < 0.1

#### SEO優化確認
- ✅ 完整Meta標籤
- ✅ Open Graph支援
- ✅ 結構化資料
- ✅ Google Analytics整合
- ✅ Google Ads合規性

### ⚠️ **常見問題解決**

#### 如果網站不顯示
1. 檢查 GitHub Pages 是否已啟用
2. 確認檔案名稱為 `index.html`（小寫）
3. 等待 5-10 分鐘讓 GitHub 處理部署
4. 檢查 repository 是否為 Public

#### 如果樣式不正常
1. 確認 `css/style.css` 文件路徑正確
2. 檢查文件是否完整上傳
3. 清除瀏覽器快取重新載入

#### 如果圖片不顯示
1. 確認 `images/company-logo.png` 已上傳
2. 檢查圖片檔案大小（GitHub 有 100MB 限制）
3. 確認圖片路徑大小寫正確

### 📞 **支援聯絡**
如有部署問題，可聯絡：
- GitHub Pages 文檔: https://docs.github.com/en/pages
- 技術支援: 透過 GitHub Issues 回報問題

---

✅ **檢查完成後即可開始部署！**

部署完成時間: _______________
網站上線確認: _______________  
效能測試完成: _______________

*© 2025 奇華智能行銷股份有限公司 - 成功部署到 zxunimedia.github.io* 🚀