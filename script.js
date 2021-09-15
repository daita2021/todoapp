"use strict";
//各要素取得
const table = document.querySelector("table"); // テーブル
const todo = document.getElementById("todo"); // TODO
const priority = document.querySelector("select"); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 期日
const submit = document.getElementById("submit"); // 登録ボタン
const filterHigh = document.getElementById("priority"); // 絞り込みボタン高
const filterMiddle = document.getElementById("priority2"); // 絞り込みボタン中
const filterLow = document.getElementById("priority3"); // 絞り込みボタン低
const all = document.getElementById("all"); // 全表示
const removeButton = document.getElementById("remove"); // 削除ボタン

const storage = localStorage; // リストデータ保存のためのローカルストレージ
let list = []; // リストデータ保持のための空配列

//テーブルに登録内容を追加する関数
const addItem = (item) => {
  const tr = document.createElement("tr"); // tr要素を生成
  // オブジェクトの繰り返しはfor-in文
  for (const prop in item) {
    const td = document.createElement("td"); // td要素を生成
    if (prop == "done") {
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.checked = item[prop];
      td.appendChild(checkBox);
      checkBox.addEventListener("change", checkBoxListener);
    } else {
      td.textContent = item[prop]; // ブラケット記法で各プロパティにアクセス
    }
    tr.appendChild(td); // 生成したtd要素をtr要素に追加
  }
  table.append(tr); // tr要素をtable要素に追加
};

const checkBoxListener = (ev) => {
  // A. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev.currentTarget.parentElement.parentElement;

  // B. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementsByTagName("tr"));

  // C. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;

  // D. 配列listにそのインデックスでアクセスしてdoneを更新
  list[idx].done = ev.currentTarget.checked;

  // E. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
};

// ストレージデータのリスト反映処理
document.addEventListener("DOMContentLoaded", () => {
  const json = storage.todoList; // ストレージデータ（JSON）の読み込み
  if (json == undefined) {
    return; // ストレージデータがない場合は何もせず終了
  }

  list = JSON.parse(json); // JSONをオブジェクトの配列に変換して配列listに代入

  // 配列listのデータを元にテーブルに要素を追加
  for (const item of list) {
    addItem(item);
  }
});

// TODO登録ボタンクリック時の処理
submit.addEventListener("click", () => {
  const item = {}; // 入力値を一旦格納するオブジェクト用意

  //オブジェクトに4項目の値代入
  // 1
  if (todo.value != "") {
    item.todo = todo.value;
  } else {
    window.alert("タスクを入力してください");
    return;
  }
  // 2
  item.priority = priority.value;
  // 3
  if (deadline.value != "") {
    item.deadline = deadline.value;
  } else {
    item.deadline = "なし";
    // item.deadline = new Date().toLocaleDateString().replace(/\//g, "-");
  }

  // 4
  item.done = false;

  // フォームをリセットしtodoにフォーカス
  todo.value = "";
  priority.value = "中";
  deadline.value = "";
  todo.focus();

  addItem(item);

  list.push(item); // リスト配列に追加したタスクを入れる

  storage.todoList = JSON.stringify(list); //配列 list をストレージに記録
});

//リストを削除する関数
const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName("tr")); // tr 要素の NodeList を取得し配列に変換
  trList.shift(); //先頭の tr 要素（ヘッダー部分）をリストから除外

  //tr 要素を削除
  for (const tr of trList) {
    tr.remove();
  }
};

filterHigh.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority == "高") {
      addItem(item);
    }
  }
});

filterMiddle.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority == "中") {
      addItem(item);
    }
  }
});

filterLow.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority == "低") {
      addItem(item);
    }
  }
});

all.addEventListener("click", () => {
  location.reload();
});

removeButton.addEventListener("click", () => {
  clearTable(); // TODOデータを一旦削除
  list = list.filter((item) => item.done == false); // 未完了のタスクを抽出して完了したタスクを削除した配列作成
  list.forEach((item) => addItem(item)); // TODOデータをテーブルに追加
  storage.todoList = JSON.stringify(list); // ストレージデータも更新
});
