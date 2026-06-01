// ==========================================
// 状態管理データ・マスターデータ
// ==========================================

// レシピごとの作成回数カウント
const recipeStats = {
    "カレー": 0, "ハンバーグ": 0, "チーズインハンバーグ": 0,
    "豆腐ハンバーグ": 0, "シチュー": 0, "肉じゃが": 0, "オムライス": 0
};

const OFTEN_MADE_THRESHOLD = 1;

// 📸 レシピごとの画像パス定義
const recipeImages = {
    "カレー": "../img/カレーライス.png",
    "ハンバーグ": "../img/ハンバーグ.png",
    "チーズインハンバーグ": "../img/チーズインハンバーグ.png",
    "豆腐ハンバーグ": "../img/豆腐ハンバーグ.png",
    "シチュー": "../img/シチュー.png",
    "肉じゃが": "../img/肉じゃが.png",
    "オムライス": "../img/オムライス.png"
};

// ❤️ お気に入り登録されたレシピの名前を管理する配列
let favoriteRecipes = []; 

// 買い物メモの初期データ
let shoppingMemos = [];

// レシピごとの基本材料
const recipes = {
    "カレー": ["玉ねぎ", "じゃがいも", "にんじん", "豚肉", "カレールー", "サラダ油", "水"],
    "ハンバーグ": ["挽肉", "玉ねぎ", "パン粉", "卵"],
    "チーズインハンバーグ": ["挽肉", "玉ねぎ", "チーズ", "パン粉", "卵"],
    "豆腐ハンバーグ": ["挽肉", "豆腐", "玉ねぎ", "パン粉"],
    "シチュー": ["鶏肉", "じゃがいも", "にんじん", "玉ねぎ", "ブロッコリー", "牛乳", "シチュールー"],
    "肉じゃが": ["牛肉", "じゃがいも", "にんじん", "糸こんにゃく"],
    "オムライス": ["卵", "鶏肉", "玉ねぎ", "ごはん", "ケチャップ"]
};

let currentRecipe = { name: "", ingredients: [] };
let currentShoppingMemoId = null;

// 🌟 自由入力での新規リスト作成用のテンポラリデータ
let newListIngredients = [];

// 冷蔵庫の在庫データ
let fridgeStocks = {
    "玉ねぎ": false, "じゃがいも": false, "にんじん": false, "キャベツ": false, "豚肉": false, "挽肉": false, "卵": false
};

// カテゴリーごとの食材マスター
const fridgeCategories = {
    "野菜": ["玉ねぎ", "じゃがいも", "にんじん", "キャベツ"],
    "肉・魚": ["豚肉", "牛肉", "挽肉", "鶏肉"],
    "卵・乳製品": ["卵", "チーズ"],
    "ignore": ["カレールー", "サラダ油", "パン粉", "豆腐"]
};

let currentFridgeCategory = "野菜";

// 🍲 レシピのカテゴリ分けマスターデータ
// 🍲 新しいカテゴリ名に合わせて料理を配置する
const recipesByCategory = {
    "ごはんもの": ["カレー", "オムライス"],
    "麺類": [],
    "スープ": ["シチュー"],
    "肉・魚料理": ["ハンバーグ", "チーズインハンバーグ", "肉じゃが"],
    "おかず": ["豆腐ハンバーグ"],
    "サラダ": [],
    "パン・ピザ": [],
    "デザート": [],
    "その他": []
};

const recipeCategoryIcons = {
    "ごはんもの": "🍚", "麺類": "🍜", "スープ": "🥣", "肉・魚料理": "🥩", "おかず": "🍳", "サラダ": "🥗", "パン・ピザ": "🍞", "デザート": "🍓", "その他": "🍲"
};

let currentRecipeCategory = null;


// ==========================================
// 🌟 共通ヘルパー関数（料理カードのHTML生成）
// ==========================================
function generateRecipeCardHtml(name) {
    const imgSrc = recipeImages[name] || "https://placehold.co/150x100/fff3f3/ffb6b6?text=No+Image";
    const isFav = favoriteRecipes.includes(name);
    const heartHtml = isFav ? `<div class="card-fav-heart">❤️</div>` : "";
    
    return `
        <div class="recipe-vertical-card" onclick="openRecipeDetail('${name}')">
            ${heartHtml}
            <div class="card-img-area">
                <img src="${imgSrc}" alt="${name}" class="recipe-card-thumb" onerror="this.onerror=null; this.src='https://placehold.co/150x100/fff3f3/ffb6b6?text=No+Image'">
            </div>
            <div class="card-title-area">${name}</div>
        </div>
    `;
}

// ==========================================
// ページ定義（HTMLテンプレート）
// ==========================================
const pages = {
    home: () => {
        const oftenMadeRecipes = Object.keys(recipeStats).filter(name => recipeStats[name] >= OFTEN_MADE_THRESHOLD);
        let recipeSectionHtml = "";
        if (oftenMadeRecipes.length > 0) {
            recipeSectionHtml = `
                <section>
                    <div class="section-title"><h2>よく作るレシピ</h2><span onclick="router('recipeList')">すべて見る ></span></div>
                    <div class="recipe-cards-scroll-row" style="display:flex; gap:12px; overflow-x: auto; padding-bottom: 5px;">
                        ${oftenMadeRecipes.map(name => generateRecipeCardHtml(name)).join('')}
                    </div>
                </section>`;
        }

        let memoSectionHtml = "";
        if (shoppingMemos.length === 0) {
            memoSectionHtml = `
                <section>
                    <div class="section-title"><h2>最近のメモ</h2></div>
                    <div style="text-align: center;">
                        <p style="color: #888; margin-bottom: 15px;">買い物リストを作ろう。</p>
                        <button class="btn-primary" onclick="router('recipeList')">買い物リストを作る</button>
                    </div>
                </section>`;
        } else {
            const latestMemos = shoppingMemos.slice(0, 3);
            memoSectionHtml = `
                <section>
                    <div class="section-title">
                        <h2>最近のメモ</h2>
                        <span onclick="router('shopping')" style="cursor:pointer; color:#ffb6b6;">すべて見る ></span>
                    </div>
                    <ul style="list-style:none; padding:0;">
                        ${latestMemos.map(m => `
                            <li class="item" onclick="openShoppingDetail(${m.id})" style="cursor:pointer;">
                                <span>🛒 ${m.title} ${m.status === 'completed' ? '<span class="badge-done">完了</span>' : ''}</span>
                                <span>${m.date}</span>
                            </li>`).join('')}
                    </ul>
                </section>`;
        }

        return `
            <header>
                <div class="menu-profile-header">
                    <div class="menu-avatar">
                        <img src="./img/logo.png" alt="">
                    </div>
                    <div class="menu-header-text">
                        <h2>stocca.</h2>
                        <p>買い物を、もっとかんたんに。</p>
                    </div>
                </div>
                <div class="search-container">
                    <input type="text" id="search-input" class="search-box" placeholder="🔍 作りたい料理を検索" oninput="handleSearch(this.value)">
                    <div id="search-suggestions" class="suggestions-list"></div>
                </div>
            </header>
            ${recipeSectionHtml}
            <section class="navigation-boxes" style="display:flex; gap:10px; margin:20px 0;">
                <div class="box" style="background:#fff0f0; border-radius:15px; cursor:pointer;" onclick="router('shopping')">
                    <img src = "../img/cart_icon.png" alt="">
                    <div>
                        <h3>買い物リスト</h3>
                        <p>リストを確認</p>
                    </div>
                </div>
                <div class="box" style="background:#f0f7f0; border-radius:15px; flex:1; cursor:pointer;" onclick="router('fridge')">
                <img src = "../img/refrigerator_icon.png" alt="">
                    <div>
                        <h3>冷蔵庫メモ</h3>
                        <p>あるものを確認</p>
                    </div>
                </div>
            </section>
            ${memoSectionHtml}`;
    },
    
    recipeList: () => {
        if (currentRecipeCategory) {
            const currentCategoryItems = recipesByCategory[currentRecipeCategory] || [];
            let categoryRecipesHtml = "";
            if (currentCategoryItems.length === 0) {
                categoryRecipesHtml = `<p style="text-align:center; color:#999; padding:40px 20px; font-size:14px;">このカテゴリのレシピは準備中です</p>`;
            } else {
                categoryRecipesHtml = `
                    <div class="recipe-vertical-grid">
                        ${currentCategoryItems.map(name => generateRecipeCardHtml(name)).join('')}
                    </div>`;
            }

            return `
                <div class="recipe-detail-header" style="margin-bottom: 20px;">
                    <span class="back-arrow" onclick="switchRecipeCategory(null)">＜</span>
                    <h2 class="recipe-detail-title">${currentRecipeCategory}の一覧</h2>
                </div>
                <div class="ingredients-section-card" style="background: #fff; border-radius: 20px; padding: 20px 15px;">
                    ${categoryRecipesHtml}
                </div>
            `;
        }

        const oftenMadeRecipes = Object.keys(recipeStats).filter(name => recipeStats[name] >= OFTEN_MADE_THRESHOLD);
        let oftenSectionHtml = `<p style="color:#999; font-size:13px; padding-left:10px; margin: 5px 0;">まだありません</p>`;
        if (oftenMadeRecipes.length > 0) {
            oftenSectionHtml = `
                <div class="recipe-vertical-grid">
                    ${oftenMadeRecipes.map(name => generateRecipeCardHtml(name)).join('')}
                </div>`;
        }

        const popularRecipes = ["シチュー", "肉じゃが", "チーズインハンバーグ"];
        const popularSectionHtml = `
            <div class="recipe-vertical-grid">
                ${popularRecipes.map(name => generateRecipeCardHtml(name)).join('')}
            </div>`;

        const categories = ["ごはんもの", "麺類", "スープ", "肉・魚料理", "おかず", "サラダ", "パン・ピザ", "デザート", "その他"];
        const categoryTilesHtml = categories.map(cat => {
            const icon = recipeCategoryIcons[cat] || "🍔";
            return `
                <div class="recipe-category-tile" onclick="switchRecipeCategory('${cat}')">
                    <div class="tile-icon">${icon}</div>
                    <div class="tile-name">${cat}</div>
                </div>`;
        }).join('');

        return `
            <h2>レシピを選ぶ</h2>
            <div class="search-container">
                <input type="text" id="search-input" class="search-box" placeholder="🔍 作りたい料理を検索" oninput="handleSearch(this.value)">
                <div id="search-suggestions" class="suggestions-list"></div>
            </div>
            <section class="recipe-section-group">
                <h3 class="recipe-section-title">よく作るレシピ</h3>
                ${oftenSectionHtml}
            </section>
            
            <section class="recipe-section-group">
                <h3 class="recipe-section-title">人気のレシピ</h3>
                ${popularSectionHtml}
            </section>
            
            <section class="recipe-section-group">
                <h3 class="recipe-section-title">カテゴリから探す</h3>
                <div class="recipe-category-tile-grid">
                    ${categoryTilesHtml}
                </div>
            </section>
        `;
    },

    recipeDetail: () => {
        const buyCount = currentRecipe.ingredients.filter(i => i.status === "needed").length;
        const imgSrc = recipeImages[currentRecipe.name] || "https://placehold.co/300x180/fff3f3/ffb6b6?text=No+Image";
        const isFav = favoriteRecipes.includes(currentRecipe.name);

        return `
            <div class="recipe-detail-header">
                <span class="back-arrow" onclick="router('recipeList')">＜</span>
                <h2 class="recipe-detail-title">${currentRecipe.name}の材料</h2>
                <span id="detail-fav-btn" class="detail-fav-toggle" onclick="toggleFavorite('${currentRecipe.name}')" style="cursor:pointer; font-size:22px; margin-left:auto; padding-right:10px;">
                    ${isFav ? '❤️' : '🖤'}
                </span>
            </div>
            
            <div class="recipe-illustration-box" style="padding:0;">
                <img src="${imgSrc}" alt="${currentRecipe.name}" style="width:100%; height:100%; object-fit: cover;">
            </div>

            <div class="recipe-filter-tabs">
                <span class="filter-tab active">すべての材料</span>
                <span class="filter-tab">あるもの</span>
                <span class="filter-tab">いらないもの</span>
            </div>

            <div class="ingredients-section-card">
                <h3>基本の材料</h3>
                <div id="ing-container"></div>
            </div>

            <div class="extra-ingredients-card">
                <h3>追加したいもの</h3>
                <div class="extra-input-row">
                    <input type="text" id="extra-ing" placeholder="例）チーズ、きのこなど">
                    <button class="btn-add-extra" onclick="addExtraIngredient()">＋ 追加</button>
                </div>
            </div>

            <div class="recipe-bottom-bar">
                <div class="buy-summary-text">買うもの：<strong>${buyCount}点</strong></div>
                <button class="btn-confirm-next" onclick="renderConfirm()">確認へ</button>
            </div>
        `;
    },

    shopping: () => {
        const activeMemos = shoppingMemos.filter(m => m.status === 'active');
        const completedMemos = shoppingMemos.filter(m => m.status === 'completed');

        return `
            <h2>買い物リスト</h2>
            <div class="shopping-tabs" style="display:flex; justify-content:space-around; margin-bottom:15px;">
                <button class="tab-btn active" id="tab-active" onclick="switchShoppingTab('active')">未完了 (${activeMemos.length})</button>
                <button class="tab-btn" id="tab-completed" onclick="switchShoppingTab('completed')">買い物完了 (${completedMemos.length})</button>
            </div>
            
            <div id="list-active">
                <ul style="list-style:none; padding:0;">
                    ${activeMemos.length === 0 ? '<p style="text-align:center; color:#999; padding:20px;">未完了のリストはありません</p>' : 
                      activeMemos.map(m => `<li class="item" onclick="openShoppingDetail(${m.id})" style="cursor:pointer;"><span>🛒 ${m.title}</span><span>${m.date}</span></li>`).join('')}
                </ul>
            </div>
            <div id="list-completed" style="display:none;">
                <ul style="list-style:none; padding:0;">
                    ${completedMemos.length === 0 ? '<p style="text-align:center; color:#999; padding:20px;">完了したリストはありません</p>' : 
                      completedMemos.map(m => `<li class="item" onclick="openShoppingDetail(${m.id})" style="cursor:pointer; opacity:0.7;"><span>✅ ${m.title}</span><span>${m.date}</span></li>`).join('')}
                </ul>
            </div>
            <button class="fab" onclick="addList()" style="position:fixed; bottom:90px; right:20px; width:60px; height:60px; border-radius:50%; border:none; background:#ffb6b6; color:white; font-size:30px; cursor:pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">+</button>`;
    },

    shoppingDetail: () => {
        const memo = shoppingMemos.find(m => m.id === currentShoppingMemoId);
        if (!memo) return "データが見つかりません";
        const allChecked = memo.ingredients.every(i => i.checked);
        const btnDisabledAttr = allChecked ? "" : "disabled style='background:#ccc; cursor:not-allowed;'";

        return `
            <h2>${memo.recipeName || '自由入力'} の買い物チェック</h2>
            <div style="margin-bottom: 20px; background:#fff; padding:15px; border-radius:15px;">
                <p style="margin:0 0 10px 0; font-size:12px; color:#888;">タップしてカゴに入れたものをチェック</p>
                <ul style="list-style:none; padding:0; margin:0;">
                    ${memo.ingredients.map((ing, index) => `
                        <li class="item" onclick="toggleShoppingCheck(${index})" style="cursor:pointer; background:${ing.checked ? '#f0f0f0' : '#fff'}">
                            <span style="${ing.checked ? 'text-decoration: line-through; color:#aaa;' : ''}">
                                ${ing.checked ? '☑' : '☐'} ${ing.name}
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            ${memo.status === 'active' ? 
                `<button class="btn-primary" id="complete-shopping-btn" ${btnDisabledAttr} onclick="clickCompleteShopping()">買い物完了</button>` : 
                `<p style="text-align:center; color:green; font-weight:bold;">このお買い物は完了しています</p>`
            }
            <button class="btn-secondary" onclick="router('shopping')" style="margin-top:10px; width:100%; padding:12px; border-radius:10px; border:1px solid #ccc; background:#fff;">リスト一覧に戻る</button>
        `;
    },

    fridge: () => {
        return `
            <div class="recipe-detail-header">
                <span class="back-arrow" onclick="router('home')">＜</span>
                <h2 class="recipe-detail-title">冷蔵庫メモ</h2>
            </div>

            <div class="fridge-top-tabs">
                <span class="fridge-tab active">食材</span>
                <span class="fridge-tab">リストから追加</span>
            </div>

            <div class="fridge-category-row">
                <div class="category-item ${currentFridgeCategory === '野菜' ? 'active' : ''}" onclick="switchFridgeCategory('野菜')">
                    <div class="category-icon">🥦</div><div class="category-name">野菜</div>
                </div>
                <div class="category-item ${currentFridgeCategory === '肉・魚' ? 'active' : ''}" onclick="switchFridgeCategory('肉・魚')">
                    <div class="category-icon">🥩</div><div class="category-name">肉・魚</div>
                </div>
                <div class="category-item ${currentFridgeCategory === '卵・乳製品' ? 'active' : ''}" onclick="switchFridgeCategory('卵・乳製品')">
                    <div class="category-icon">🍳</div><div class="category-name">卵・乳製品</div>
                </div>
                <div class="category-item ${currentFridgeCategory === 'その他' ? 'active' : ''}" onclick="switchFridgeCategory('その他')">
                    <div class="category-icon">🎲</div><div class="category-name">その他</div>
                </div>
            </div>

            <div class="ingredients-section-card">
                <h3>${currentFridgeCategory}</h3>
                <div id="fridge-list-container"></div>
            </div>

            <div class="extra-ingredients-card">
                <div class="extra-input-row">
                    <input type="text" id="new-fridge-item" placeholder="+ 食材を追加">
                    <button class="btn-add-extra" onclick="addNewFridgeItem()">追加</button>
                </div>
            </div>
        `;
    },

    menu: () => {
        return `
            <div class="menu-profile-header">
                <div class="menu-avatar">
                    <img src="./img/logo.png" alt="">
                </div>
                <div class="menu-header-text">
                    <h2>stocca.</h2>
                    <p>買い物を、もっとかんたんに。</p>
                </div>
            </div>

            <div class="menu-list-card">
                <div class="menu-item" onclick="router('fridge')">
                    <div class="menu-item-left"><img src="../img/refrigerator_icon.png" alt=""><span>冷蔵庫メモ</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
                <div class="menu-item" onclick="showToast('食材カテゴリの管理は準備中です')">
                    <div class="menu-item-left"><img src="../img/food_icon.png" alt=""><span>食材カテゴリの管理</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
                <div class="menu-item" onclick="showToast('よく使うレシピの管理は準備中です')">
                    <div class="menu-item-left"><img src="../img/recipe_icon.png" alt=""><span>よく使うレシピの管理</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
                <div class="menu-item" onclick="showToast('データのバックアップは準備中です')">
                    <div class="menu-item-left"><img src="../img/backup_icon.png" alt=""><span>データのバックアップ</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
            </div>

            <div class="menu-list-card">
                <div class="menu-item" onclick="router('guide')">
                    <div class="menu-item-left"><img src="../img/howto_icon.png" alt=""><span>使い方ガイド</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
                <div class="menu-item" onclick="router('contact')">
                    <div class="menu-item-left"><img src="../img/mail_icon.png" alt=""><span>お問い合わせ</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
                <div class="menu-item" onclick="router('privacy')">
                    <div class="menu-item-left"><img src="../img/lock_icon.png" alt=""><span>プライバシーポリシー</span></div>
                    <div class="menu-item-arrow">＞</div>
                </div>
            </div>

            <div class="menu-footer-illustration">
                <div class="footer-cat-emoji">
                    <img src="../img/cat.png" alt="">
                </div>
                <div class="footer-message">
                    今日は何を作ろう？
                </div>
            </div>
        `;
    },

    guide: () => {
        return `
            <div class="recipe-detail-header" style="margin-bottom: 15px;">
                <span class="back-arrow" onclick="router('menu')">＜</span>
                <h2 class="recipe-detail-title">使い方ガイド</h2>
            </div>

            <div class="ingredients-section-card" style="margin-bottom: 15px; background: #fff; padding: 20px 15px; border-radius: 20px;">
                <h3 style="margin-top: 0; color: #ffb6b6; font-size: 16px;">🛒 1. 買い物リストをつくる</h3>
                <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 5px 0 12px 0;">
                    「レシピ」タブやホームの検索から料理を選び、材料の「ある」「なし」をタップで仕分けして「保存」するだけで、スマートな買い物リストが自動で完成します。下部メニューなどの「＋」ボタンから、自由に入力してリストを作ることもできます。
                </p>

                <h3 style="margin-top: 20px; color: #ffb6b6; font-size: 16px;">☑ 2. お買い物中にチェックする</h3>
                <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 5px 0 12px 0;">
                    スーパーなどでカゴに入れた食材をタップすると、その場で「打ち消し線」がついてチェックされます。買い忘れのない快適なお買い物をサポートします。
                </p>

                <h3 style="margin-top: 20px; color: #ffb6b6; font-size: 16px;">🥦 3. 冷蔵庫を管理する</h3>
                <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 5px 0 0 0;">
                    「冷蔵庫メモ」では、おうちにある食材をカテゴリ別にストック管理できます。ここに入っている食材は、レシピ詳細を開いたときに自動的に「あるもの」として判定されます。
                </p>
            </div>

            <div class="extra-ingredients-card" style="background: #fff0f0; border: none; padding: 15px; border-radius: 20px; text-align: center;">
                <p style="font-size: 12px; color: #f58f8f; font-weight: bold; margin: 0;">
                    💡 お気に入り機能<br>
                    レシピの右上にあるハートをタップすると、よく作るレシピにすばやくアクセスできるようになります！
                </p>
            </div>
        `;
    },

    createList: () => {
        return `
            <div class="recipe-detail-header" style="margin-bottom: 15px;">
                <span class="back-arrow" onclick="router('shopping')">＜</span>
                <h2 class="recipe-detail-title">新しくリストを作る</h2>
            </div>

            <div class="extra-ingredients-card" style="background:#fff; border:none; padding:15px; border-radius:20px; margin-bottom:15px;">
                <label style="font-size:13px; color:#666; font-weight:bold; display:block; margin-bottom:5px;">メモのタイトル</label>
                <input type="text" id="custom-list-title" placeholder="例）週末のまとめ買い、日用品など" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:10px; box-sizing:border-box; margin-bottom:15px;">

                <label style="font-size:13px; color:#666; font-weight:bold; display:block; margin-bottom:5px;">食材の追加</label>
                <div class="extra-input-row" style="display:flex; gap:8px;">
                    <input type="text" id="custom-list-item-input" placeholder="例）トマト、牛乳など" style="flex:1;">
                    <button class="btn-add-extra" onclick="addIngredientToCustomList()" style="white-space:nowrap;">＋ 追加</button>
                </div>
            </div>

            <div class="ingredients-section-card" style="background:#fff; border-radius:20px; padding:15px; min-height:150px; margin-bottom:80px;">
                <h3 style="margin-top:0; font-size:14px; color:#333; border-bottom:1px solid #eee; padding-bottom:8px;">追加した食材一覧</h3>
                <div id="custom-list-items-container"></div>
            </div>

            <div class="recipe-bottom-bar" style="justify-content: center; padding: 10px 20px;">
                <button class="btn-confirm-next" onclick="saveCustomShoppingList()" style="width:100%; max-width:340px;">この内容でリストを保存する</button>
            </div>
        `;
    },

    privacy: () => {
        return `
            <div class="recipe-detail-header">
                <span class="back-arrow" onclick="router('menu')">＜</span>
                <h2 class="recipe-detail-title">プライバシーポリシー</h2>
            </div>

            <div class="privacy-content-card">
                <p class="privacy-date">制定日：2026年6月1日</p>
                <h3>1. 個人情報の収集について</h3>
                <p>当アプリ（stocca.）は、ユーザーの氏名、メールアドレス、電話番号などの個人情報を一切収集いたしません。</p>
                <h3>2. データの保存先について</h3>
                <p>ユーザーが入力したレシピデータ、買い物メモ、冷蔵庫の在庫データは、すべてユーザーがご使用のスマートフォン端末内（ローカルストレージ等）にのみ保存されます。</p>
                <h3>3. 免責事項</h3>
                <p>当アプリの利用によって生じたトラブルや損失・損害等について、開発者は一切の責任を負いかねます。</p>
                <h3>4. お問い合わせ</h3>
                <p>公式Xアカウント<strong>（@JwfrlL）</strong>のDMまたはリプライにてお気軽にお寄せください。</p>
            </div>
        `;
    },

    contact: () => {
        return `
            <div class="recipe-detail-header">
                <span class="back-arrow" onclick="router('menu')">＜</span>
                <h2 class="recipe-detail-title">お問い合わせ</h2>
            </div>

            <div class="contact-content-card">
                <p>当アプリ「stocca.」をご利用いただきありがとうございます！</p>
                <div class="contact-account-box">
                    <span class="x-badge">X (旧Twitter)</span>
                    <strong class="x-username">@JwfrlL</strong>
                </div>
                <p class="contact-sub-text">※DMまたはリプライにて受け付けております。</p>
            </div>
        `;
    }
};


// ==========================================
// 画面遷移・ロジック
// ==========================================

function router(pageName) {
    const app = document.getElementById('app');
    app.style.opacity = "0";
    setTimeout(() => {
        app.innerHTML = typeof pages[pageName] === 'function' ? pages[pageName]() : pages[pageName];
        if (pageName === 'recipeDetail') renderRecipeDetail();
        if (pageName === 'fridge') renderFridgeList();
        if (pageName === 'createList') renderCustomListItems();
        
        updateBottomNav(pageName);
        app.style.opacity = "1";
    }, 300);
}

function handleSearch(keyword) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;
    if (!keyword.trim()) {
        suggestionsContainer.innerHTML = "";
        suggestionsContainer.style.display = "none";
        return;
    }
    const matchedRecipes = Object.keys(recipes).filter(recipeName => recipeName.includes(keyword));
    if (matchedRecipes.length === 0) {
        suggestionsContainer.innerHTML = `<div class="suggestion-item no-result">見つかりませんでした</div>`;
    } else {
        suggestionsContainer.innerHTML = matchedRecipes.map(name => `<div class="suggestion-item" onclick="openRecipeDetail('${name}')">🔍 ${name}</div>`).join('');
    }
    suggestionsContainer.style.display = "block";
}

function openRecipeDetail(name) {
    currentRecipe = {
        name: name,
        ingredients: recipes[name].map(i => {
            const isStocked = fridgeStocks[i] === true;
            return { name: i, status: isStocked ? "have" : "needed" };
        })
    };
    router('recipeDetail');
}

function renderRecipeDetail() {
    const container = document.getElementById('ing-container');
    if (!container) return;

    container.innerHTML = currentRecipe.ingredients.map((ing, i) => {
        const isNeeded = ing.status === "needed";
        const checkIconHtml = isNeeded ? `<div class="custom-checkbox checked">✓</div>` : `<div class="custom-checkbox"></div>`;
        let badgeHtml = ing.status === "have" ? `<span class="ing-badge status-have">ある</span>` : (ing.status === "notneeded" ? `<span class="ing-badge status-none">いらない</span>` : "");

        return `
            <div class="recipe-ing-row" onclick="toggleRecipeIngredient(${i})">
                <div class="ing-left-click">
                    ${checkIconHtml}
                    <span class="ing-name-text" style="${!isNeeded ? 'color: #bbb;' : ''}">${ing.name}</span>
                </div>
                <div class="ing-right-badge">${badgeHtml}</div>
            </div>
        `;
    }).join('');
}

function toggleRecipeIngredient(index) {
    const currentStatus = currentRecipe.ingredients[index].status;
    currentRecipe.ingredients[index].status = currentStatus === "needed" ? "have" : (currentStatus === "have" ? "notneeded" : "needed");
    reRenderRecipePage();
}

function reRenderRecipePage() {
    const buyCount = currentRecipe.ingredients.filter(i => i.status === "needed").length;
    const countEl = document.querySelector('.buy-summary-text strong');
    if (countEl) countEl.innerText = `${buyCount}点`;
    renderRecipeDetail();
}

function addExtraIngredient() {
    const input = document.getElementById('extra-ing');
    const val = input ? input.value.trim() : "";
    if (val) {
        currentRecipe.ingredients.push({ name: val, status: "needed" });
        input.value = "";
        reRenderRecipePage();
        showToast(`➕「${val}」を追加しました`);
    }
}

function toggleFavorite(recipeName) {
    const index = favoriteRecipes.indexOf(recipeName);
    const favBtn = document.getElementById('detail-fav-btn');
    
    if (index > -1) {
        favoriteRecipes.splice(index, 1);
        showToast(`🖤「${recipeName}」をお気に入りから外しました`);
        if (favBtn) favBtn.innerText = '🖤';
    } else {
        favoriteRecipes.push(recipeName);
        showToast(`❤️「${recipeName}」をお気に入り登録しました！`);
        if (favBtn) favBtn.innerText = '❤️';
    }
}

function switchFridgeCategory(categoryName) { currentFridgeCategory = categoryName; router('fridge'); }
function switchRecipeCategory(categoryName) { currentRecipeCategory = categoryName; router('recipeList'); }

function renderFridgeList() {
    const container = document.getElementById('fridge-list-container');
    if (!container) return;
    const currentItems = fridgeCategories[currentFridgeCategory] || [];

    container.innerHTML = currentItems.map(name => {
        const hasStock = fridgeStocks[name] === true;
        const checkIconHtml = hasStock ? `<div class="custom-checkbox checked">✓</div>` : `<div class="custom-checkbox"></div>`;
        return `
            <div class="recipe-ing-row" onclick="toggleFridgeStock('${name}')">
                <div class="ing-left-click">
                    ${checkIconHtml}
                    <span class="ing-name-text" style="${hasStock ? 'color: #333; font-weight: bold;' : 'color: #aaa;'}">${name}</span>
                </div>
            </div>
        `;
    }).join('');
}

function toggleFridgeStock(name) { fridgeStocks[name] = !fridgeStocks[name]; renderFridgeList(); }

function addNewFridgeItem() {
    const input = document.getElementById('new-fridge-item');
    const val = input ? input.value.trim() : "";
    if (val) {
        if (!fridgeCategories[currentFridgeCategory].includes(val)) fridgeCategories[currentFridgeCategory].push(val);
        fridgeStocks[val] = true;
        input.value = "";
        renderFridgeList();
        showToast(`🥦「${val}」を冷蔵庫に登録しました`);
    }
}

function renderConfirm() {
    const app = document.getElementById('app');
    const buy = currentRecipe.ingredients.filter(i => i.status === "needed");
    const have = currentRecipe.ingredients.filter(i => i.status === "have");
    const none = currentRecipe.ingredients.filter(i => i.status === "notneeded");
    app.innerHTML = `
        <h2>最終確認</h2>
        <div class="item">買うもの: ${buy.map(i => i.name).join(', ') || 'なし'}</div>
        <div class="item">あるもの: ${have.map(i => i.name).join(', ') || 'なし'}</div>
        <div class="item">不要: ${none.map(i => i.name).join(', ') || 'なし'}</div>
        <button class="btn-primary" onclick="saveToShoppingList()">リストを保存する</button>`;
}

// 料理名（currentRecipe.name）だけをシンプルに入れるように変更
function saveToShoppingList() {
    const buyIngredients = currentRecipe.ingredients.filter(i => i.status === "needed");
    const checkList = buyIngredients.map(i => ({ name: i.name, checked: false }));

    shoppingMemos.unshift({ 
        id: Date.now(), 
        recipeName: currentRecipe.name, 
        title: currentRecipe.name, // 料理名だけを表示
        date: new Date().toLocaleDateString(), 
        status: "active", 
        ingredients: checkList
    });
    showToast("📝 リストを保存しました");
    router('shopping');
}

function switchShoppingTab(tab) {
    const activeBtn = document.getElementById('tab-active');
    const completedBtn = document.getElementById('tab-completed');
    const activeList = document.getElementById('list-active');
    const completedList = document.getElementById('list-completed');

    if (tab === 'active') {
        activeBtn.classList.add('active'); completedBtn.classList.remove('active'); activeList.style.display = 'block'; completedList.style.display = 'none';
    } else {
        activeBtn.classList.remove('active'); completedBtn.classList.add('active'); activeList.style.display = 'none'; completedList.style.display = 'block';
    }
}

function openShoppingDetail(id) { currentShoppingMemoId = id; router('shoppingDetail'); }

function toggleShoppingCheck(index) {
    const memo = shoppingMemos.find(m => m.id === currentShoppingMemoId);
    if (!memo || memo.status === 'completed') return;
    memo.ingredients[index].checked = !memo.ingredients[index].checked;
    document.getElementById('app').innerHTML = pages.shoppingDetail();
}

function clickCompleteShopping() {
    const modal = document.getElementById('custom-modal');
    if (!modal) return;
    modal.innerHTML = `
        <div class="modal-content">
            <h3>確認</h3><p>買い忘れたものはありませんか？</p>
            <div class="modal-actions">
                <button class="btn-modal-yes" onclick="handleModalResponse(true)">はい</button>
                <button class="btn-modal-no" onclick="handleModalResponse(false)">いいえ</button>
            </div>
        </div>`;
    modal.classList.add('active');
}

function handleModalResponse(isYes) {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.classList.remove('active');

    if (isYes) {
        const memo = shoppingMemos.find(m => m.id === currentShoppingMemoId);
        if (memo) {
            memo.status = "completed";
            if (recipeStats[memo.recipeName] !== undefined) recipeStats[memo.recipeName] += 1;
        }
        showToast("🛒 お買い物を完了しました！");
        router('shopping'); 
        setTimeout(() => switchShoppingTab('completed'), 50);
    }
}

function updateBottomNav(pageName) {
    const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
    let activePage = pageName;
    if (pageName === 'recipeDetail') activePage = 'recipeList';
    if (pageName === 'shoppingDetail') activePage = 'shopping';
    if (pageName === 'fridge') activePage = 'home';
    if (pageName === 'menu' || pageName === 'privacy' || pageName === 'contact' || pageName === 'guide') activePage = 'menu';
    if (pageName === 'createList') activePage = '';

    navButtons.forEach(btn => {
        const page = btn.getAttribute('data-page');
        
        // 🌟 文字列の書き換え処理を廃止し、activeクラスの付与・剥奪のみに集約
        if (page === activePage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}


// ==========================================
// 自由入力リスト作成のロジック
// ==========================================

function addList() {
    newListIngredients = [];
    router('createList');
}

function addIngredientToCustomList() {
    const input = document.getElementById('custom-list-item-input');
    const val = input ? input.value.trim() : "";
    if (val) {
        if (!newListIngredients.includes(val)) {
            newListIngredients.push(val);
            showToast(`➕「${val}」を追加しました`);
        } else {
            showToast(`⚠️「${val}」はすでに追加されています`);
        }
        input.value = "";
        renderCustomListItems();
        input.focus();
    }
}

function renderCustomListItems() {
    const container = document.getElementById('custom-list-items-container');
    if (!container) return;

    if (newListIngredients.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#999; padding:20px 0; font-size:13px; margin:0;">食材がありません。上の入力欄から追加してください。</p>`;
        return;
    }

    container.innerHTML = newListIngredients.map((name, index) => `
        <div class="recipe-ing-row" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 5px; border-bottom: 1px solid #f9f9f9;">
            <div style="display:flex; align-items:center; gap:10px;">
                <div class="custom-checkbox checked" style="background:#ffb6b6; border-color:#ffb6b6;">✓</div>
                <span class="ing-name-text" style="color:#333;">${name}</span>
            </div>
            <span onclick="removeIngredientFromCustomList(${index})" style="cursor:pointer; color:#ff8b8b; padding: 5px 10px; font-size:14px;">🗑️</span>
        </div>
    `).join('');
}

function removeIngredientFromCustomList(index) {
    const removedName = newListIngredients[index];
    newListIngredients.splice(index, 1);
    showToast(`🗑️「${removedName}」を外しました`);
    renderCustomListItems();
}

function saveCustomShoppingList() {
    const titleInput = document.getElementById('custom-list-title');
    let titleVal = titleInput ? titleInput.value.trim() : "";
    
    if (newListIngredients.length === 0) {
        showToast("⚠️ 食材を1つ以上追加してください");
        return;
    }

    if (!titleVal) {
        titleVal = "自由メモ: " + newListIngredients.slice(0, 2).join(', ');
        if (newListIngredients.length > 2) titleVal += " など";
    }

    const checkList = newListIngredients.map(name => ({ name: name, checked: false }));

    shoppingMemos.unshift({ 
        id: Date.now(), 
        recipeName: "自由入力", 
        title: titleVal, 
        date: new Date().toLocaleDateString(), 
        status: "active", 
        ingredients: checkList
    });

    showToast("📝 新しいリストを保存しました");
    router('shopping');
}


// ==========================================
// トースト通知の処理
// ==========================================
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.innerText = message;
    toast.classList.add('active');

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
    }, 2500);
}

// 初回起動時のレンダリング
window.onload = () => router('home');
