# 🚀 GitHub 部署完整指南

## 📁 專案檔案清單

您需要下載並上傳以下檔案到 GitHub：

### 必要檔案
1. `index.html` - 主頁面檔案
2. `css/style.css` - 樣式檔案
3. `js/main.js` - JavaScript 功能檔案
4. `images/company-logo.png` - 公司 Logo 檔案
5. `README.md` - 專案說明檔案

## 🔄 **方法 1: 網頁版上傳（最簡單）**

### 步驟 1: 創建 GitHub 倉庫
1. 登入 [GitHub](https://github.com)
2. 點擊右上角 "+" → "New repository"
3. 填寫資訊：
   - Repository name: `qihua-ai-website`
   - Description: `奇華智能行銷 AI科技感官網`
   - ✅ Public
   - ✅ Add a README file
4. 點擊 "Create repository"

### 步驟 2: 上傳檔案
1. 在新創建的倉庫頁面，點擊 "uploading an existing file"
2. 將所有專案檔案拖拽到上傳區域
3. 或點擊 "choose your files" 選擇檔案

### 步驟 3: 提交更改
1. 在頁面下方填寫：
   - Commit message: `初始化奇華智能行銷官網 - 包含霓虹效果修復`
2. 點擊 "Commit changes"

### 步驟 4: 啟用 GitHub Pages
1. 在倉庫頁面點擊 "Settings"
2. 向下滾動找到 "Pages" 部分
3. 在 "Source" 選擇 "Deploy from a branch"
4. 在 "Branch" 選擇 "main"
5. 點擊 "Save"
6. 等待 2-5 分鐘，您會得到一個網址：
   `https://您的用戶名.github.io/qihua-ai-website`

## 💻 **方法 2: 使用 Git 命令（進階）**

### 前置需求
- 安裝 Git: [git-scm.com](https://git-scm.com/)
- 有基本的命令列操作經驗

### Git 部署步驟
```bash
# 1. 克隆您的倉庫
git clone https://github.com/您的用戶名/qihua-ai-website.git

# 2. 進入資料夾
cd qihua-ai-website

# 3. 將所有專案檔案複製到這個資料夾

# 4. 添加檔案
git add .

# 5. 提交更改
git commit -m "初始化奇華智能行銷官網 - 包含霓虹效果修復"

# 6. 推送到 GitHub
git push origin main
```

## ⚠️ **注意事項**

### 檔案結構確認
請確保上傳後的 GitHub 倉庫結構如下：
```
qihua-ai-website/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    └── company-logo.png
```

### 常見問題
1. **網站沒有顯示**：
   - 確認 GitHub Pages 已啟用
   - 檢查檔案路徑是否正確
   - 等待 5-10 分鐘讓 GitHub Pages 生效

2. **圖片沒有顯示**：
   - 確認 `images/` 資料夾已上傳
   - 檢查檔案名稱是否正確

3. **樣式沒有套用**：
   - 確認 `css/style.css` 檔案已上傳
   - 檢查檔案路徑

## 🎉 **完成後**

部署成功後，您可以：
1. 訪問您的網站：`https://您的用戶名.github.io/qihua-ai-website`
2. 分享給他人查看
3. 日後更新只需重新上傳修改的檔案

## 📞 **需要幫助？**

如果遇到問題，可以：
1. 檢查 GitHub Pages 狀態
2. 查看瀏覽器控制台的錯誤訊息
3. 確認所有檔案路徑正確